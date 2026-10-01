import { ShieldCheck } from 'lucide-react'
import { ticketNo } from '@/lib/kitchen/engine'
import { BreakerGate } from './BreakerGate'
import { DrinkIcon } from './DrinkIcon'
import { type StageProps, Term, stageClass, stageTitle, term } from './terms'

const SHOWN_MS = 8000

const signs = {
  open: { text: 'Open', className: 'bg-sage text-roast' },
  flaky: { text: 'Flaky', className: 'flicker sign-flaky' },
  closed: { text: 'Back in 10', className: 'bg-roast text-paper' },
}

// the subscriber endpoint, with the circuit breaker standing in front of it
export function PickupCounter({ state, view }: StageProps) {
  const sign = signs[state.counter.mode]
  const recent = state.recentDelivered.filter((d) => state.now - d.at < SHOWN_MS)

  return (
    <section
      className={stageClass}
      aria-label={`${term('pickup', view)}, ${state.counter.mode}, ${state.delivered} delivered`}
    >
      <h3 className={stageTitle}>
        <Term name="pickup" view={view} />
      </h3>

      <p className={`mt-2 inline-block rounded px-2.5 py-1 font-mono text-sm font-bold ${sign.className}`}>
        {sign.text}
        {state.counter.mode === 'flaky' && ` ${Math.round(state.counter.failureRate * 100)}%`}
      </p>

      <BreakerGate breaker={state.breaker} now={state.now} view={view} />

      <ul className="mt-2 min-h-18 space-y-1 font-mono text-xs">
        {recent.map((d) => (
          <li key={d.id} className="ticket-in flex items-center gap-1.5">
            <DrinkIcon drink={d.drink} size={14} />
            {ticketNo(d.id)}
            <ShieldCheck size={13} aria-hidden className="ml-auto shrink-0" />
            <span>{view === 'engineer' ? 'signature ok' : 'seal verified'}</span>
          </li>
        ))}
        {recent.length === 0 && <li className="text-mocha">Counter is clear</li>}
      </ul>
    </section>
  )
}
