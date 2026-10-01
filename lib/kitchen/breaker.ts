import type { BreakerState } from './types'

// both numbers match Webhookd
export const FAILURE_THRESHOLD = 10
export const COOLDOWN_MS = 30000

export type Breaker = {
  state: BreakerState
  // consecutive failures since the last success
  failures: number
  openedAt: number | null
  // true while the one half-open test delivery is in flight
  probing: boolean
}

export const createBreaker = (): Breaker => ({
  state: 'closed',
  failures: 0,
  openedAt: null,
  probing: false,
})

// open breakers move to half-open once the cooldown has passed
export function poll(b: Breaker, now: number): Breaker {
  if (b.state === 'open' && b.openedAt !== null && now >= b.openedAt + COOLDOWN_MS) {
    return { ...b, state: 'half-open', probing: false }
  }
  return b
}

export const startProbe = (b: Breaker): Breaker => ({ ...b, probing: true })
export const cancelProbe = (b: Breaker): Breaker => ({ ...b, probing: false })

export function recordSuccess(): Breaker {
  return createBreaker()
}

export function recordFailure(b: Breaker, now: number): Breaker {
  const failures = b.failures + 1
  // a failed probe reopens straight away, otherwise it takes the full threshold
  if (b.state === 'half-open' || failures >= FAILURE_THRESHOLD) {
    return { state: 'open', failures, openedAt: now, probing: false }
  }
  return { ...b, failures }
}

// milliseconds until an open breaker will test the counter again
export function cooldownLeft(b: Breaker, now: number) {
  if (b.state !== 'open' || b.openedAt === null) return 0
  return Math.max(0, b.openedAt + COOLDOWN_MS - now)
}
