'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { CAFE_NAME } from '@/content/site'
import { ModeButton } from './ModeButton'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { href: '/#menu', label: 'Menu' },
  { href: '/#specials', label: 'Specials' },
  { href: '/#ingredients', label: 'Ingredients' },
  { href: '/#barista', label: 'Barista' },
  { href: '/#order', label: 'Order' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur print:hidden">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4"
      >
        <Link href="/" className="min-w-0 truncate font-display text-lg font-semibold text-espresso">
          {CAFE_NAME}
        </Link>

        <div className="flex items-center gap-2">
          <ul className="cafe-only mr-2 hidden items-center gap-5 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm font-medium text-mocha hover:text-espresso">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ModeButton />
          <ThemeToggle className="cafe-only hidden sm:inline-flex" />

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="cafe-only inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-espresso md:hidden"
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="cafe-only border-t border-line bg-cream px-4 py-3 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-medium text-espresso"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-3 border-t border-line pt-3 sm:hidden">
            <ThemeToggle />
            <span className="text-sm text-mocha">Night Shift</span>
          </div>
        </div>
      )}
    </header>
  )
}
