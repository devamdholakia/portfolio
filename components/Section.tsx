'use client'

import { m } from 'framer-motion'

// fades a block in the first time it scrolls into view
export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}

type Props = {
  id: string
  // short handwritten label above the heading
  label: string
  title: string
  children: React.ReactNode
}

export function Section({ id, label, title, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <FadeIn>
        <p className="font-hand text-2xl text-caramel-ink">{label}</p>
        <h2 id={`${id}-title`} className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </FadeIn>
    </section>
  )
}
