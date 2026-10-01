import { describe, expect, it } from 'vitest'
import { BASE_MS, CAP_MS, MAX_ATTEMPTS, backoffCeiling, fullJitterDelay } from '../backoff'
import { mulberry32 } from '../rng'

describe('full-jitter backoff', () => {
  it('doubles the ceiling per attempt up to the cap', () => {
    expect(backoffCeiling(1)).toBe(BASE_MS * 2)
    expect(backoffCeiling(3)).toBe(BASE_MS * 8)
    expect(backoffCeiling(6)).toBe(CAP_MS)
    expect(backoffCeiling(20)).toBe(CAP_MS)
  })

  it('always lands within [0, min(cap, base * 2^attempt)]', () => {
    const rand = mulberry32(7)
    for (let attempt = 1; attempt <= MAX_ATTEMPTS + 5; attempt++) {
      for (let i = 0; i < 2000; i++) {
        const delay = fullJitterDelay(attempt, rand)
        expect(delay).toBeGreaterThanOrEqual(0)
        expect(delay).toBeLessThanOrEqual(backoffCeiling(attempt))
      }
    }
  })

  it('actually spreads out, it is not a fixed delay', () => {
    const rand = mulberry32(11)
    const delays = Array.from({ length: 200 }, () => fullJitterDelay(4, rand))
    expect(new Set(delays.map((d) => Math.round(d))).size).toBeGreaterThan(100)
  })
})
