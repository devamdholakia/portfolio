import { site } from '@/content/site'
import { ModeButton } from './ModeButton'
import { RefillCup } from './RefillCup'

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-10 md:grid-cols-[1.2fr_1fr] md:pt-20">
      <div>
        {/* open sign, text comes from content/site.ts */}
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-latte px-3 py-1.5 text-sm font-medium">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-sage ring-2 ring-sage/30" />
          {site.availability}
        </p>

        {/* the cafe sign */}
        <div className="mt-6 inline-block rounded-xl border-4 border-mocha bg-board px-6 py-4 shadow-lg">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-chalk sm:text-6xl">
            {site.cafeName}
          </h1>
        </div>

        <p className="mt-6 max-w-xl font-display text-2xl sm:text-3xl">{site.tagline}</p>
        <p className="mt-3 font-mono text-sm text-mocha">{site.subline}</p>

        <div className="mt-8 flex flex-wrap gap-3">
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
        <RefillCup />
      </div>
    </section>
  )
}
