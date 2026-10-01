import { Check, Clock, Coffee, Hourglass, Pause, TriangleAlert, X } from 'lucide-react'
import { ticketNo } from '@/lib/kitchen/engine'
import type { Ticket as TicketData } from '@/lib/kitchen/types'
import { DrinkIcon } from './DrinkIcon'
import { type View, simSeconds, term } from './terms'

type Props = { ticket: TicketData; now: number; view: View }

// state is always an icon plus words, never color alone
function status(ticket: TicketData, now: number) {
  if (ticket.orphaned) return { Icon: TriangleAlert, label: 'orphaned' }
  switch (ticket.status) {
    case 'brewing':
      return { Icon: Coffee, label: ticket.attempts === 0 ? 'brewing' : 'handing off' }
    case 'retrying':
      return { Icon: Clock, label: `retry in ${simSeconds(Math.max(0, (ticket.retryAt ?? now) - now))}s` }
    case 'parked':
      return { Icon: Pause, label: 'parked' }
    case 'dead':
      return { Icon: X, label: `gave up, ${ticket.attempts} tries` }
    case 'delivered':
      return { Icon: Check, label: 'delivered' }
    default:
      return { Icon: Hourglass, label: 'waiting' }
  }
}

export function Ticket({ ticket, now, view }: Props) {
  const { Icon, label } = status(ticket, now)
  const kind = ticket.orphaned ? 'orphaned' : ticket.status

  return (
    <li className="ticket ticket-in" data-status={kind}>
      <span className="flex items-center gap-1 font-semibold">
        <DrinkIcon drink={ticket.drink} size={14} />
        {ticketNo(ticket.id)}
        <span className="seal ml-auto" title={term('seal', view)} aria-hidden />
      </span>
      <span className="flex items-center gap-1">
        <Icon size={11} aria-hidden className="shrink-0" />
        {label}
      </span>
      {view === 'engineer' && (
        <span className="label-fade opacity-80">
          attempt={ticket.attempts}
          {ticket.status === 'retrying' && ticket.retryAt !== null && (
            <> nextRetry={simSeconds(Math.max(0, ticket.retryAt - now))}s</>
          )}
        </span>
      )}
    </li>
  )
}
