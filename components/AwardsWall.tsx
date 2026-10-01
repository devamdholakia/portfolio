import { Award as AwardIcon } from 'lucide-react'
import { awards } from '@/content/awards'
import { Section } from './Section'

// framed certificates, the frame is just nested borders
export function AwardsWall() {
  return (
    <Section id="awards" label="On the wall" title="Awards">
      <ul className="grid gap-6 sm:grid-cols-2">
        {awards.map((award) => (
          <li
            key={`${award.place}-${award.event}`}
            className="lift rounded-sm border-8 border-mocha bg-latte p-2 shadow-md"
          >
            <div className="flex h-full flex-col items-center border border-caramel-ink/50 bg-cream px-5 py-7 text-center">
              <AwardIcon size={28} aria-hidden className="text-caramel-ink" />
              <p className="mt-3 font-display text-2xl font-semibold">{award.place}</p>
              <p className="mt-1 text-lg text-mocha">{award.event}</p>
              {award.detail && <p className="mt-1 font-mono text-sm text-mocha">{award.detail}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
