import { Copy, Trash2, Zap } from 'lucide-react'
import { DRINKS, DRINK_NAMES } from '@/lib/kitchen/engine'
import { DrinkIcon } from './DrinkIcon'
import { type StageProps, Term, stageClass, stageTitle, term, tile } from './terms'

// the producer: every button publishes one event onto the rail
export function OrderCounter({ state, view, dispatch }: StageProps) {
  return (
    <section className={stageClass} aria-label={`${term('counter', view)}, ${state.created} orders placed`}>
      <h3 className={stageTitle}>
        <Term name="counter" view={view} />
      </h3>

      <div className="mt-2 grid grid-cols-2 gap-2">
        {DRINKS.map((drink) => (
          <button
            key={drink}
            type="button"
            onClick={() => dispatch({ type: 'order', drink })}
            aria-label={`Order a ${DRINK_NAMES[drink]}`}
            className={tile}
          >
            <DrinkIcon drink={drink} />
            {DRINK_NAMES[drink]}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'rush' })}
          title="20 random orders over 3 seconds"
          className={tile}
        >
          <Zap size={14} aria-hidden />
          Rush Hour
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'doubleTap' })}
          title="Sends one order twice with the same order ID"
          className={tile}
        >
          <Copy size={14} aria-hidden />
          Double Tap
        </button>
      </div>

      {/* the bin where duplicate tickets end up */}
      <p className="relative mt-3 flex items-center gap-1.5 font-mono text-xs text-mocha">
        <Trash2 size={14} aria-hidden />
        <span>
          <Term name="dupes" view={view} />: <strong className="text-espresso">{state.duplicates}</strong>
        </span>
        {state.duplicates > 0 && (
          <span key={state.duplicates} aria-hidden className="toss absolute -top-3 left-0 rounded-sm bg-paper px-1 text-roast shadow">
            already have this one
          </span>
        )}
      </p>
    </section>
  )
}
