import { skills } from '@/content/skills'
import { Section } from './Section'

// a shelf of glass jars built from plain divs, one jar per skill category
export function IngredientShelf() {
  return (
    <Section id="ingredients" label="Stocked on the shelf" title="Ingredients">
      <ul className="grid grid-cols-1 gap-x-5 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((jar) => (
          <li key={jar.category} className="flex flex-col">
            <div className="flex flex-1 flex-col px-4 pt-6">
              {/* lid */}
              <div aria-hidden className="mx-auto h-4 w-3/5 rounded-t-md bg-mocha" />
              {/* glass */}
              <div className="flex-1 rounded-t-xl rounded-b-3xl border-2 border-mocha/60 bg-glass px-4 pt-4 pb-6">
                <h3 className="mx-auto w-fit -rotate-1 rounded-sm bg-cream px-3 py-0.5 font-hand text-2xl shadow-sm">
                  {jar.category}
                </h3>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {jar.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-latte px-3 py-1 text-sm font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div aria-hidden className="shelf" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
