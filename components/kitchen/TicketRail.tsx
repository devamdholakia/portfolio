import { Ticket } from './Ticket'
import { type StageProps, Term, stageClass, stageTitle, term } from './terms'

const VISIBLE = 12
const SWEEP_SHOWN_MS = 5000

// the queue: everything not currently in a barista's hands, oldest first
export function TicketRail({ state, view }: StageProps) {
  const queued = state.tickets
    .filter((t) => t.status === 'waiting' || t.status === 'retrying' || t.status === 'parked' || t.orphaned)
    .sort((a, b) => a.id - b.id)
  const shown = queued.slice(0, VISIBLE)
  const more = queued.length - shown.length
  const sweeping = state.lastSweepAt !== null && state.now - state.lastSweepAt < SWEEP_SHOWN_MS

  return (
    <section
      className={`${stageClass} overflow-hidden`}
      aria-label={`${term('rail', view)}, ${queued.length} ${queued.length === 1 ? 'order' : 'orders'} waiting`}
    >
      <h3 className={stageTitle}>
        <Term name="rail" view={view} />
      </h3>

      {/* the rail itself, with the sweeper's broom passing over it once a minute */}
      <div aria-hidden className="relative mt-2 h-1.5 rounded bg-mocha">
        {sweeping && (
          <div key={state.sweeps} className="sweep absolute -top-2 left-0 w-full">
            <svg viewBox="0 0 24 24" width="20" height="20" className="ml-auto text-espresso" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 3L11 12" />
              <path d="M6 13l5 5-3 3H4v-4z" />
            </svg>
          </div>
        )}
      </div>
      {sweeping && (
        <p className="mt-1 font-mono text-xs text-mocha">
          <Term name="sweeper" view={view} />
        </p>
      )}

      {queued.length === 0 ? (
        <p className="mt-3 text-sm text-mocha">Nothing on the rail. Place an order, or pick a scenario above.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {shown.map((ticket) => (
            <Ticket key={ticket.id} ticket={ticket} now={state.now} view={view} />
          ))}
          {more > 0 && <li className="self-center font-mono text-sm font-semibold text-mocha">+{more} more</li>}
        </ul>
      )}
    </section>
  )
}
