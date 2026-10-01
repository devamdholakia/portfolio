// the simulation itself: no React, no DOM, just state and time
import { MAX_ATTEMPTS, fullJitterDelay } from './backoff'
import {
  FAILURE_THRESHOLD,
  cancelProbe,
  createBreaker,
  poll,
  recordFailure,
  recordSuccess,
  startProbe,
} from './breaker'
import { createClock } from './clock'
import { mulberry32 } from './rng'
import { getScenario } from './scenarios'
import type { Action, Drink, KitchenState, LogKind, Ticket, TicketStatus, Worker } from './types'

export const DRINKS: Drink[] = ['espresso', 'latte', 'coldbrew', 'chai']
export const DRINK_NAMES: Record<Drink, string> = {
  espresso: 'Espresso',
  latte: 'Latte',
  coldbrew: 'Cold Brew',
  chai: 'Chai',
}

export const MAX_LIVE_TICKETS = 200
export const MAX_LOG = 50
export const SWEEP_EVERY_MS = 60000
export const SPARK_BUCKET_MS = 4000
export const SPARK_LENGTH = 30
const DEFAULT_WORKERS = 3
const DUPLICATE_GAP_MS = 600
// the largest slice of simulated time handled at once, keeps 5x accurate
const STEP_MS = 100

export const ticketNo = (id: number) => `#${String(id).padStart(4, '0')}`
const secs = (ms: number) => (ms / 1000).toFixed(1)

const LIVE: TicketStatus[] = ['waiting', 'brewing', 'retrying', 'parked', 'dead']

export function countByStatus(state: KitchenState) {
  const counts = { waiting: 0, brewing: 0, retrying: 0, parked: 0, dead: 0 }
  for (const t of state.tickets) {
    if (t.status !== 'delivered') counts[t.status]++
  }
  return counts
}

// the guarantee the whole demo is about: every order placed is accounted for
export function invariantHolds(state: KitchenState) {
  const c = countByStatus(state)
  return state.created === state.delivered + c.waiting + c.brewing + c.retrying + c.parked + c.dead
}

function makeWorkers(count: number): Worker[] {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, ticketId: null, brewTotal: 0, brewLeft: 0 }))
}

function initialState(): KitchenState {
  return {
    now: 0,
    speed: 1,
    paused: false,
    tickets: [],
    workers: makeWorkers(DEFAULT_WORKERS),
    counter: { mode: 'open', failureRate: 0.5 },
    breaker: createBreaker(),
    created: 0,
    delivered: 0,
    deliveredAttempts: 0,
    duplicates: 0,
    refused: 0,
    sweeps: 0,
    lastSweepAt: null,
    recentDelivered: [],
    log: [],
    spark: Array.from({ length: SPARK_LENGTH }, () => 0),
    scenarioId: null,
    streams: [],
    script: [],
  }
}

