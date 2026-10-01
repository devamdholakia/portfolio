// simulated milliseconds per real millisecond at 1x
// a full retry cycle is about 70 simulated seconds, so this lands it near 18 real seconds
export const TIME_SCALE = 4
export const SPEEDS = [0.5, 1, 2, 5] as const

// longest real gap a single frame may cover, so a backgrounded tab does not fast-forward
const MAX_FRAME_MS = 100

export function createClock() {
  let speed = 1
  let paused = false
  return {
    get speed() {
      return speed
    },
    get paused() {
      return paused
    },
    setSpeed(value: number) {
      speed = value
    },
    setPaused(value: boolean) {
      paused = value
    },
    // turns real elapsed time into simulated time
    advance(realMs: number) {
      if (paused || realMs <= 0) return 0
      return Math.min(realMs, MAX_FRAME_MS) * TIME_SCALE * speed
    },
  }
}
