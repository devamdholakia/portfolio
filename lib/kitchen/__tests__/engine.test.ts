import { describe, expect, it } from 'vitest'
import { MAX_ATTEMPTS } from '../backoff'
import { countByStatus, createEngine, invariantHolds } from '../engine'
import { mulberry32 } from '../rng'
import { scenarios } from '../scenarios'
import type { Action } from '../types'

// run simulated time forward in 100ms ticks
function run(engine: ReturnType<typeof createEngine>, ms: number) {
  for (let t = 0; t < ms; t += 100) engine.tick(100)
}

describe('kitchen engine', () => {
  it('delivers on the first attempt when the counter is open', () => {
    const engine = createEngine(1)
    engine.dispatch({ type: 'order', drink: 'latte' })
    run(engine, 10000)
    const s = engine.getState()
    expect(s.delivered).toBe(1)
    expect(s.deliveredAttempts).toBe(1)
    expect(s.tickets).toHaveLength(0)
  })

  it('dead-letters after exactly 7 failed attempts', () => {
    const engine = createEngine(3)
    engine.dispatch({ type: 'counter', mode: 'closed' })
    engine.dispatch({ type: 'order', drink: 'espresso' })
    run(engine, 400000)
    const s = engine.getState()
    expect(MAX_ATTEMPTS).toBe(7)
    expect(s.tickets).toHaveLength(1)
    expect(s.tickets[0].status).toBe('dead')
    expect(s.tickets[0].attempts).toBe(7)
    // 7 failures is under the threshold, so the breaker never tripped
    expect(s.breaker.state).toBe('closed')
    expect(s.delivered).toBe(0)
  })

  it('opens the breaker after 10 consecutive failures and parks the queue', () => {
    const engine = createEngine(5)
    engine.dispatch({ type: 'counter', mode: 'closed' })
    for (let i = 0; i < 12; i++) engine.dispatch({ type: 'order' })
    let failuresAtOpen = -1
    for (let t = 0; t < 60000 && failuresAtOpen < 0; t += 100) {
      engine.tick(100)
      if (engine.getState().breaker.state === 'open') failuresAtOpen = engine.getState().breaker.failures
    }
    expect(failuresAtOpen).toBe(10)
    const s = engine.getState()
    expect(countByStatus(s).waiting).toBe(0)
    expect(countByStatus(s).parked).toBeGreaterThan(0)
  })

  it('recovers through half-open and delivers everything once the counter reopens', () => {
    const engine = createEngine(5)
    engine.dispatch({ type: 'counter', mode: 'closed' })
    for (let i = 0; i < 12; i++) engine.dispatch({ type: 'order' })
    run(engine, 25000)
    expect(engine.getState().breaker.state).toBe('open')
    engine.dispatch({ type: 'counter', mode: 'open' })
    run(engine, 200000)
    const s = engine.getState()
    expect(s.breaker.state).toBe('closed')
    expect(s.delivered).toBe(12)
    expect(countByStatus(s).dead).toBe(0)
  })

  it('rejects a duplicate orderId', () => {
    const engine = createEngine(2)
    engine.dispatch({ type: 'order', drink: 'chai', orderId: 'abc' })
    engine.dispatch({ type: 'order', drink: 'chai', orderId: 'abc' })
    run(engine, 10000)
    const s = engine.getState()
    expect(s.created).toBe(1)
    expect(s.duplicates).toBe(1)
    expect(s.delivered).toBe(1)
  })

  it('Double Tap makes the drink once', () => {
    const engine = createEngine(2)
    engine.dispatch({ type: 'doubleTap', drink: 'latte' })
    run(engine, 10000)
    const s = engine.getState()
    expect(s.created).toBe(1)
    expect(s.duplicates).toBe(1)
    expect(s.delivered).toBe(1)
  })

  it('replays dead-lettered orders', () => {
    const engine = createEngine(3)
    engine.dispatch({ type: 'counter', mode: 'closed' })
    engine.dispatch({ type: 'order' })
    run(engine, 400000)
    expect(countByStatus(engine.getState()).dead).toBe(1)
    engine.dispatch({ type: 'counter', mode: 'open' })
    engine.dispatch({ type: 'replay' })
    run(engine, 20000)
    expect(engine.getState().delivered).toBe(1)
    expect(countByStatus(engine.getState()).dead).toBe(0)
  })

  it('the sweeper recovers an order whose barista went off shift', () => {
    const engine = createEngine(4)
    engine.dispatch({ type: 'workers', count: 2 })
    // two orders so both baristas are busy, then send one home
    engine.dispatch({ type: 'order' })
    engine.dispatch({ type: 'order' })
    engine.tick(100)
    expect(countByStatus(engine.getState()).brewing).toBe(2)
    engine.dispatch({ type: 'workers', count: 1 })
    expect(engine.getState().tickets.filter((t) => t.orphaned)).toHaveLength(1)
    run(engine, 15000)
    // the orphan sits there until the sweep at the 60 second mark
    expect(engine.getState().delivered).toBe(1)
    run(engine, 60000)
    expect(engine.getState().delivered).toBe(2)
  })

  it('never loses an order across a 10,000-tick randomized run', () => {
    const engine = createEngine(99)
    const rand = mulberry32(1234)
    const modes = ['open', 'flaky', 'closed'] as const
    for (let i = 0; i < 10000; i++) {
      const roll = rand()
      let action: Action | null = null
      if (roll < 0.12) action = { type: 'order' }
      else if (roll < 0.14) action = { type: 'doubleTap' }
      else if (roll < 0.15) action = { type: 'rush' }
      else if (roll < 0.17) action = { type: 'counter', mode: modes[Math.floor(rand() * 3)] }
      else if (roll < 0.18) action = { type: 'workers', count: 1 + Math.floor(rand() * 5) }
      else if (roll < 0.185) action = { type: 'replay' }
      else if (roll < 0.19) action = { type: 'failureRate', value: rand() }
      if (action) engine.dispatch(action)
      // the engine also throws on its own if the invariant breaks
      engine.tick(100 + Math.floor(rand() * 300))
      expect(invariantHolds(engine.getState())).toBe(true)
    }
    // then let it drain with the counter open: everything must end delivered
    engine.dispatch({ type: 'counter', mode: 'open' })
    engine.dispatch({ type: 'replay' })
    run(engine, 2000000)
    const s = engine.getState()
    expect(s.created).toBeGreaterThan(500)
    expect(s.delivered).toBe(s.created)
    expect(s.tickets).toHaveLength(0)
  })

  it('"Counter Goes Down" ends with 0 dead-lettered orders', () => {
    for (const seed of [2026, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
      const engine = createEngine(seed)
      engine.dispatch({ type: 'scenario', id: 'outage' })
      run(engine, 400000)
      const s = engine.getState()
      expect(countByStatus(s).dead, `seed ${seed}`).toBe(0)
      expect(s.created).toBe(40)
      expect(s.delivered, `seed ${seed}`).toBe(40)
    }
  })

  it('every preset keeps the invariant, and "Total Meltdown" fills the shelf', () => {
    for (const scenario of scenarios) {
      const engine = createEngine()
      engine.dispatch({ type: 'scenario', id: scenario.id })
      run(engine, 300000)
      expect(invariantHolds(engine.getState())).toBe(true)
    }
    const engine = createEngine()
    engine.dispatch({ type: 'scenario', id: 'meltdown' })
    run(engine, 600000)
    expect(countByStatus(engine.getState()).dead).toBeGreaterThan(0)
    expect(engine.getState().delivered).toBe(0)
  })
})
