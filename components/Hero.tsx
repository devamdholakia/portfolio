import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/content/site'
import { ModeButton } from './ModeButton'
import { RefillCup } from './RefillCup'
import { LinkOrTodo } from './Todo'

// how far the hero portrait is zoomed in: 112% shows the full cut-out, larger crops tighter
const PORTRAIT_ZOOM = '135%'

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
        <ul className="mt-3 flex flex-wrap gap-2">
          {site.highlights.map((item) => (
            <li
              key={item}
              className="rounded-full border border-caramel-ink/40 bg-latte px-3 py-1 font-mono text-sm font-semibold"
            >
              {item}
            </li>
          ))}
        </ul>
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
            <Link
              href="/receipt"
              prefetch={false}
              className="underline decoration-1 underline-offset-4 hover:decoration-2"
            >
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
          {site.avatar ? (
            // pop-out portrait, zoomed to chest up: the disc sits behind, the cut-out is clipped to the disc at the bottom only
            <div className="relative h-[19rem] w-64 sm:h-[24rem] sm:w-80">
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 aspect-square rounded-full border-4 border-mocha bg-gradient-to-b from-latte to-cream shadow-xl ring-4 ring-latte"
              />
              <div className="absolute inset-x-1 top-0 bottom-1 overflow-hidden rounded-b-full">
                <Image
                  src={site.avatar}
                  alt={`Illustrated portrait of ${site.name}`}
                  width={640}
                  height={640}
                  loading="eager"
                  fetchPriority="high"
                  style={{ width: PORTRAIT_ZOOM }}
                  className="absolute top-0 left-1/2 max-w-none -translate-x-1/2 drop-shadow-lg"
                />
              </div>
            </div>
          ) : site.photo ? (
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
          {/* the cup keeps its easter egg, tucked beside the portrait */}
          <div
            className={
              site.avatar || site.photo
                ? 'absolute -right-6 -bottom-4 rounded-full border border-line bg-cream p-1 shadow-md'
                : ''
            }
          >
            <RefillCup className={site.avatar || site.photo ? 'h-20 w-20 sm:h-24 sm:w-24' : undefined} />
          </div>
        </div>
      </div>
    </section>
  )
}
