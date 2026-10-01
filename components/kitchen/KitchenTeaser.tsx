'use client'

import { setMode } from '@/lib/mode'

// Recruiter Mode stand-in for the simulator: one line, and a way back to the real thing
export function KitchenTeaser() {
  function open() {
    setMode('cafe')
    // wait a frame so the cafe view is laid out before scrolling to it
    requestAnimationFrame(() => document.getElementById('kitchen')?.scrollIntoView())
  }

  return (
    <p className="mt-2 text-sm">
      Interactive demos available in café view: a barista game and a simulation of Webhookd&apos;s delivery pipeline.{' '}
      <button type="button" onClick={open} className="font-medium text-caramel-ink underline underline-offset-4">
        Open the demo
      </button>
    </p>
  )
}
