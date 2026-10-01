'use client'

import { isTodo, site } from '@/content/site'
import { Section } from './Section'
import { LinkOrTodo } from './Todo'

const field =
  'mt-1 w-full rounded border border-roast-soft/50 bg-white px-3 py-2 font-sans text-roast focus-visible:outline-roast'

export function OrderTicket() {
  const emailMissing = isTodo(site.links.email)

  // no backend: this opens the visitor's mail app. Swap this handler for a form service if needed
  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = `Order from ${data.get('name')}`
    const body = `${data.get('message')}\n\nFrom: ${data.get('name')} (${data.get('email')})`
    window.location.href = `mailto:${site.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <Section id="order" label="Counter service" title="Order Here">
      <div className="mx-auto max-w-md drop-shadow-lg">
        <div className="bg-paper px-6 pt-7 pb-5 font-mono text-sm text-roast">
          <p className="text-center text-base font-semibold tracking-widest uppercase">
            Order ticket
          </p>
          <p className="mt-1 text-center text-roast-soft">{site.cafeName}</p>

          <ul className="mt-5 space-y-2 border-y border-dashed border-roast-soft/60 py-4">
            <li>
              <LinkOrTodo
                value={site.links.email}
                href={`mailto:${site.links.email}`}
                label="Email"
              />
            </li>
            <li>
              <LinkOrTodo value={site.links.github} label="GitHub" />
            </li>
            <li>
              <LinkOrTodo value={site.links.linkedin} label="LinkedIn" />
            </li>
          </ul>

          <form onSubmit={placeOrder} className="mt-4 space-y-3">
            <label className="block">
              Name
              <input name="name" type="text" required autoComplete="name" className={field} />
            </label>
            <label className="block">
              Email
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block">
              Message
              <textarea name="message" required rows={4} className={field} />
            </label>
            <button
              type="submit"
              disabled={emailMissing}
              className="w-full rounded bg-roast px-4 py-2.5 font-semibold text-paper hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Place Order
            </button>
            {emailMissing && (
              <p className="text-xs text-roast-soft">
                The form turns on once an email is set in content/site.ts
              </p>
            )}
          </form>

          <p className="mt-5 border-t border-dashed border-roast-soft/60 pt-4 text-center text-xs text-roast-soft">
            Thank you for stopping by ☕
          </p>
        </div>
        <div aria-hidden className="receipt-edge" />
      </div>
    </Section>
  )
}
