import { countByStatus } from '@/lib/kitchen/engine'
import type { KitchenState } from '@/lib/kitchen/types'
import { type View, term } from './terms'

// deliveries per second over the last 30 seconds, drawn by hand so there is no chart library
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values)
  const step = 120 / (values.length - 1)
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${(26 - (v / max) * 22).toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 120 28" className="h-7 w-full" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke="var(--caramel-chalk)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function StatsBoard({ state, view }: { state: KitchenState; view: View }) {
  const counts = countByStatus(state)
  const finished = state.delivered + counts.dead
  const successRate = finished ? `${Math.round((state.delivered / finished) * 100)}%` : 'n/a'
  const avgAttempts = state.delivered ? (state.deliveredAttempts / state.delivered).toFixed(2) : 'n/a'

  const stats = [
    { label: view === 'engineer' ? 'Events published' : 'Orders placed', value: state.created },
    { label: 'Delivered', value: state.delivered },
    { label: 'Retrying now', value: counts.retrying },
    { label: view === 'engineer' ? 'In the DLQ' : 'On the shelf', value: counts.dead },
    { label: term('dupes', view), value: state.duplicates },
    { label: 'Success rate', value: successRate },
    { label: 'Avg attempts', value: avgAttempts },
    { label: 'Breaker', value: state.breaker.state.toUpperCase() },
  ]

  return (
    <section className="chalkboard rounded-lg p-4" aria-label="Live stats">
      <h3 className="font-hand text-2xl text-caramel-chalk">Live stats</h3>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse">
            <dt className="text-xs text-chalk/85">{stat.label}</dt>
            <dd className="font-mono text-lg font-semibold">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3">
        <Sparkline values={state.spark} />
        <p className="text-xs text-chalk/85">Deliveries per second, last 30 seconds</p>
      </div>
    </section>
  )
}
