import { useId } from 'react'

type Props = {
  className?: string
  // keep the steam going without hover
  always?: boolean
  // how full the cup is, 0 to 1
  level?: number
}

// hand-drawn SVG mug, decorative unless the parent labels it
export function SteamCup({ className = '', always = false, level = 1 }: Props) {
  const clip = useId()

  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden
      className={`${always ? 'steam-always' : ''} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g strokeWidth="3" opacity="0.8">
        <path className="steam-wisp" d="M46 36c-5-6 5-10 0-17" />
        <path className="steam-wisp" d="M60 36c-5-6 5-10 0-17" />
        <path className="steam-wisp" d="M74 36c-5-6 5-10 0-17" />
      </g>

      <clipPath id={clip}>
        <path d="M28 46h64v24a30 30 0 0 1-30 30h-4a30 30 0 0 1-30-30z" />
      </clipPath>
      <g clipPath={`url(#${clip})`} stroke="none">
        <rect x="28" y="46" width="64" height="54" fill="#F6EFE4" />
        <rect
          className="cup-liquid"
          x="28"
          y="52"
          width="64"
          height="48"
          fill="#7A4A1E"
          style={{ transform: `scaleY(${level})` }}
        />
      </g>

      <path d="M28 46h64v24a30 30 0 0 1-30 30h-4a30 30 0 0 1-30-30z" />
      <path d="M92 54h5a11 11 0 0 1 0 22h-6" />
      <path d="M20 108h80" />
    </svg>
  )
}
