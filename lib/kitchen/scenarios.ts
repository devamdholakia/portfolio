import type { Action, Scheduled } from './types'

export type Scenario = {
  id: string
  name: string
  // one line shown when the preset is picked
  blurb: string
  setup: Action[]
  script: Scheduled[]
  streams: { startAt: number; intervalMs: number; count: number; duplicate?: boolean }[]
}

// all times are simulated milliseconds: 4000 of them pass per real second at 1x
export const scenarios: Scenario[] = [
  {
    id: 'normal',
    name: 'Normal Morning',
    blurb: 'Counter open, steady orders. The happy path: every order is delivered on the first try.',
    setup: [{ type: 'counter', mode: 'open' }],
    script: [],
    streams: [{ startAt: 0, intervalMs: 2500, count: 24 }],
  },
  {
    id: 'outage',
    name: 'Counter Goes Down',
    blurb:
      'The counter closes for about 15 seconds, standing in for a 10-minute outage. Retries pile up, the breaker opens and parks the rest, then everything is delivered once it reopens. Nothing is lost.',
    setup: [{ type: 'counter', mode: 'open' }],
    script: [
      { at: 8000, action: { type: 'counter', mode: 'closed' } },
      { at: 68000, action: { type: 'counter', mode: 'open' } },
    ],
    streams: [{ startAt: 0, intervalMs: 2500, count: 40 }],
  },
  {
    id: 'flaky',
    name: 'Flaky Wi-Fi',
    blurb: 'Half of all handoffs fail. Jittered retries spread out and get every order through eventually.',
    setup: [
      { type: 'counter', mode: 'flaky' },
      { type: 'failureRate', value: 0.5 },
    ],
    script: [],
    streams: [{ startAt: 0, intervalMs: 2500, count: 24 }],
  },
  {
    id: 'meltdown',
    name: 'Total Meltdown',
    blurb:
      'The counter never opens. The first order runs out of its 7 attempts and lands on the shelf, then the breaker opens and parks the rest. Reopen the counter and hit Replay All.',
    setup: [{ type: 'counter', mode: 'closed' }],
    script: [{ at: 0, action: { type: 'order' } }],
    streams: [{ startAt: 40000, intervalMs: 3000, count: 6 }],
  },
  {
    id: 'dupes',
    name: 'Double Orders',
    blurb: 'Every order is sent twice with the same order ID. The duplicate is spotted and tossed, so each drink is made once.',
    setup: [{ type: 'counter', mode: 'open' }],
    script: [],
    streams: [{ startAt: 0, intervalMs: 3000, count: 8, duplicate: true }],
  },
]

export const getScenario = (id: string) => scenarios.find((s) => s.id === id)
