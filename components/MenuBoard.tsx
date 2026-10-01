import { projects } from '@/content/projects'
import { FadeIn } from './Section'
import { MenuItem } from './MenuItem'

// chalkboard menu, one card per entry in content/projects.ts
export function MenuBoard() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <FadeIn>
        <div className="chalkboard rounded-xl p-5 sm:p-8">
          <p className="font-hand text-2xl text-caramel-chalk">Today&apos;s menu</p>
          <h2 id="menu-title" className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
            Signature Drinks
          </h2>
          <p className="mt-2 max-w-2xl text-chalk/90">
            Featured projects. Each one links to a full write-up with architecture, tradeoffs, and
            measured results.
          </p>

          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <MenuItem project={project} />
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </section>
  )
}
