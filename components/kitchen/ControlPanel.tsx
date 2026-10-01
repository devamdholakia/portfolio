import { Pause, Play, Trash2 } from 'lucide-react'
import { SPEEDS } from '@/lib/kitchen/clock'
import { scenarios } from '@/lib/kitchen/scenarios'
import type { CounterMode } from '@/lib/kitchen/types'
import { Segmented } from './Segmented'
import { ViewToggle } from './ViewToggle'
import { type StageProps, type View, pill, pillActive } from './terms'

type Props = StageProps & { onView: (view: View) => void }

const label = 'block font-mono text-xs font-semibold tracking-wide text-mocha uppercase'

// the manager's clipboard: everything that changes how the kitchen runs
export function ControlPanel({ state, view, dispatch, onView }: Props) {
  const flaky = state.counter.mode === 'flaky'
  const scenario = scenarios.find((s) => s.id === state.scenarioId)

  return (
    <div className="rounded-lg border border-line bg-latte p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-hand text-2xl text-caramel-ink">Manager&apos;s clipboard</p>
        <ViewToggle view={view} onChange={onView} />
      </div>

      <div className="mt-3">
        <p className={label} id="kitchen-presets">
          Scenarios
        </p>
        <div role="group" aria-labelledby="kitchen-presets" className="mt-1.5 flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={state.scenarioId === s.id}
              onClick={() => dispatch({ type: 'scenario', id: s.id })}
              className={state.scenarioId === s.id ? pillActive : pill}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="mt-2 min-h-10 text-sm text-mocha">
          {scenario ? scenario.blurb : 'Pick a scenario for a one-click demo, or run the kitchen yourself below.'}
        </p>
      </div>

      <div className="kitchen-controls mt-3">
        <div>
          <p className={label}>Counter status</p>
          <div className="mt-1.5">
            <Segmented<CounterMode>
              label="Counter status"
              value={state.counter.mode}
              onChange={(mode) => dispatch({ type: 'counter', mode })}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'flaky', label: 'Flaky' },
                { value: 'closed', label: 'Closed' },
              ]}
            />
          </div>
        </div>

        <label className={flaky ? '' : 'opacity-60'}>
          <span className={label}>Failure rate: {Math.round(state.counter.failureRate * 100)}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            disabled={!flaky}
            value={Math.round(state.counter.failureRate * 100)}
            onChange={(e) => dispatch({ type: 'failureRate', value: Number(e.target.value) / 100 })}
            className="mt-3 w-full"
          />
          <span className="text-xs text-mocha">{flaky ? 'Share of handoffs that fail' : 'Only used when Flaky'}</span>
        </label>

        <label>
          <span className={label}>
            {view === 'engineer' ? 'Workers' : 'Baristas on shift'}: {state.workers.length}
          </span>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={state.workers.length}
            onChange={(e) => dispatch({ type: 'workers', count: Number(e.target.value) })}
            className="mt-3 w-full"
          />
          <span className="text-xs text-mocha">Send one home mid-order to see the sweeper</span>
        </label>

        <div>
          <p className={label}>Speed</p>
          <div className="mt-1.5">
            <Segmented<number>
              label="Simulation speed"
              value={state.speed}
              onChange={(value) => dispatch({ type: 'speed', value })}
              options={SPEEDS.map((s) => ({ value: s, label: `${s}x` }))}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => dispatch({ type: 'pause', paused: !state.paused })} className={pill}>
          {state.paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
          {state.paused ? 'Resume' : 'Pause'}
        </button>
        <button type="button" onClick={() => dispatch({ type: 'reset' })} className={pill}>
          <Trash2 size={14} aria-hidden />
          Reset
        </button>
      </div>
    </div>
  )
}
