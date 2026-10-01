import { ticketNo } from '@/lib/kitchen/engine'
import { SteamCup } from '../SteamCup'
import { type StageProps, Term, stageClass, stageTitle, term } from './terms'

// the workers: each pulls the next ticket, makes it, and tries the handoff
export function BaristaStation({ state, view }: StageProps) {
  const busy = state.workers.filter((w) => w.ticketId !== null).length

  return (
    <section
      className={stageClass}
      aria-label={`${term('baristas', view)}, ${busy} of ${state.workers.length} busy`}
    >
      <h3 className={stageTitle}>
        <Term name="baristas" view={view} />
      </h3>

      <ul className="mt-2 space-y-2">
        {state.workers.map((worker) => {
          const ticket = state.tickets.find((t) => t.id === worker.ticketId)
          const progress = ticket ? 1 - Math.max(0, worker.brewLeft) / worker.brewTotal : 0
          return (
            <li key={worker.id} className="flex items-center gap-2 rounded-md border border-line bg-cream px-2 py-1.5">
              {/* the cup fills as the drink is made, and only steams while busy */}
              <SteamCup
                always={Boolean(ticket)}
                level={progress}
                className={`h-9 w-9 shrink-0 text-espresso ${ticket ? '' : 'idle-bob'}`}
              />
              <div className="min-w-0 flex-1">
                <p className="flex justify-between gap-2 font-mono text-xs">
                  <span className="font-semibold">
                    <Term name="barista" view={view} /> {worker.id}
                  </span>
                  <span className="text-mocha">
                    {ticket
                      ? `${ticketNo(ticket.id)} ${ticket.attempts === 0 ? 'brewing' : 'handing off'}`
                      : 'idle'}
                  </span>
                </p>
                <div
                  role="progressbar"
                  aria-label={ticket ? `${ticketNo(ticket.id)} progress` : 'Idle'}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  className="mt-1 h-1.5 overflow-hidden rounded bg-latte"
                >
                  <div className="h-full origin-left bg-caramel" style={{ transform: `scaleX(${progress})` }} />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
