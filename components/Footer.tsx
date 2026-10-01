import Link from 'next/link'
import { site } from '@/content/site'
import { LinkOrTodo } from './Todo'

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-mocha sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-espresso">Open 24/7 on GitHub</p>
          <p className="mt-1">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-caramel-ink">
          <li>
            <LinkOrTodo value={site.links.github} label="GitHub" />
          </li>
          <li>
            <LinkOrTodo value={site.links.linkedin} label="LinkedIn" />
          </li>
          <li>
            <LinkOrTodo value={site.links.email} href={`mailto:${site.links.email}`} label="Email" />
          </li>
          <li>
            <Link href="/receipt" className="underline underline-offset-4">
              Résumé
            </Link>
          </li>
          <li>
            <Link href="/credits" className="underline underline-offset-4">
              Credits
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
