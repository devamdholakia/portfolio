'use client'

import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { SteamCup } from './SteamCup'

const SIPS = 5

// easter egg: every click takes a sip, the fifth one refills the cup
export function RefillCup() {
  const [clicks, setClicks] = useState(0)
  const [refilled, setRefilled] = useState(false)

  function sip() {
    const next = clicks + 1
    if (next >= SIPS) {
      setClicks(0)
      setRefilled(true)
      window.setTimeout(() => setRefilled(false), 1800)
    } else {
      setClicks(next)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={sip}
        aria-label="Coffee cup, take a sip"
        className="steam-host block rounded-full text-espresso"
      >
        <SteamCup always level={1 - clicks * 0.2} className="h-56 w-56 sm:h-72 sm:w-72" />
      </button>

      <p aria-live="polite" className="sr-only">
        {refilled ? 'Refilled' : ''}
      </p>
      <AnimatePresence>
        {refilled && (
          <m.span
            aria-hidden
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-sage px-3 py-1 font-hand text-xl text-roast"
          >
            Refilled!
          </m.span>
        )}
      </AnimatePresence>
    </div>
  )
}
