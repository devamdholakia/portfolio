import { RotateCcw } from 'lucide-react'
import { Ticket } from './Ticket'
import { type StageProps, Term, pill, stageClass, stageTitle, term } from './terms'

const VISIBLE = 12

// the dead-letter queue: orders that used up every attempt wait here for a replay
export function DeadLetterShelf({ state, view, dispatch }: StageProps) {
  const dead = state.tickets.filter((t) => t.status === 'dead')
  const shown = dead.slice(0, VISIBLE)

  return (
    <section
      className={`${stageClass} mt-4`}
      aria-label={`${term('shelf', view)}, ${dead.length} ${dead.length === 1 ? 'order' : 'orders'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={stageTitle}>
          <Term name="shelf" view={view} />{' '}
          <span className="font-mono text-sm font-normal text-mocha">({dead.length})</span>
        </h3>
        <button
          type="button"
          disabled={dead.length === 0}
          onClick={() => dispatch({ type: 'replay' })}
          className={pill}
        >
          <RotateCcw size={14} aria-hidden />
          <Term name="replay" view={view} />
        </button>
      </div>

      {dead.length === 0 ? (
        <p className="mt-2 text-sm text-mocha">Empty. Orders only land here after 7 failed attempts.</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {shown.map((ticket) => (
            <Ticket key={ticket.id} ticket={ticket} now={state.now} view={view} />
          ))}
          {dead.length > shown.length && (
            <li className="self-center font-mono text-sm font-semibold text-mocha">
              +{dead.length - shown.length} more
            </li>
          )}
        </ul>
      )}
      <div aria-hidden className="shelf mt-2" />
    </section>
  )
}
