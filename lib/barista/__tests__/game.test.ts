import { describe, expect, it } from 'vitest'
import {
  POUR_TARGET,
  brewScore,
  buildScore,
  createGame,
  dayPlan,
  makeOrder,
  pourScore,
  tipFor,
  totalScore,
  waitScore,
} from '../game'
import { mulberry32 } from '../../kitchen/rng'
import type { Drink, Order } from '../types'

const order: Order = {
  size: 'medium',
  base: 'espresso',
  pour: 'regular',
  milk: 'oat',
  iced: true,
  syrup: 'vanilla',
  pumps: 2,
  topping: 'foam',
}

const perfect: Drink = {
  size: 'medium',
  base: 'espresso',
  level: POUR_TARGET.regular,
  pouring: false,
  milk: 'oat',
  iced: true,
  syrup: 'vanilla',
  pumps: 2,
  topping: 'foam',
}

// tick real time forward in frames
function run(game: ReturnType<typeof createGame>, ms: number) {
  for (let t = 0; t < ms; t += 50) game.tick(50)
}

describe('scoring', () => {
  it('a pour on the line is 100, and it falls off with distance', () => {
    expect(pourScore(POUR_TARGET.tall, 'tall')).toBe(100)
    expect(pourScore(POUR_TARGET.tall - 0.02, 'tall')).toBe(100)
    expect(pourScore(POUR_TARGET.tall - 0.15, 'tall')).toBeLessThan(70)
    expect(pourScore(0, 'tall')).toBe(0)
  })

  it('a perfect drink scores 100 at both stations', () => {
    expect(brewScore(order, perfect)).toBe(100)
    expect(buildScore(order, perfect)).toBe(100)
  })

  it('each mistake costs its share', () => {
    expect(brewScore(order, { ...perfect, size: 'large' })).toBe(70)
    expect(brewScore(order, { ...perfect, base: 'chai' })).toBe(70)
    expect(buildScore(order, { ...perfect, milk: 'whole' })).toBe(70)
    expect(buildScore(order, { ...perfect, iced: false })).toBe(80)
    expect(buildScore(order, { ...perfect, pumps: 1 })).toBe(85)
    expect(buildScore(order, { ...perfect, topping: 'none' })).toBe(80)
  })

  it('no syrup ordered means zero pumps is correct', () => {
    const plain = { ...order, syrup: 'none' as const, pumps: 0 }
    expect(buildScore(plain, { ...perfect, syrup: 'none', pumps: 0 })).toBe(100)
  })

  it('waiting costs points only after half the patience is gone', () => {
    expect(waitScore(10000, 60000)).toBe(100)
    expect(waitScore(30000, 60000)).toBe(100)
    expect(waitScore(60000, 60000)).toBeLessThan(100)
    expect(waitScore(600000, 60000)).toBe(20)
  })

  it('tips scale with the score and stop below 50', () => {
    expect(tipFor(100)).toBe(300)
    expect(tipFor(49)).toBe(0)
    expect(totalScore(100, 100, 100)).toBe(100)
  })
})

describe('orders', () => {
  it('day 1 keeps the menu simple, later days unlock more', () => {
    const rand = mulberry32(3)
    for (let i = 0; i < 200; i++) {
      const o = makeOrder(1, rand)
      expect(o.iced).toBe(false)
      expect(o.syrup).toBe('none')
      expect(o.pumps).toBe(0)
      expect(o.topping).toBe('none')
      expect(o.milk).not.toBe('oat')
    }
    const later = Array.from({ length: 200 }, () => makeOrder(4, rand))
    expect(later.some((o) => o.topping !== 'none')).toBe(true)
    expect(later.some((o) => o.pumps > 1)).toBe(true)
    expect(later.every((o) => (o.syrup === 'none') === (o.pumps === 0))).toBe(true)
    expect(dayPlan(9).customers).toBe(8)
  })
})

describe('a shift', () => {
  it('plays a full day: take, pour, build, serve, close', () => {
    const game = createGame(11)
    game.dispatch({ type: 'start' })
    const total = game.getState().customersToday
    expect(total).toBe(4)

    for (let served = 0; served < total; served++) {
      // wait for the next customer to walk in
      for (let i = 0; i < 2000 && !game.getState().queue.some((c) => c.tookAt === null); i++) game.tick(50)
      const customer = game.getState().queue.find((c) => c.tookAt === null)!
      game.dispatch({ type: 'takeOrder', id: customer.id })
      game.dispatch({ type: 'select', id: customer.id })
      const o = customer.order
      game.dispatch({ type: 'size', size: o.size })
      game.dispatch({ type: 'base', base: o.base })
      game.dispatch({ type: 'pourToggle' })
      while (customer.drink.level < POUR_TARGET[o.pour]) game.tick(10)
      game.dispatch({ type: 'pourToggle' })
      game.dispatch({ type: 'milk', milk: o.milk })
      if (o.iced) game.dispatch({ type: 'ice' })
      for (let p = 0; p < o.pumps; p++) game.dispatch({ type: 'pump', syrup: o.syrup })
      game.dispatch({ type: 'topping', topping: o.topping })
      game.dispatch({ type: 'serve' })
      const result = game.getState().results.at(-1)!
      expect(result.brew).toBe(100)
      expect(result.build).toBe(100)
      expect(result.total).toBeGreaterThanOrEqual(95)
    }

    const s = game.getState()
    expect(s.phase).toBe('closed')
    expect(s.results).toHaveLength(total)
    expect(s.tipsTotal).toBe(s.results.reduce((sum, r) => sum + r.tip, 0))

    game.dispatch({ type: 'nextDay' })
    expect(game.getState().day).toBe(2)
    expect(game.getState().customersToday).toBe(5)
    expect(game.getState().tipsTotal).toBe(s.tipsTotal)
  })

  it('the pour stops by itself when the cup is full, and needs a cup first', () => {
    const game = createGame(2)
    game.dispatch({ type: 'start' })
    run(game, 1000)
    const customer = game.getState().queue[0]
    game.dispatch({ type: 'takeOrder', id: customer.id })
    game.dispatch({ type: 'pourToggle' })
    expect(customer.drink.pouring).toBe(false)
    game.dispatch({ type: 'size', size: 'small' })
    game.dispatch({ type: 'base', base: 'chai' })
    game.dispatch({ type: 'pourToggle' })
    expect(customer.drink.pouring).toBe(true)
    run(game, 4000)
    expect(customer.drink.level).toBe(1)
    expect(customer.drink.pouring).toBe(false)
    game.dispatch({ type: 'pourReset' })
    expect(customer.drink.level).toBe(0)
  })

  it('pumps cap at three and switching flavor restarts the count', () => {
    const game = createGame(2)
    game.dispatch({ type: 'start' })
    run(game, 1000)
    const customer = game.getState().queue[0]
    game.dispatch({ type: 'takeOrder', id: customer.id })
    for (let i = 0; i < 6; i++) game.dispatch({ type: 'pump', syrup: 'mocha' })
    expect(customer.drink.pumps).toBe(3)
    game.dispatch({ type: 'pump', syrup: 'vanilla' })
    expect(customer.drink.syrup).toBe('vanilla')
    expect(customer.drink.pumps).toBe(1)
  })
})
