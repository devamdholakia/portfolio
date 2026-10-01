import { experience } from '@/content/experience'
import { Section } from './Section'

// experience timeline, each role gets a loyalty-card stamp
export function Journal() {
  return (
    <Section id="journal" label="Stamped and dated" title="The Barista's Journal">
      <ol className="space-y-6">
        {experience.map((role, index) => (
          <li
            key={`${role.title}-${role.org}`}
            className="grid gap-4 rounded-lg border border-line bg-latte p-5 sm:grid-cols-[auto_1fr] sm:p-6"
          >
            <div
              aria-hidden
              className="flex h-16 w-16 -rotate-6 items-center justify-center rounded-full border-2 border-dashed border-caramel-ink font-mono text-sm font-semibold text-caramel-ink"
            >
              No.{index + 1}
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-xl font-semibold">
                  {role.title}, {role.org}
                </h3>
                <p className="font-mono text-sm text-mocha">{role.dates}</p>
              </div>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-mocha marker:text-caramel-ink">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              {role.stack && (
                <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-2">
                  {role.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-cream px-2.5 py-0.5 font-mono text-xs"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
