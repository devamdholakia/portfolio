export type Size = 'small' | 'medium' | 'large'
export type Base = 'espresso' | 'coldbrew' | 'chai'
export type Pour = 'short' | 'regular' | 'tall'
export type Milk = 'none' | 'whole' | 'oat'
export type Syrup = 'none' | 'vanilla' | 'caramel' | 'mocha'
export type Topping = 'none' | 'foam' | 'whip' | 'cinnamon' | 'drizzle'
export type Station = 'order' | 'brew' | 'build'

// what the customer asked for
export type Order = {
  size: Size
  base: Base
  pour: Pour
  milk: Milk
  iced: boolean
  syrup: Syrup
  pumps: number
  topping: Topping
}

// what the player has made so far
export type Drink = {
  size: Size | null
  base: Base | null
  // how full the cup is, 0 to 1
  level: number
  pouring: boolean
  milk: Milk
  iced: boolean
  syrup: Syrup
  pumps: number
  topping: Topping
}

export type Customer = {
  id: number
  name: string
  // picks the colors of the little portrait
  look: number
  order: Order
  arrivedAt: number
  patienceMs: number
  // null until the player takes the order
  tookAt: number | null
  drink: Drink
}

export type Result = {
  customerId: number
  name: string
  wait: number
  brew: number
  build: number
  total: number
  // in cents
  tip: number
  comment: string
}

export type Phase = 'menu' | 'open' | 'closed'

export type GameState = {
  phase: Phase
  day: number
  // milliseconds since the shift started
  now: number
  // everyone at the counter who has not been served yet, in arrival order
  queue: Customer[]
  arrivals: { at: number; customer: Customer }[]
  activeId: number | null
  station: Station
  results: Result[]
  customersToday: number
  // cents, across every day played
  tipsTotal: number
  lastResult: Result | null
  // one line for screen readers when something happens
  announcement: string
}

export type GameAction =
  | { type: 'start' }
  | { type: 'nextDay' }
  | { type: 'station'; station: Station }
  | { type: 'takeOrder'; id: number }
  | { type: 'select'; id: number }
  | { type: 'size'; size: Size }
  | { type: 'base'; base: Base }
  | { type: 'pourToggle' }
  | { type: 'pourReset' }
  | { type: 'milk'; milk: Milk }
  | { type: 'ice' }
  | { type: 'pump'; syrup: Syrup }
  | { type: 'clearSyrup' }
  | { type: 'topping'; topping: Topping }
  | { type: 'serve' }
  | { type: 'dismissResult' }
