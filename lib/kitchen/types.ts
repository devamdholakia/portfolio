import type { Breaker } from './breaker'

export type Drink = 'espresso' | 'latte' | 'coldbrew' | 'chai'

// every created ticket is always in exactly one of these
export type TicketStatus = 'waiting' | 'brewing' | 'retrying' | 'parked' | 'delivered' | 'dead'

export type Ticket = {
  // also the order number shown on the ticket
  id: number
  orderId: string
  drink: Drink
  status: TicketStatus
  attempts: number
  // sim time the ticket last joined the queue, used for FIFO
  queuedAt: number
  retryAt: number | null
  workerId: number | null
  // its barista went off shift mid-order, the sweeper will pick it up
  orphaned: boolean
  // the single delivery let through while the breaker is half-open
  probe: boolean
}

export type Worker = {
  id: number
  ticketId: number | null
  brewTotal: number
  brewLeft: number
}

export type CounterMode = 'open' | 'flaky' | 'closed'
export type BreakerState = 'closed' | 'open' | 'half-open'

export type LogKind = 'info' | 'ok' | 'warn' | 'bad'
export type LogEntry = { id: number; at: number; text: string; kind: LogKind }

export type Delivered = { id: number; drink: Drink; attempts: number; at: number }

export type Action =
  | { type: 'order'; drink?: Drink; orderId?: string }
  | { type: 'rush' }
  | { type: 'doubleTap'; drink?: Drink }
  | { type: 'counter'; mode: CounterMode }
  | { type: 'failureRate'; value: number }
  | { type: 'workers'; count: number }
  | { type: 'speed'; value: number }
  | { type: 'pause'; paused: boolean }
  | { type: 'replay' }
  | { type: 'reset' }
  | { type: 'scenario'; id: string }

export type Stream = { nextAt: number; intervalMs: number; left: number; duplicate: boolean }
export type Scheduled = { at: number; action: Action }

export type KitchenState = {
  // simulated milliseconds since the last reset
  now: number
  speed: number
  paused: boolean
  // live tickets only: delivered ones are counted and dropped
  tickets: Ticket[]
  workers: Worker[]
  counter: { mode: CounterMode; failureRate: number }
  breaker: Breaker
  created: number
  delivered: number
  // sum of attempts over delivered orders, for the average
  deliveredAttempts: number
  duplicates: number
  refused: number
  sweeps: number
  lastSweepAt: number | null
  recentDelivered: Delivered[]
  log: LogEntry[]
  // deliveries per bucket, oldest first
  spark: number[]
  scenarioId: string | null
  streams: Stream[]
  script: Scheduled[]
}
