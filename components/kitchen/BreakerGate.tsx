import { FAILURE_THRESHOLD, cooldownLeft } from '@/lib/kitchen/breaker'
import type { Breaker } from '@/lib/kitchen/breaker'
import { type View, Term, simSeconds } from './terms'

type Props = { breaker: Breaker; now: number; view: View }

// arm angle, color, and wording for each breaker state. "Closed" is the normal one
const looks = {
  closed: { angle: -72, color: '#5E7A4E', cafe: 'letting orders through', engineer: 'CLOSED' },
  'half-open': { angle: -34, color: '#9A6B16', cafe: 'testing one order', engineer: 'HALF-OPEN' },
  open: { angle: 0, color: '#8C3B2A', cafe: 'blocking the counter', engineer: 'OPEN' },
}

export function BreakerGate({ breaker, now, view }: Props) {
  const look = looks[breaker.state]
  const wait = cooldownLeft(breaker, now)

  return (
    <div className="mt-2 flex items-center gap-2 rounded-md border border-line bg-cream px-2 py-1.5">
      <svg viewBox="0 0 44 30" width="44" height="30" aria-hidden className="shrink-0">
        <rect x="5" y="8" width="5" height="20" rx="1" fill="currentColor" />
        <rect x="37" y="14" width="3" height="14" rx="1" fill="currentColor" opacity="0.5" />
        <g className="gate-arm" style={{ transform: `rotate(${look.angle}deg)` }}>
          <rect x="7" y="11" width="32" height="4" rx="2" fill={look.color} />
        </g>
      </svg>
      <p className="min-w-0 font-mono text-xs leading-tight">
        <span className="font-semibold">
          <Term name="gate" view={view} />
        </span>
        <br />
        <span key={`${view}-${breaker.state}`} className="label-fade">
          {view === 'engineer' ? look.engineer : look.cafe}
        </span>
        <br />
        <span className="text-mocha">
          {breaker.state === 'open'
            ? `retest in ${simSeconds(wait)}s`
            : `${breaker.failures}/${FAILURE_THRESHOLD} failures in a row`}
        </span>
      </p>
    </div>
  )
}
