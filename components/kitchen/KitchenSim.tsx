'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { countByStatus, createEngine } from '@/lib/kitchen/engine'
import type { Engine } from '@/lib/kitchen/engine'
import { BaristaStation } from './BaristaStation'
import { ControlPanel } from './ControlPanel'
import { DeadLetterShelf } from './DeadLetterShelf'
import { EventLog } from './EventLog'
import { OrderCounter } from './OrderCounter'
import { PickupCounter } from './PickupCounter'
import { StatsBoard } from './StatsBoard'
import { TicketRail } from './TicketRail'
import type { View } from './terms'

const ANNOUNCE_EVERY_MS = 3000

// one line for screen readers, in place of the full event stream
function summarize(engine: Engine) {
  const s = engine.getState()
  const c = countByStatus(s)
  return `${s.created} orders placed, ${s.delivered} delivered, ${c.retrying} retrying, ${c.parked} parked, ${c.dead} on the shelf. Breaker ${s.breaker.state}. Counter ${s.counter.mode}.`
}

export function KitchenSim() {
  const [engine] = useState(() => createEngine())
  const [view, setView] = useState<View>('cafe')
  const [announcement, setAnnouncement] = useState('')
  const root = useRef<HTMLDivElement>(null)

  // re-render whenever the engine moves, the state object itself is read fresh each time
  useSyncExternalStore(engine.subscribe, engine.getVersion, engine.getVersion)
  const state = engine.getState()

  // drive the simulated clock, but only while the kitchen is on screen and the tab is visible
  useEffect(() => {
    let frame = 0
    let last = 0
    let onScreen = true
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
    })
    if (root.current) observer.observe(root.current)

    const loop = (time: number) => {
      if (last && onScreen && !document.hidden) engine.advance(time - last)
      last = time
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [engine])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (engine.getState().created > 0) setAnnouncement(summarize(engine))
    }, ANNOUNCE_EVERY_MS)
    return () => window.clearInterval(timer)
  }, [engine])

  const props = { state, view, dispatch: engine.dispatch.bind(engine) }

  return (
    <div ref={root} className="kitchen">
      <ControlPanel {...props} onView={setView} />

      <div className="kitchen-pipeline mt-4">
        <OrderCounter {...props} />
        <TicketRail {...props} />
        <BaristaStation {...props} />
        <PickupCounter {...props} />
      </div>
      <DeadLetterShelf {...props} />

      <div className="kitchen-lower mt-4">
        <StatsBoard state={state} view={view} />
        <EventLog state={state} />
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
