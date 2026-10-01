'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getProject } from '@/content/projects'
import { Section } from '../Section'
import { Segmented } from './Segmented'

const loading = () => (
  <p className="rounded-lg border border-dashed border-line p-6 text-center font-mono text-sm text-mocha">
    Warming up the kitchen
  </p>
)

// both are client-only and loaded on demand, so they cost the first paint nothing
const KitchenSim = dynamic(() => import('./KitchenSim').then((m) => m.KitchenSim), { ssr: false, loading })
const BaristaGame = dynamic(() => import('../barista/BaristaGame').then((m) => m.BaristaGame), {
  ssr: false,
  loading,
})

const link = 'text-caramel-ink underline underline-offset-4'

function Footnote({ embedded }: { embedded: boolean }) {
  const repo = getProject('webhookd')?.links.repo
  return (
    <p className="mt-4 text-sm text-mocha">
      Simplified in-browser simulation. The real thing runs on Java 21, Spring Boot, SQS, and DynamoDB.{' '}
      {!embedded && (
        <>
          <Link href="/menu/webhookd" className={link}>
            Read the Webhookd write-up
          </Link>
          {' · '}
        </>
      )}
      {repo && (
        <a href={repo} target="_blank" rel="noreferrer" className={link}>
          Webhookd on GitHub
        </a>
      )}
    </p>
  )
}

type Tab = 'play' | 'watch'

// embedded: the bare pipeline simulator for the Webhookd page. Otherwise the full home page section
export function Kitchen({ embedded = false }: { embedded?: boolean }) {
  const [tab, setTab] = useState<Tab>('play')

  if (embedded) {
    return (
      <>
        <KitchenSim />
        <Footnote embedded />
      </>
    )
  }

  return (
    <Section id="kitchen" label="Step behind the counter" title="The Kitchen: Make the Orders Yourself">
      <p className="mb-4 max-w-2xl text-lg text-mocha">
        {tab === 'play'
          ? 'Work a shift: take orders, pour, build, and serve. Then switch tabs to see the delivery pipeline I built for real.'
          : 'Every order here goes through the same kind of pipeline I built in Webhookd. Place a few, then close the counter and see what happens.'}
      </p>
      <div className="mb-5">
        <Segmented<Tab>
          label="Kitchen mode"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'play', label: 'Play: Barista Rush' },
            { value: 'watch', label: 'Watch: Order Pipeline' },
          ]}
        />
      </div>
      {tab === 'play' ? (
        <BaristaGame />
      ) : (
        <>
          <KitchenSim />
          <Footnote embedded={false} />
        </>
      )}
    </Section>
  )
}
