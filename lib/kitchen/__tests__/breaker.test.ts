import { describe, expect, it } from 'vitest'
import {
  COOLDOWN_MS,
  FAILURE_THRESHOLD,
  cooldownLeft,
  createBreaker,
  poll,
  recordFailure,
  recordSuccess,
  startProbe,
} from '../breaker'

const failTimes = (n: number, now = 0) => {
  let b = createBreaker()
  for (let i = 0; i < n; i++) b = recordFailure(b, now)
  return b
}

describe('circuit breaker', () => {
  it('stays closed below the threshold', () => {
    expect(failTimes(FAILURE_THRESHOLD - 1).state).toBe('closed')
  })

  it('opens after exactly 10 consecutive failures', () => {
    expect(FAILURE_THRESHOLD).toBe(10)
    const b = failTimes(FAILURE_THRESHOLD, 500)
    expect(b.state).toBe('open')
    expect(b.openedAt).toBe(500)
  })

  it('a success resets the consecutive count', () => {
    let b = recordSuccess()
    b = recordFailure(b, 0)
    expect(b.state).toBe('closed')
    expect(b.failures).toBe(1)
  })

  it('goes half-open only after the cooldown', () => {
    const open = failTimes(FAILURE_THRESHOLD, 1000)
    expect(poll(open, 1000 + COOLDOWN_MS - 1).state).toBe('open')
    expect(cooldownLeft(open, 1000 + COOLDOWN_MS - 1)).toBe(1)
    expect(poll(open, 1000 + COOLDOWN_MS).state).toBe('half-open')
  })

  it('closes when the half-open test succeeds', () => {
    const half = startProbe(poll(failTimes(FAILURE_THRESHOLD, 0), COOLDOWN_MS))
    expect(half.state).toBe('half-open')
    expect(half.probing).toBe(true)
    const closed = recordSuccess()
    expect(closed.state).toBe('closed')
    expect(closed.failures).toBe(0)
  })

  it('reopens when the half-open test fails', () => {
    const half = startProbe(poll(failTimes(FAILURE_THRESHOLD, 0), COOLDOWN_MS))
    const reopened = recordFailure(half, COOLDOWN_MS + 5)
    expect(reopened.state).toBe('open')
    expect(reopened.openedAt).toBe(COOLDOWN_MS + 5)
    expect(reopened.probing).toBe(false)
  })
})