export function createEngine(seed = 2026) {
  const clock = createClock()
  let rand = mulberry32(seed)
  let state = initialState()
  let version = 0
  let nextTicketId = 1
  let nextLogId = 1
  let nextSweepAt = SWEEP_EVERY_MS
  let sparkStart = 0
  // orderId -> ticket number, the dedup window. It lasts the whole session
  let seen = new Map<string, number>()
  const listeners = new Set<() => void>()

  const emit = () => {
    version++
    listeners.forEach((listener) => listener())
  }

  function log(text: string, kind: LogKind = 'info') {
    state.log.unshift({ id: nextLogId++, at: state.now, text, kind })
    if (state.log.length > MAX_LOG) state.log.length = MAX_LOG
  }

  // where a ticket goes when it is ready for a barista
  const readyStatus = (): TicketStatus => (state.breaker.state === 'closed' ? 'waiting' : 'parked')

  function enqueue(ticket: Ticket) {
    ticket.status = readyStatus()
    ticket.queuedAt = state.now
    ticket.retryAt = null
    ticket.workerId = null
    ticket.orphaned = false
    ticket.probe = false
  }

  function placeOrder(drink: Drink, orderId?: string) {
    const id = orderId ?? `order-${nextTicketId}`
    const original = seen.get(id)
    if (original !== undefined) {
      state.duplicates++
      log(`${ticketNo(original)} duplicate blocked`, 'warn')
      return
    }
    const live = state.tickets.length
    if (live >= MAX_LIVE_TICKETS) {
      state.refused++
      log('Rail is full, order refused', 'warn')
      return
    }
    const ticket: Ticket = {
      id: nextTicketId++,
      orderId: id,
      drink,
      status: 'waiting',
      attempts: 0,
      queuedAt: state.now,
      retryAt: null,
      workerId: null,
      orphaned: false,
      probe: false,
    }
    seen.set(id, ticket.id)
    enqueue(ticket)
    state.tickets.push(ticket)
    state.created++
    log(`${ticketNo(ticket.id)} ${DRINK_NAMES[drink]} placed`)
  }

  const randomDrink = () => DRINKS[Math.floor(rand() * DRINKS.length)]

  function setWorkers(count: number) {
    const target = Math.max(1, Math.min(5, Math.round(count)))
    while (state.workers.length < target) {
      const id = (state.workers.at(-1)?.id ?? 0) + 1
      state.workers.push({ id, ticketId: null, brewTotal: 0, brewLeft: 0 })
    }
    while (state.workers.length > target) {
      const gone = state.workers.pop()!
      const ticket = state.tickets.find((t) => t.id === gone.ticketId)
      if (!ticket) continue
      // the order is left half made until the sweeper finds it
      ticket.orphaned = true
      ticket.workerId = null
      if (ticket.probe) {
        ticket.probe = false
        state.breaker = cancelProbe(state.breaker)
      }
      log(`${ticketNo(ticket.id)} orphaned, its barista went off shift`, 'warn')
    }
  }

  function parkWaiting() {
    for (const t of state.tickets) if (t.status === 'waiting') t.status = 'parked'
  }

  function unpark() {
    for (const t of state.tickets) if (t.status === 'parked') t.status = 'waiting'
  }

  function attemptDelivery(ticket: Ticket, worker: Worker) {
    worker.ticketId = null
    const allowed = state.breaker.state === 'closed' || ticket.probe
    if (!allowed) {
      // the breaker opened while this was being made: hold it, do not spend an attempt
      enqueue(ticket)
      return
    }

    ticket.attempts++
    const { mode, failureRate } = state.counter
    const failed = mode === 'closed' || (mode === 'flaky' && rand() < failureRate)
    const before = state.breaker.state

    if (!failed) {
      state.breaker = recordSuccess()
      state.delivered++
      state.deliveredAttempts += ticket.attempts
      state.spark[state.spark.length - 1]++
      state.recentDelivered.unshift({ id: ticket.id, drink: ticket.drink, attempts: ticket.attempts, at: state.now })
      if (state.recentDelivered.length > 3) state.recentDelivered.length = 3
      ticket.status = 'delivered'
      state.tickets = state.tickets.filter((t) => t !== ticket)
      log(`${ticketNo(ticket.id)} delivered on attempt ${ticket.attempts}`, 'ok')
      if (before !== 'closed') {
        log('Breaker CLOSED, the counter is back', 'ok')
        unpark()
      }
      return
    }

    state.breaker = recordFailure(state.breaker, state.now)
    ticket.probe = false
    ticket.workerId = null
    if (ticket.attempts >= MAX_ATTEMPTS) {
      ticket.status = 'dead'
      ticket.retryAt = null
      log(`${ticketNo(ticket.id)} gave up after ${MAX_ATTEMPTS} attempts, moved to the shelf`, 'bad')
    } else {
      const delay = fullJitterDelay(ticket.attempts, rand)
      ticket.status = 'retrying'
      ticket.retryAt = state.now + delay
      log(`${ticketNo(ticket.id)} delivery failed (attempt ${ticket.attempts}), retrying in ${secs(delay)}s`, 'warn')
    }

    if (state.breaker.state === 'open' && before === 'closed') {
      log(`Breaker OPEN after ${FAILURE_THRESHOLD} failures`, 'bad')
      parkWaiting()
    } else if (before === 'half-open') {
      log('Breaker OPEN again, the test delivery failed', 'bad')
    }
  }

  function nextTicketFor(): Ticket | null {
    const breaker = state.breaker
    const wanted: TicketStatus | null =
      breaker.state === 'closed' ? 'waiting' : breaker.state === 'half-open' && !breaker.probing ? 'parked' : null
    if (!wanted) return null
    let best: Ticket | null = null
    for (const t of state.tickets) {
      if (t.status !== wanted) continue
      if (!best || t.queuedAt < best.queuedAt || (t.queuedAt === best.queuedAt && t.id < best.id)) best = t
    }
    return best
  }

  function assignWork() {
    for (const worker of state.workers) {
      if (worker.ticketId !== null) continue
      const ticket = nextTicketFor()
      if (!ticket) return
      if (state.breaker.state === 'half-open') {
        state.breaker = startProbe(state.breaker)
        ticket.probe = true
      }
      ticket.status = 'brewing'
      ticket.workerId = worker.id
      worker.ticketId = ticket.id
      // a first attempt means making the drink, a retry is only the handoff
      worker.brewTotal = ticket.attempts === 0 ? 2400 + rand() * 2400 : 600 + rand() * 400
      worker.brewLeft = worker.brewTotal
    }
  }

  function sweep() {
    state.sweeps++
    state.lastSweepAt = state.now
    for (const t of state.tickets) {
      if (t.status === 'brewing' && t.orphaned) {
        enqueue(t)
        log(`Sweeper re-queued ${ticketNo(t.id)}`, 'ok')
      }
    }
  }

  function step(dt: number) {
    state.now += dt
    const now = state.now

    while (state.script.length && state.script[0].at <= now) apply(state.script.shift()!.action)

    for (const stream of state.streams) {
      while (stream.left > 0 && stream.nextAt <= now) {
        const drink = randomDrink()
        if (stream.duplicate) {
          const orderId = `order-${nextTicketId}`
          placeOrder(drink, orderId)
          schedule(now + DUPLICATE_GAP_MS, { type: 'order', drink, orderId })
        } else {
          placeOrder(drink)
        }
        stream.left--
        stream.nextAt += stream.intervalMs
      }
    }
    state.streams = state.streams.filter((s) => s.left > 0)

    const polled = poll(state.breaker, now)
    if (polled !== state.breaker) {
      state.breaker = polled
      log('Breaker HALF-OPEN, testing one delivery', 'warn')
    }

    for (const t of state.tickets) {
      if (t.status === 'retrying' && t.retryAt !== null && t.retryAt <= now) enqueue(t)
    }

    while (now >= nextSweepAt) {
      sweep()
      nextSweepAt += SWEEP_EVERY_MS
    }

    for (const worker of state.workers) {
      if (worker.ticketId === null) continue
      worker.brewLeft -= dt
      if (worker.brewLeft > 0) continue
      const ticket = state.tickets.find((t) => t.id === worker.ticketId)
      if (ticket) attemptDelivery(ticket, worker)
      else worker.ticketId = null
    }

    assignWork()

    while (now >= sparkStart + SPARK_BUCKET_MS) {
      state.spark.shift()
      state.spark.push(0)
      sparkStart += SPARK_BUCKET_MS
    }
  }

  function schedule(at: number, action: Action) {
    state.script.push({ at, action })
    state.script.sort((a, b) => a.at - b.at)
  }

  function reset() {
    const { speed, paused } = state
    state = initialState()
    state.speed = speed
    state.paused = paused
    rand = mulberry32(seed)
    nextTicketId = 1
    nextSweepAt = SWEEP_EVERY_MS
    sparkStart = 0
    seen = new Map()
  }

  function apply(action: Action) {
    switch (action.type) {
      case 'order':
        placeOrder(action.drink ?? randomDrink(), action.orderId)
        break
      case 'rush':
        // 20 orders over 3 real seconds at 1x
        state.streams.push({ nextAt: state.now, intervalMs: 600, left: 20, duplicate: false })
        break
      case 'doubleTap': {
        const drink = action.drink ?? randomDrink()
        const orderId = `order-${nextTicketId}`
        placeOrder(drink, orderId)
        schedule(state.now + DUPLICATE_GAP_MS, { type: 'order', drink, orderId })
        break
      }
      case 'counter':
        if (state.counter.mode !== action.mode) {
          state.counter.mode = action.mode
          log(`Counter is now ${action.mode}`, action.mode === 'open' ? 'ok' : 'warn')
        }
        break
      case 'failureRate':
        state.counter.failureRate = Math.max(0, Math.min(1, action.value))
        break
      case 'workers':
        setWorkers(action.count)
        break
      case 'speed':
        clock.setSpeed(action.value)
        state.speed = action.value
        break
      case 'pause':
        clock.setPaused(action.paused)
        state.paused = action.paused
        break
      case 'replay': {
        const dead = state.tickets.filter((t) => t.status === 'dead')
        for (const t of dead) {
          t.attempts = 0
          enqueue(t)
        }
        if (dead.length) log(`Replayed ${dead.length} ${dead.length === 1 ? 'order' : 'orders'} from the shelf`, 'ok')
        break
      }
      case 'reset':
        reset()
        break
      case 'scenario': {
        const scenario = getScenario(action.id)
        if (!scenario) break
        reset()
        state.scenarioId = scenario.id
        scenario.setup.forEach(apply)
        state.script = scenario.script.map((s) => ({ ...s })).sort((a, b) => a.at - b.at)
        state.streams = scenario.streams.map((s) => ({
          nextAt: s.startAt,
          intervalMs: s.intervalMs,
          left: s.count,
          duplicate: s.duplicate ?? false,
        }))
        // a preset should always play
        clock.setPaused(false)
        state.paused = false
        log(`Scenario: ${scenario.name}`)
        break
      }
    }
  }

  function checkInvariant() {
    if (process.env.NODE_ENV !== 'production' && !invariantHolds(state)) {
      throw new Error(`Kitchen invariant broken: an order was lost (${JSON.stringify(countByStatus(state))})`)
    }
  }

  return {
    getState: () => state,
    getVersion: () => version,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    // advance by simulated milliseconds
    tick(dtMs: number) {
      let left = dtMs
      while (left > 0) {
        const dt = Math.min(left, STEP_MS)
        step(dt)
        left -= dt
      }
      checkInvariant()
      emit()
    },
    // advance by real milliseconds, through the clock's speed and pause
    advance(realMs: number) {
      const dt = clock.advance(realMs)
      if (dt > 0) this.tick(dt)
    },
    dispatch(action: Action) {
      apply(action)
      checkInvariant()
      emit()
    },
  }
}

export type Engine = ReturnType<typeof createEngine>
export { LIVE as LIVE_STATUSES }
