'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import {
  BASE_NAMES,
  MAX_PUMPS,
  MILK_NAMES,
  POUR_NAMES,
  SIZE_NAMES,
  SYRUP_NAMES,
  TOPPING_NAMES,
  createGame,
  dayPlan,
  formatMoney,
  rankFor,
  syrupLabel,
} from '@/lib/barista/game'
import type { Base, Customer, GameAction, GameState, Milk, Result, Size, Station, Syrup, Topping } from '@/lib/barista/types'
import { pill, pillActive } from '../kitchen/terms'
import { DrinkCup } from './DrinkCup'

type Dispatch = (action: GameAction) => void

const card = 'rounded-lg border border-line bg-latte p-4'
const heading = 'font-mono text-xs font-semibold tracking-wide text-mocha uppercase'
const primary =
  'inline-flex items-center justify-center gap-2 rounded-full bg-caramel px-5 py-2.5 text-sm font-semibold text-roast hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50'

// six looks: shirt and hair colors for the little portraits
const LOOKS = [
  ['#8A9A7B', '#3B2A20'],
  ['#C68A4E', '#1F1A17'],
  ['#6B8BA4', '#5C3A21'],
  ['#B5655A', '#2B1810'],
  ['#7C6FA8', '#8A4B1F'],
  ['#D9A441', '#3B2A20'],
]

function Portrait({ look }: { look: number }) {
  const [shirt, hair] = LOOKS[look % LOOKS.length]
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden className="shrink-0">
      <circle cx="20" cy="20" r="20" fill="#FBF8F1" />
      <path d="M6 40c0-9 6-14 14-14s14 5 14 14z" fill={shirt} />
      <circle cx="20" cy="17" r="8" fill="#D9A679" />
      <path d="M11.5 16c0-6 4-9 8.5-9s8.5 3 8.5 9c-3-1-5-3-6-5-2 3-7 4-11 5z" fill={hair} />
    </svg>
  )
}

// a group of buttons where one is chosen
function Choice<T extends string>({
  label,
  options,
  value,
  onPick,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T | null
  onPick: (value: T) => void
}) {
  return (
    <div>
      <p className={heading}>{label}</p>
      <div role="group" aria-label={label} className="mt-1.5 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onPick(option.value)}
            className={option.value === value ? pillActive : pill}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const options = <T extends string>(names: Record<T, string>) =>
  (Object.keys(names) as T[]).map((value) => ({ value, label: names[value] }))

// the order as the ticket lists it
function recipe(customer: Customer) {
  const o = customer.order
  return [
    `${SIZE_NAMES[o.size]} cup`,
    BASE_NAMES[o.base],
    `Pour: ${POUR_NAMES[o.pour]}`,
    MILK_NAMES[o.milk],
    o.iced ? 'Iced' : 'Hot',
    syrupLabel(o.syrup, o.pumps),
    TOPPING_NAMES[o.topping],
  ]
}

function Patience({ customer, now }: { customer: Customer; now: number }) {
  const left = Math.max(0, 1 - (now - customer.arrivedAt) / customer.patienceMs)
  return (
    <div
      role="progressbar"
      aria-label={`${customer.name}'s patience`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(left * 100)}
      className="h-1.5 overflow-hidden rounded bg-cream"
    >
      <div className="h-full origin-left bg-sage" style={{ transform: `scaleX(${left})` }} />
    </div>
  )
}

function Ticket({ customer, active, onSelect }: { customer: Customer; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${customer.name}'s ticket: ${recipe(customer).join(', ')}`}
      className={`ticket text-left ${active ? 'ring-2 ring-caramel-ink ring-offset-2 ring-offset-latte' : ''}`}
    >
      <span className="flex items-center gap-1 font-semibold">
        {customer.name}
        <span className="seal ml-auto" aria-hidden />
      </span>
      {recipe(customer).map((line) => (
        <span key={line}>{line}</span>
      ))}
    </button>
  )
}

function ResultCard({ result, onClose }: { result: Result; onClose: () => void }) {
  return (
    <div className="chalkboard rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-hand text-2xl text-caramel-chalk">{result.name} says</p>
          <p className="text-lg">{result.comment}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-chalk/50 px-3 py-1.5 text-sm font-medium">
          Got it
        </button>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ['Waiting', result.wait],
          ['Brewing', result.brew],
          ['Building', result.build],
          ['Overall', result.total],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="text-xs text-chalk/85">{label}</dt>
            <dd className="font-mono text-xl font-semibold">{value}</dd>
          </div>
        ))}
        <div className="flex flex-col-reverse">
          <dt className="text-xs text-chalk/85">Tip</dt>
          <dd className="font-mono text-xl font-semibold text-caramel-chalk">{formatMoney(result.tip)}</dd>
        </div>
      </dl>
    </div>
  )
}

