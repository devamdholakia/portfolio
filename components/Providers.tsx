'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { isPlain } from '@/lib/mode'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // easter egg for anyone who opens DevTools
  useEffect(() => {
    console.log(
      "%cLooking at the source? The kitchen's open: github.com/devamdholakia",
      'font-family: monospace; color: #C68A4E; font-size: 13px',
    )
  }, [])

  // keep ?mode=plain in the URL while moving between pages
  useEffect(() => {
    const url = new URL(window.location.href)
    if (isPlain() && url.searchParams.get('mode') !== 'plain') {
      url.searchParams.set('mode', 'plain')
      window.history.replaceState(null, '', url)
    }
  }, [pathname])

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
