import { useId } from 'react'
import { POUR_NAMES, POUR_TARGET } from '@/lib/barista/game'
import type { Base, Drink, Milk, Pour, Syrup } from '@/lib/barista/types'

const BASE_COLOR: Record<Base, string> = { espresso: '#4A2C1A', coldbrew: '#2B1810', chai: '#B5763A' }
const MILK_COLOR: Record<Milk, string | null> = { none: null, whole: '#F1E3C8', oat: '#DCC8A4' }
const SYRUP_COLOR: Record<Syrup, string> = { none: 'none', vanilla: '#F3E5AB', caramel: '#C68A4E', mocha: '#6B4226' }
const SCALE = { small: 0.78, medium: 0.9, large: 1 }

// cup geometry in viewBox units
const TOP = 22
const BOTTOM = 136
const HEIGHT = BOTTOM - TOP
const CUP = `M20 ${TOP}h80l-12 ${HEIGHT}a6 6 0 0 1-6 5H38a6 6 0 0 1-6-5z`

// blend two hex colors, used to lighten the drink when milk goes in
function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(' ')})`
}

type Props = { drink: Drink; showLines?: boolean; className?: string }

// the drink as it is being made, drawn in SVG. Decorative: the same facts are in the text next to it
export function DrinkCup({ drink, showLines = false, className = '' }: Props) {
  const clip = useId()
  const scale = drink.size ? SCALE[drink.size] : 0.9
  const top = BOTTOM - drink.level * HEIGHT
  const milk = MILK_COLOR[drink.milk]
  const liquid = drink.base ? (milk ? mix(BASE_COLOR[drink.base], milk, 0.5) : BASE_COLOR[drink.base]) : '#4A2C1A'
  const hasLiquid = drink.level > 0.02

  return (
    <svg viewBox="0 0 150 160" aria-hidden className={className}>
      <g style={{ transform: `translate(${60 - 60 * scale}px, ${141 - 141 * scale}px) scale(${scale})` }}>
        <clipPath id={clip}>
          <path d={CUP} />
        </clipPath>
        <path d={CUP} fill="#FBF8F1" />
        <g clipPath={`url(#${clip})`}>
          {hasLiquid && <rect x="0" y={top} width="120" height={BOTTOM - top + 6} fill={liquid} />}
          {/* syrup settles at the bottom, one band per pump */}
          {drink.pumps > 0 && (
            <rect x="0" y={BOTTOM + 5 - drink.pumps * 7} width="120" height={drink.pumps * 7} fill={SYRUP_COLOR[drink.syrup]} opacity="0.9" />
          )}
          {drink.iced && hasLiquid &&
            [38, 58, 76].map((x, i) => (
              <rect key={x} x={x} y={top + 5 + (i % 2) * 9} width="13" height="13" rx="2.5" fill="#fff" opacity="0.55" transform={`rotate(${i * 14 - 10} ${x + 6} ${top + 12})`} />
            ))}
          {drink.topping === 'foam' && <rect x="0" y={top - 9} width="120" height="11" fill="#FFFDF7" />}
        </g>
        {drink.topping === 'whip' && (
          <g fill="#FFFDF7" stroke="#3B2A20" strokeWidth="1.5">
            <circle cx="44" cy={Math.min(top, 60) - 6} r="12" />
            <circle cx="76" cy={Math.min(top, 60) - 6} r="12" />
            <circle cx="60" cy={Math.min(top, 60) - 16} r="13" />
          </g>
        )}
        {drink.topping === 'cinnamon' &&
          [36, 48, 60, 72, 84, 54, 66].map((x, i) => (
            <circle key={i} cx={x} cy={top - 3 - (i % 3) * 3} r="1.8" fill="#8A4B1F" />
          ))}
        {drink.topping === 'drizzle' && (
          <path d={`M30 ${top - 4}l10 -6 10 6 10 -6 10 6 10 -6 10 6`} fill="none" stroke="#C68A4E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}
        <path d={CUP} fill="none" stroke="#3B2A20" strokeWidth="3" strokeLinejoin="round" strokeDasharray={drink.size ? undefined : '6 5'} />
        {/* fill lines to aim for at the brew station */}
        {showLines &&
          (Object.keys(POUR_TARGET) as Pour[]).map((pour) => {
            const y = BOTTOM - POUR_TARGET[pour] * HEIGHT
            return (
              <g key={pour}>
                <line x1="14" x2="106" y1={y} y2={y} stroke="#A63D2F" strokeWidth="1.5" strokeDasharray="5 4" />
                <text x="110" y={y + 4} fontSize="10" fontWeight="700" fill="currentColor" fontFamily="var(--code)">
                  {POUR_NAMES[pour]}
                </text>
              </g>
            )
          })}
      </g>
    </svg>
  )
}