function OrderStation({ state, dispatch }: { state: GameState; dispatch: Dispatch }) {
  const coming = state.arrivals.length
  return (
    <div>
      <p className="text-sm text-mocha">
        Take each order as customers walk in. Their patience bar keeps draining until the drink is served.
      </p>
      {state.queue.length === 0 ? (
        <p className="mt-4 text-mocha">The counter is empty. {coming > 0 ? 'Someone is on the way.' : ''}</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {state.queue.map((customer) => (
            <li key={customer.id} className="ticket-in rounded-md border border-line bg-cream p-3">
              <div className="flex items-center gap-3">
                <Portrait look={customer.look} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{customer.name}</p>
                  <Patience customer={customer} now={state.now} />
                </div>
                {customer.tookAt === null ? (
                  <button type="button" onClick={() => dispatch({ type: 'takeOrder', id: customer.id })} className={primary}>
                    Take order
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-mocha">
                    <Check size={14} aria-hidden />
                    Order taken
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {coming > 0 && <p className="mt-3 font-mono text-xs text-mocha">{coming} more on the way today</p>}
    </div>
  )
}

function BrewStation({ customer, dispatch }: { customer: Customer; dispatch: Dispatch }) {
  const drink = customer.drink
  const ready = Boolean(drink.size && drink.base)
  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <Choice<Size> label="1. Cup size" options={options(SIZE_NAMES)} value={drink.size} onPick={(size) => dispatch({ type: 'size', size })} />
        <Choice<Base> label="2. What goes in" options={options(BASE_NAMES)} value={drink.base} onPick={(base) => dispatch({ type: 'base', base })} />
        <div>
          <p className={heading}>3. Pour to the line</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!ready || (!drink.pouring && drink.level >= 1)}
              onClick={() => dispatch({ type: 'pourToggle' })}
              className={primary}
            >
              {drink.pouring ? 'Stop pouring' : drink.level > 0 ? 'Pour more' : 'Start pouring'}
            </button>
            <button type="button" disabled={drink.level === 0} onClick={() => dispatch({ type: 'pourReset' })} className={pill}>
              <RotateCcw size={14} aria-hidden />
              Dump it
            </button>
          </div>
          <p className="mt-2 text-sm text-mocha" aria-live="off">
            {ready
              ? `Stop when the drink reaches the ${POUR_NAMES[customer.order.pour]} line. Cup is ${Math.round(drink.level * 100)}% full.`
              : 'Pick a cup and a drink first.'}
          </p>
        </div>
        <button type="button" onClick={() => dispatch({ type: 'station', station: 'build' })} className={pill}>
          Next: Build station
          <ArrowRight size={14} aria-hidden />
        </button>
      </div>
      <DrinkCup drink={drink} showLines className="mx-auto h-56 w-52 text-espresso" />
    </div>
  )
}

function BuildStation({ customer, dispatch }: { customer: Customer; dispatch: Dispatch }) {
  const drink = customer.drink
  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <Choice<Milk> label="Milk" options={options(MILK_NAMES)} value={drink.milk} onPick={(milk) => dispatch({ type: 'milk', milk })} />
        <div>
          <p className={heading}>Temperature</p>
          <button type="button" aria-pressed={drink.iced} onClick={() => dispatch({ type: 'ice' })} className={`mt-1.5 ${drink.iced ? pillActive : pill}`}>
            {drink.iced ? 'Iced' : 'Hot'}: tap to {drink.iced ? 'remove' : 'add'} ice
          </button>
        </div>
        <div>
          <p className={heading}>
            Syrup: {syrupLabel(drink.syrup, drink.pumps)} (each tap is one pump, up to {MAX_PUMPS})
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(['vanilla', 'caramel', 'mocha'] as Syrup[]).map((syrup) => (
              <button
                key={syrup}
                type="button"
                aria-label={`Add a pump of ${SYRUP_NAMES[syrup]}`}
                onClick={() => dispatch({ type: 'pump', syrup })}
                className={drink.syrup === syrup ? pillActive : pill}
              >
                + {SYRUP_NAMES[syrup]}
              </button>
            ))}
            <button type="button" disabled={drink.pumps === 0} onClick={() => dispatch({ type: 'clearSyrup' })} className={pill}>
              Clear
            </button>
          </div>
        </div>
        <Choice<Topping> label="Topping" options={options(TOPPING_NAMES)} value={drink.topping} onPick={(topping) => dispatch({ type: 'topping', topping })} />
        <button type="button" onClick={() => dispatch({ type: 'serve' })} className={primary}>
          Serve to {customer.name}
        </button>
      </div>
      <DrinkCup drink={drink} className="mx-auto h-56 w-52 text-espresso" />
    </div>
  )
}

const STATIONS: { id: Station; label: string }[] = [
  { id: 'order', label: 'Order' },
  { id: 'brew', label: 'Brew' },
  { id: 'build', label: 'Build' },
]

export function BaristaGame() {
  const [game] = useState(() => createGame(Math.floor(Math.random() * 100000)))
  const root = useRef<HTMLDivElement>(null)
  useSyncExternalStore(game.subscribe, game.getVersion, game.getVersion)
  const state = game.getState()
  const dispatch: Dispatch = (action) => game.dispatch(action)

  // the shift clock only runs while the game is on screen and the tab is visible
  useEffect(() => {
    let frame = 0
    let last = 0
    let onScreen = true
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
    })
    if (root.current) observer.observe(root.current)
    const loop = (time: number) => {
      if (last && onScreen && !document.hidden) game.tick(time - last)
      last = time
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [game])

  const tickets = state.queue.filter((c) => c.tookAt !== null)
  const active = state.queue.find((c) => c.id === state.activeId) ?? null
  const waiting = state.queue.filter((c) => c.tookAt === null).length
  const average = state.results.length
    ? Math.round(state.results.reduce((sum, r) => sum + r.total, 0) / state.results.length)
    : 0

  return (
    <div ref={root}>
      {state.phase === 'menu' && (
        <div className={`${card} text-center`}>
          <p className="font-hand text-3xl text-caramel-ink">Barista Rush</p>
          <p className="mx-auto mt-2 max-w-xl text-mocha">
            You are behind the counter. Take each order, pour to the right line, build the drink, and serve it
            before the customer runs out of patience. Better drinks earn better tips.
          </p>
          <ol className="mx-auto mt-4 grid max-w-2xl gap-3 text-left text-sm sm:grid-cols-3">
            <li className="rounded-md border border-line bg-cream p-3">
              <strong className="font-display">1. Order</strong>
              <br />
              Take the ticket when a customer walks up.
            </li>
            <li className="rounded-md border border-line bg-cream p-3">
              <strong className="font-display">2. Brew</strong>
              <br />
              Pick the cup and the drink, then stop the pour on the line.
            </li>
            <li className="rounded-md border border-line bg-cream p-3">
              <strong className="font-display">3. Build</strong>
              <br />
              Milk, ice, syrup pumps, and topping. Then serve.
            </li>
          </ol>
          <button type="button" onClick={() => dispatch({ type: 'start' })} className={`${primary} mt-5`}>
            Open the café
          </button>
        </div>
      )}

      {state.phase !== 'menu' && (
        <div className="space-y-4">
          <div className={`${card} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-sm`}>
            <span className="font-hand text-2xl text-caramel-ink">Day {state.day}</span>
            <span>
              Served {state.results.length}/{state.customersToday}
            </span>
            <span>Average {state.results.length ? average : 'n/a'}</span>
            <span>Tips {formatMoney(state.tipsTotal)}</span>
          </div>

          {state.lastResult && <ResultCard result={state.lastResult} onClose={() => dispatch({ type: 'dismissResult' })} />}

          {state.phase === 'closed' ? (
            <div className={`${card} text-center`}>
              <p className="font-hand text-3xl text-caramel-ink">Day {state.day} is done</p>
              <p className="mt-2 text-lg">
                Average score {average}. Rank: <strong>{rankFor(average)}</strong>
              </p>
              <p className="text-mocha">
                Today&apos;s tips {formatMoney(state.results.reduce((sum, r) => sum + r.tip, 0))}, total {formatMoney(state.tipsTotal)}
              </p>
              <p className="mt-2 text-sm text-mocha">
                Day {state.day + 1}: {dayPlan(state.day + 1).customers} customers
                {state.day === 1 && ', and iced drinks, oat milk, and syrups join the menu'}
                {state.day === 2 && ', and toppings and extra pumps join the menu'}.
              </p>
              <button type="button" onClick={() => dispatch({ type: 'nextDay' })} className={`${primary} mt-4`}>
                Start day {state.day + 1}
              </button>
            </div>
          ) : (
            <>
              {/* the ticket line: pick which order you are working on */}
              <div className={card}>
                <p className={heading}>Ticket line</p>
                {tickets.length === 0 ? (
                  <p className="mt-2 text-sm text-mocha">No tickets yet. Take an order at the Order station.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tickets.map((customer) => (
                      <Ticket
                        key={customer.id}
                        customer={customer}
                        active={customer.id === state.activeId}
                        onSelect={() => dispatch({ type: 'select', id: customer.id })}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className={card}>
                <div role="group" aria-label="Stations" className="flex flex-wrap gap-2">
                  {STATIONS.map((station) => (
                    <button
                      key={station.id}
                      type="button"
                      aria-pressed={state.station === station.id}
                      onClick={() => dispatch({ type: 'station', station: station.id })}
                      className={state.station === station.id ? pillActive : pill}
                    >
                      {station.label} station
                      {station.id === 'order' && waiting > 0 && (
                        <span className="rounded-full bg-caramel px-1.5 font-mono text-xs text-roast">{waiting}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {state.station === 'order' && <OrderStation state={state} dispatch={dispatch} />}
                  {state.station !== 'order' && !active && (
                    <p className="text-mocha">Take an order first, then pick its ticket from the ticket line.</p>
                  )}
                  {state.station === 'brew' && active && <BrewStation customer={active} dispatch={dispatch} />}
                  {state.station === 'build' && active && <BuildStation customer={active} dispatch={dispatch} />}
                </div>

                {state.station === 'order' && tickets.length > 0 && (
                  <button type="button" onClick={() => dispatch({ type: 'station', station: 'brew' })} className={`${pill} mt-4`}>
                    Next: Brew station
                    <ArrowRight size={14} aria-hidden />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {state.announcement}
      </p>
    </div>
  )
}
