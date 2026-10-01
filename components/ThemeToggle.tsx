'use client'

import { useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'

const query = '(prefers-color-scheme: dark)'

function isDark() {
  const picked = document.documentElement.dataset.theme
  return picked ? picked === 'dark' : window.matchMedia(query).matches
}

// watch both the attribute and the OS setting so every toggle on the page agrees
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] })
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => {
    observer.disconnect()
    media.removeEventListener('change', onChange)
  }
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false)

  function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // private mode, the choice just will not persist
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Night Shift (dark mode)"
      title="Night Shift"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-espresso hover:bg-latte ${className}`}
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  )
}
