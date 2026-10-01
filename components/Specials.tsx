import { specials } from '@/content/experience'
import { Section } from './Section'

export function Specials() {
  return (
    <Section id="specials" label="Fresh today" title="Daily Specials">
      <ul className="grid gap-5 md:grid-cols-3">
        {specials.map((special) => (
          <li
            key={`${special.title}-${special.org}`}
            className="lift rounded-lg border border-line bg-latte p-5"
          >
            <p className="flex items-center gap-2 font-mono text-xs tracking-wide text-mocha uppercase">
              <span aria-hidden className="h-2 w-2 rounded-full bg-sage" />
              Now serving
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold">{special.title}</h3>
            <p className="font-medium text-caramel-ink">{special.org}</p>
            {special.note && <p className="mt-3 text-sm text-mocha">{special.note}</p>}
          </li>
        ))}
      </ul>
    </Section>
  )
}
