// Barista Rush: take the order, pour, build, serve. Plain TypeScript, no React
import { mulberry32 } from '../kitchen/rng'
import type { Base, Customer, Drink, GameAction, GameState, Milk, Order, Pour, Result, Size, Syrup, Topping } from './types'

export const SIZE_NAMES: Record<Size, string> = { small: 'Small', medium: 'Medium', large: 'Large' }
export const BASE_NAMES: Record<Base, string> = { espresso: 'Espresso', coldbrew: 'Cold Brew', chai: 'Chai' }
export const POUR_NAMES: Record<Pour, string> = { short: 'Short', regular: 'Regular', tall: 'Tall' }
export const MILK_NAMES: Record<Milk, string> = { none: 'No milk', whole: 'Whole milk', oat: 'Oat milk' }
export const SYRUP_NAMES: Record<Syrup, string> = { none: 'No syrup', vanilla: 'Vanilla', caramel: 'Caramel', mocha: 'Mocha' }
export const TOPPING_NAMES: Record<Topping, string> = {
  none: 'No topping',
  foam: 'Foam',
  whip: 'Whipped cream',
  cinnamon: 'Cinnamon',
  drizzle: 'Caramel drizzle',
}

// where each pour should stop, as a share of the cup
export const POUR_TARGET: Record<Pour, number> = { short: 0.4, regular: 0.62, tall: 0.85 }
// a full cup takes about 2.6 seconds
export const FILL_PER_MS = 1 / 2600
export const MAX_PUMPS = 3
export const MAX_TIP = 300

const NAMES = ['Ada', 'Linus', 'Grace', 'Alan', 'Margaret', 'Dennis', 'Barbara', 'Ken', 'Radia', 'Edsger', 'Frances', 'Tim']

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

// full marks within 3% of the line, nothing once you are 30% off
export function pourScore(level: number, pour: Pour) {
  const diff = Math.abs(level - POUR_TARGET[pour])
  if (diff <= 0.03) return 100
  return clamp(100 - ((diff - 0.03) / 0.27) * 100)
}

export function brewScore(order: Order, drink: Drink) {
  const size = drink.size === order.size ? 30 : 0
  const base = drink.base === order.base ? 30 : 0
  return clamp(size + base + pourScore(drink.level, order.pour) * 0.4)
}

export function buildScore(order: Order, drink: Drink) {
  const milk = drink.milk === order.milk ? 30 : 0
  const temp = drink.iced === order.iced ? 20 : 0
  const syrupKind = drink.syrup === order.syrup ? 15 : 0
  const wantedPumps = order.syrup === 'none' ? 0 : order.pumps
  const pumps = drink.pumps === wantedPumps ? 15 : 0
  const topping = drink.topping === order.topping ? 20 : 0
  return clamp(milk + temp + syrupKind + pumps + topping)
}

// full marks up to half the customer's patience, sliding to 20 by the time it has run out twice over
export function waitScore(elapsedMs: number, patienceMs: number) {
  const ratio = elapsedMs / patienceMs
  if (ratio <= 0.5) return 100
  return Math.max(20, clamp(100 - ((ratio - 0.5) / 1.5) * 80))
}

export const totalScore = (wait: number, brew: number, build: number) => Math.round((wait + brew + build) / 3)

// cents. A drink under 50 points earns nothing
export function tipFor(total: number) {
  return total < 50 ? 0 : Math.round((total / 100) * MAX_TIP)
}

export function commentFor(total: number) {
  if (total >= 95) return 'Perfect. Exactly what I ordered.'
  if (total >= 80) return 'Really good, thank you.'
  if (total >= 65) return 'Pretty close.'
  if (total >= 50) return 'Not quite what I asked for.'
  return 'That is not my order.'
}

export function rankFor(average: number) {
  if (average >= 92) return 'Head Barista'
  if (average >= 80) return 'Senior Barista'
  if (average >= 65) return 'Barista'
  return 'Trainee'
}

