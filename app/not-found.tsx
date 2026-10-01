import Link from 'next/link'
import { SteamCup } from '@/components/SteamCup'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <SteamCup level={0} className="h-28 w-28 text-espresso" />
      <p className="mt-6 font-mono text-sm text-mocha">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">We&apos;re out of that one.</h1>
      <p className="mt-2 text-lg text-mocha">Try something from the menu.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-caramel px-5 py-2.5 text-sm font-semibold text-roast hover:brightness-105"
      >
        Back to the café
      </Link>
    </div>
  )
}
