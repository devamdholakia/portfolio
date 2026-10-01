import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Credits',
  description: 'Fonts, icons, and assets used on this site.',
  alternates: { canonical: '/credits' },
}

// mirrors CREDITS.md at the repo root, keep the two in sync
export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl font-semibold">Credits</h1>
      <ul className="mt-6 list-disc space-y-3 pl-5 leading-relaxed marker:text-caramel-ink">
        <li>
          <strong>Fonts:</strong> Fraunces, Caveat, Inter, and JetBrains Mono, all from Google Fonts
          under the SIL Open Font License.
        </li>
        <li>
          <strong>Icons:</strong> Lucide, under the ISC License.
        </li>
        <li>
          <strong>Illustrations:</strong> the cup, steam, jars, shelf, frames, and receipt are
          original, drawn in SVG and CSS for this site.
        </li>
        <li>
          <strong>Textures:</strong> the chalkboard, wood, and paper are CSS gradients. No image
          assets are used.
        </li>
        <li>
          The café name and theme are original and are not affiliated with any coffee brand.
        </li>
      </ul>
    </div>
  )
}
