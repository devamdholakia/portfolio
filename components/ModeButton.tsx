'use client'

import { usePathname, useRouter } from 'next/navigation'
import { isPlain, setMode } from '@/lib/mode'

// "Skip the Line" toggles Recruiter Mode, the label swaps with CSS so there is no hydration flicker
export function ModeButton({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  function toggle() {
    if (isPlain()) {
      setMode('cafe')
    } else {
      setMode('plain')
      // the one-scroll summary lives on the home page
      if (pathname !== '/') router.push('/?mode=plain')
    }
    window.scrollTo(0, 0)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center justify-center rounded-full bg-caramel px-4 py-2 text-sm font-semibold whitespace-nowrap text-roast hover:brightness-105 ${className}`}
    >
      <span className="cafe-only" title="Recruiter Mode: plain, fast summary">
        Skip the Line
      </span>
      <span className="plain-only">Back to the café</span>
    </button>
  )
}
