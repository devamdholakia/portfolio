import type { Action, KitchenState } from '@/lib/kitchen/types'

export type View = 'cafe' | 'engineer'
export type Dispatch = (action: Action) => void
export type StageProps = { state: KitchenState; view: View; dispatch: Dispatch }

// every cafe element and the systems concept it stands for
export const terms = {
  counter: { cafe: 'Order Counter', engineer: 'Producer' },
  rail: { cafe: 'Ticket Rail', engineer: 'SQS Queue' },
  baristas: { cafe: 'Baristas', engineer: 'Workers' },
  barista: { cafe: 'Barista', engineer: 'Worker' },
  pickup: { cafe: 'Pickup Counter', engineer: 'Subscriber' },
  gate: { cafe: 'Counter manager', engineer: 'Circuit breaker' },
  shelf: { cafe: 'Forgotten Orders', engineer: 'Dead-Letter Queue' },
  dupes: { cafe: 'Duplicates tossed', engineer: 'Dedup hits' },
  seal: { cafe: 'Wax seal', engineer: 'HMAC signature' },
  sweeper: { cafe: 'Night manager sweeping up', engineer: 'Sweeper re-queueing orphans' },
  replay: { cafe: 'Replay All', engineer: 'Redrive DLQ' },
  order: { cafe: 'Order', engineer: 'Event' },
} as const

export type TermKey = keyof typeof terms

export const term = (key: TermKey, view: View) => terms[key][view]

// label that crossfades when the view flips, the other name shows on hover
export function Term({ name, view }: { name: TermKey; view: View }) {
  const other = view === 'cafe' ? 'engineer' : 'cafe'
  return (
    <span key={view} className="label-fade" title={terms[name][other]}>
      {terms[name][view]}
    </span>
  )
}

export const stageClass = 'kitchen-stage relative rounded-lg border border-line bg-latte p-3'
export const stageTitle = 'font-display text-base font-semibold'
const shape =
  'inline-flex items-center justify-center gap-1.5 border border-line py-2 text-sm font-medium hover:border-caramel-ink disabled:cursor-not-allowed disabled:opacity-50'
export const pill = shape + ' rounded-full bg-cream px-3 text-espresso'
export const pillActive = shape + ' rounded-full bg-espresso px-3 text-cream'
export const tile = shape + ' rounded-lg bg-cream px-2 text-espresso'

export const simSeconds = (ms: number) => (ms / 1000).toFixed(1)
