// retry policy, in simulated milliseconds. Max attempts matches Webhookd
export const MAX_ATTEMPTS = 7
export const BASE_MS = 1000
export const CAP_MS = 64000

// upper bound for the wait after the given failed attempt (1-based)
export function backoffCeiling(attempt: number, base = BASE_MS, cap = CAP_MS) {
  return Math.min(cap, base * 2 ** attempt)
}

// full jitter: anywhere between zero and the ceiling, so retries do not line up
export function fullJitterDelay(
  attempt: number,
  rand: () => number,
  base = BASE_MS,
  cap = CAP_MS,
) {
  return rand() * backoffCeiling(attempt, base, cap)
}
