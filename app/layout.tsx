import type { Metadata, Viewport } from 'next'
import { Caveat, Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { Providers } from '@/components/Providers'
import { site } from '@/content/site'
import { bootScript } from '@/lib/mode'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
// only the body and display fonts are preloaded, the other two are short labels
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  preload: false,
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
})

const title = `${site.cafeName} | ${site.name}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.cafeName}` },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: site.description,
    url: '/',
    siteName: site.cafeName,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${site.cafeName} café sign` }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.description,
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6EFE4' },
    { media: '(prefers-color-scheme: dark)', color: '#2E3430' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${caveat.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-espresso focus:px-3 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
