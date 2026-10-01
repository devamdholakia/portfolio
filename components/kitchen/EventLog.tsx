import type { KitchenState, LogKind } from '@/lib/kitchen/types'
import { simSeconds } from './terms'

// a mark in front of each line so the kind never depends on color
const marks: Record<LogKind, string> = { info: '·', ok: '✓', warn: '!', bad: '✗' }

// receipt-style log, newest on top. Screen readers get a throttled summary instead of every line
export function EventLog({ state }: { state: KitchenState }) {
  return (
    <section aria-label="Event log" className="drop-shadow-md">
      <div className="bg-paper px-4 pt-4 pb-3 font-mono text-xs text-roast">
        <h3 className="text-center text-sm font-semibold tracking-widest uppercase">Event log</h3>
        <ol
          tabIndex={0}
          aria-label="Events, newest first"
          className="mt-2 h-56 overflow-y-auto border-t border-dashed border-roast-soft/60 pt-2"
        >
          {state.log.length === 0 && <li className="text-roast-soft">Nothing yet. Place an order to start.</li>}
          {state.log.map((entry) => (
            <li key={entry.id} className="flex gap-2 py-0.5">
              <span className="w-12 shrink-0 text-right text-roast-soft">{simSeconds(entry.at)}s</span>
              <span aria-hidden className="w-3 shrink-0 text-center font-bold">
                {marks[entry.kind]}
              </span>
              <span className={entry.kind === 'bad' ? 'font-semibold' : ''}>{entry.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <div aria-hidden className="receipt-edge" />
    </section>
  )
}
