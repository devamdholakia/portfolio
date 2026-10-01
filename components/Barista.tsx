import Image from 'next/image'
import { site } from '@/content/site'
import { Section } from './Section'
import { SteamCup } from './SteamCup'

export function Barista() {
  return (
    <Section id="barista" label="Behind the counter" title="About the Barista">
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
        {/* photo slot, the double ring is the cup rim */}
        <div className="mx-auto h-44 w-44 rounded-full border-4 border-mocha p-1.5 ring-4 ring-latte">
          {site.photo ? (
            <Image
              src={site.photo}
              alt={`Portrait of ${site.name}`}
              width={176}
              height={176}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label="Photo placeholder"
              className="flex h-full w-full items-center justify-center rounded-full bg-latte text-mocha"
            >
              <SteamCup className="h-20 w-20" />
            </div>
          )}
        </div>

        <p className="max-w-prose text-lg leading-relaxed">{site.bio}</p>

        <div className="chalkboard rounded-lg px-5 py-4">
          <h3 className="font-hand text-2xl text-caramel-chalk">Today&apos;s specials</h3>
          <ul className="mt-2 space-y-1 font-mono text-sm">
            {site.quickFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