export const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`

// one line a ticket can show for the syrup, e.g. "Vanilla x2"
export function syrupLabel(syrup: Syrup, pumps: number) {
  return syrup === 'none' ? SYRUP_NAMES.none : `${SYRUP_NAMES[syrup]} x${pumps}`
}

const emptyDrink = (): Drink => ({
  size: null,
  base: null,
  level: 0,
  pouring: false,
  milk: 'none',
  iced: false,
  syrup: 'none',
  pumps: 0,
  topping: 'none',
})

// days get busier and unlock more of the menu
export function dayPlan(day: number) {
  return {
    customers: Math.min(4 + (day - 1), 8),
    gapMs: Math.max(9000, 15000 - (day - 1) * 1500),
    patienceMs: Math.max(40000, 62000 - (day - 1) * 5000),
    iced: day >= 2,
    oat: day >= 2,
    syrups: day >= 2,
    toppings: day >= 3,
    extraPumps: day >= 3,
  }
}

const pick = <T,>(items: readonly T[], rand: () => number) => items[Math.floor(rand() * items.length)]

export function makeOrder(day: number, rand: () => number): Order {
  const plan = dayPlan(day)
  const base = pick<Base>(['espresso', 'coldbrew', 'chai'], rand)
  const syrup = plan.syrups && rand() < 0.6 ? pick<Syrup>(['vanilla', 'caramel', 'mocha'], rand) : 'none'
  return {
    size: pick<Size>(['small', 'medium', 'large'], rand),
    base,
    pour: pick<Pour>(['short', 'regular', 'tall'], rand),
    milk: pick<Milk>(plan.oat ? ['none', 'whole', 'oat'] : ['none', 'whole'], rand),
    // cold brew is always iced once ice is on the menu
    iced: plan.iced && (base === 'coldbrew' || rand() < 0.3),
    syrup,
    pumps: syrup === 'none' ? 0 : plan.extraPumps ? 1 + Math.floor(rand() * MAX_PUMPS) : 1,
    topping: plan.toppings && rand() < 0.65 ? pick<Topping>(['foam', 'whip', 'cinnamon', 'drizzle'], rand) : 'none',
  }
}

const initialState = (): GameState => ({
  phase: 'menu',
  day: 1,
  now: 0,
  queue: [],
  arrivals: [],
  activeId: null,
  station: 'order',
  results: [],
  customersToday: 0,
  tipsTotal: 0,
  lastResult: null,
  announcement: '',
})

export function createGame(seed = 7) {
  const rand = mulberry32(seed)
  let state = initialState()
  let version = 0
  let nextId = 1
  const listeners = new Set<() => void>()

  const emit = () => {
    version++
    listeners.forEach((listener) => listener())
  }

  const active = () => state.queue.find((c) => c.id === state.activeId) ?? null

  function stopPour() {
    const customer = active()
    if (customer) customer.drink.pouring = false
  }

  function openDay(day: number) {
    const plan = dayPlan(day)
    const names = [...NAMES].sort(() => rand() - 0.5)
    state = {
      ...initialState(),
      phase: 'open',
      day,
      tipsTotal: state.tipsTotal,
      customersToday: plan.customers,
      arrivals: Array.from({ length: plan.customers }, (_, i) => ({
        at: 600 + i * plan.gapMs,
        customer: {
          id: nextId++,
          name: names[i % names.length],
          look: Math.floor(rand() * 6),
          order: makeOrder(day, rand),
          arrivedAt: 0,
          patienceMs: plan.patienceMs,
          tookAt: null,
          drink: emptyDrink(),
        },
      })),
      announcement: `Day ${day} is open. ${plan.customers} customers today.`,
    }
  }

  function serve() {
    const customer = active()
    if (!customer || customer.tookAt === null) return
    const wait = waitScore(state.now - customer.arrivedAt, customer.patienceMs)
    const brew = brewScore(customer.order, customer.drink)
    const build = buildScore(customer.order, customer.drink)
    const total = totalScore(wait, brew, build)
    const result: Result = {
      customerId: customer.id,
      name: customer.name,
      wait,
      brew,
      build,
      total,
      tip: tipFor(total),
      comment: commentFor(total),
    }
    state.results.push(result)
    state.tipsTotal += result.tip
    state.lastResult = result
    state.queue = state.queue.filter((c) => c !== customer)
    state.announcement = `Served ${customer.name}: ${total} points, tip ${formatMoney(result.tip)}. ${result.comment}`

    // line up whatever needs doing next
    const nextTicket = state.queue.find((c) => c.tookAt !== null)
    state.activeId = nextTicket?.id ?? null
    state.station = nextTicket ? 'brew' : 'order'
    if (state.queue.length === 0 && state.arrivals.length === 0) {
      state.phase = 'closed'
      state.announcement += ` Day ${state.day} is done.`
    }
  }

  function apply(action: GameAction) {
    const customer = active()
    const drink = customer?.drink
    switch (action.type) {
      case 'start':
        openDay(1)
        break
      case 'nextDay':
        openDay(state.day + 1)
        break
      case 'station':
        stopPour()
        state.station = action.station
        break
      case 'takeOrder': {
        const who = state.queue.find((c) => c.id === action.id)
        if (!who || who.tookAt !== null) break
        who.tookAt = state.now
        if (state.activeId === null) state.activeId = who.id
        state.announcement = `Took ${who.name}'s order.`
        break
      }
      case 'select':
        if (state.queue.some((c) => c.id === action.id && c.tookAt !== null)) {
          stopPour()
          state.activeId = action.id
        }
        break
      case 'size':
        if (drink) drink.size = action.size
        break
      case 'base':
        if (drink) drink.base = action.base
        break
      case 'pourToggle':
        // needs a cup and something to pour, and a full cup cannot take more
        if (drink && drink.size && drink.base && (drink.pouring || drink.level < 1)) drink.pouring = !drink.pouring
        break
      case 'pourReset':
        if (drink) {
          drink.level = 0
          drink.pouring = false
        }
        break
      case 'milk':
        if (drink) drink.milk = action.milk
        break
      case 'ice':
        if (drink) drink.iced = !drink.iced
        break
      case 'pump':
        if (!drink || action.syrup === 'none') break
        // switching flavor starts the count again
        if (drink.syrup !== action.syrup) {
          drink.syrup = action.syrup
          drink.pumps = 1
        } else if (drink.pumps < MAX_PUMPS) {
          drink.pumps++
        }
        break
      case 'clearSyrup':
        if (drink) {
          drink.syrup = 'none'
          drink.pumps = 0
        }
        break
      case 'topping':
        if (drink) drink.topping = action.topping
        break
      case 'serve':
        stopPour()
        serve()
        break
      case 'dismissResult':
        state.lastResult = null
        break
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
    // advance by real milliseconds
    tick(dtMs: number) {
      if (state.phase !== 'open' || dtMs <= 0) return
      const dt = Math.min(dtMs, 100)
      state.now += dt

      while (state.arrivals.length && state.arrivals[0].at <= state.now) {
        const { customer } = state.arrivals.shift()!
        customer.arrivedAt = state.now
        state.queue.push(customer)
        state.announcement = `${customer.name} is waiting to order.`
      }

      const drink = active()?.drink
      if (drink?.pouring) {
        drink.level = Math.min(1, drink.level + dt * FILL_PER_MS)
        if (drink.level >= 1) drink.pouring = false
      }
      emit()
    },
    dispatch(action: GameAction) {
      apply(action)
      emit()
    },
  }
}

export type Game = ReturnType<typeof createGame>
