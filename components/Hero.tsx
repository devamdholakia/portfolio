import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/content/site'
import { ModeButton } from './ModeButton'
import { RefillCup } from './RefillCup'
import { LinkOrTodo } from './Todo'

// the storefront leads with who Devam is, the cafe name is the label above
export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-10 md:grid-cols-[1.3fr_1fr] md:pt-20">
      <div>
        {/* open sign, text comes from content/site.ts */}
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-latte px-3 py-1.5 text-sm font-medium">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-sage ring-2 ring-sage/30" />
          {site.availability}
        </p>

        <p className="mt-6 font-hand text-2xl text-caramel-ink">Welcome to {site.cafeName}</p>

        {/* the cafe sign carries the name */}
        <div className="mt-2 inline-block rounded-xl border-4 border-mocha bg-board px-6 py-4 shadow-lg">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-chalk sm:text-6xl">
            {site.name}
          </h1>
        </div>

        <p className="mt-5 font-mono text-sm text-mocha">{site.heroLine}</p>
        <p className="mt-4 max-w-xl font-display text-2xl sm:text-3xl">{site.tagline}</p>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-caramel-ink">
          <li>
            <LinkOrTodo value={site.links.email} href={`mailto:${site.links.email}`} label="Email" />
          </li>
          <li>
            <LinkOrTodo value={site.links.github} label="GitHub" />
          </li>
          <li>
            <LinkOrTodo value={site.links.linkedin} label="LinkedIn" />
          </li>
          <li>
            <Link href="/receipt" className="underline decoration-1 underline-offset-4 hover:decoration-2">
              Résumé
            </Link>
          </li>
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#menu"
            className="inline-flex items-center justify-center rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream hover:opacity-90"
          >
            See the Menu
          </a>
          <ModeButton className="px-5 py-2.5" />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          {site.photo ? (
            <div className="h-56 w-56 rounded-full border-4 border-mocha p-1.5 ring-4 ring-latte sm:h-72 sm:w-72">
              <Image
                src={site.photo}
                alt={`Portrait of ${site.name}`}
                width={288}
                height={288}
                priority
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          ) : null}
          {/* the cup keeps its easter egg, tucked beside the photo */}
          <div className={site.photo ? 'absolute -right-6 -bottom-6 rounded-full bg-cream p-1' : ''}>
            <RefillCup className={site.photo ? 'h-24 w-24 sm:h-28 sm:w-28' : undefined} />
          </div>
        </div>
      </div>
    </section>
  )
}
