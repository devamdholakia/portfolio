import type { Drink } from '@/lib/kitchen/types'

// four tiny hand-drawn drinks, decorative: the name is always next to them
const paths: Record<Drink, React.ReactNode> = {
  espresso: (
    <>
      <path d="M5 10h10v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
      <path d="M15 11h1.5a2 2 0 0 1 0 4H15" />
      <path d="M3 20h14" />
    </>
  ),
  latte: (
    <>
      <path d="M6 5h10l-1 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      <path d="M6.5 10h9" />
      <path d="M16 8h1.5a2.5 2.5 0 0 1 0 5H15.6" />
    </>
  ),
  coldbrew: (
    <>
      <path d="M6 7h11l-1.2 13a1.5 1.5 0 0 1-1.5 1.4H8.7A1.5 1.5 0 0 1 7.2 20z" />
      <path d="M13 7l2-5" />
      <path d="M9 12h2v2H9zM12.5 15.5h2v2h-2z" />
    </>
  ),
  chai: (
    <>
      <path d="M4 11h13v2a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" />
      <path d="M17 12h1.5a2 2 0 0 1 0 4h-2" />
      <path d="M10.5 8c-2-2 2-3 0-5" />
    </>
  ),
}

export function DrinkIcon({ drink, size = 16 }: { drink: Drink; size?: number }) {
  return (
    <svg
      viewBox="0 0 22 23"
      width={size}
      height={size}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {paths[drink]}
    </svg>
  )
}
