import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Award } from 'lucide-react'
import { LinkOrTodo, TextOrTodo, Todo } from '@/components/Todo'
import { getProject, projects } from '@/content/projects'
import { isTodo } from '@/content/site'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug)
  if (!project) return {}
  return {
    title: project.name,
    description: isTodo(project.tastingNote) ? undefined : project.tastingNote,
    alternates: { canonical: `/menu/${project.slug}` },
  }
}

function Block({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <p className="font-hand text-xl text-caramel-ink">{label}</p>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </section>
  )
}

// a list that is still a single TODO_ renders as one chip
function BulletsOrTodo({ items }: { items: string[] }) {
  if (items.every((item) => isTodo(item))) return <Todo value={items[0] ?? 'TODO'} />
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-caramel-ink">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug)
  if (!project) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/#menu"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-caramel-ink underline underline-offset-4"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to the menu
      </Link>

      <header className="mt-6 border-b border-line pb-6">
        <p className="font-hand text-2xl text-caramel-ink">{project.drink}</p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{project.name}</h1>
        <p className="mt-3 text-lg text-mocha">
          <TextOrTodo value={project.tastingNote} />
        </p>
        {(project.award || project.teamNote) && (
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {project.award && (
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Award size={16} aria-hidden className="text-caramel-ink" />
                {project.award}
              </span>
            )}
            {project.teamNote && <span className="text-mocha">{project.teamNote}</span>}
          </p>
        )}
      </header>

      <Block label="The Order" title="Problem">
        <p>
          <TextOrTodo value={project.problem} />
        </p>
      </Block>

      <Block label="The Recipe" title="Architecture">
        <p>
          <TextOrTodo value={project.architecture} />
        </p>
        {project.diagram ? (
          <figure className="mt-5 lg:-mx-24">
            {/* wider than the text column on desktop, scrolls sideways on phones so labels stay readable */}
            <div className="overflow-x-auto rounded-lg border border-line" tabIndex={0}>
              <Image
                src={project.diagram.src}
                alt={project.diagram.alt}
                width={project.diagram.width}
                height={project.diagram.height}
                className="h-auto w-full max-w-none min-w-[760px]"
              />
            </div>
            <figcaption className="mt-2 text-sm text-mocha">
              <a
                href={project.diagram.src}
                target="_blank"
                rel="noreferrer"
                className="text-caramel-ink underline underline-offset-4"
              >
                Open diagram full size
              </a>
            </figcaption>
          </figure>
        ) : (
          <div className="mt-5 flex aspect-[16/7] items-center justify-center rounded-lg border-2 border-dashed border-line p-4 text-center font-mono text-sm text-mocha">
            Architecture diagram goes here. Add a file to /public/diagrams and set
            &quot;diagram&quot; in content/projects.ts
          </div>
        )}
      </Block>

      <Block label="Ingredients" title="Tech stack">
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li key={item}>
              {isTodo(item) ? (
                <Todo value={item} />
              ) : (
                <span className="inline-block rounded-full border border-line bg-latte px-3 py-1 font-mono text-sm">
                  {item}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Brewing Notes" title="Design decisions and tradeoffs">
        <BulletsOrTodo items={project.decisions} />
      </Block>

      <Block label="Taste Test" title="Results">
        {project.results.length > 0 ? (
          <>
            <dl className="grid gap-3 sm:grid-cols-2">
              {project.results.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col-reverse rounded-lg border border-line bg-latte p-4"
                >
                  <dt className="mt-1 text-sm text-mocha">{metric.label}</dt>
                  <dd className="font-mono text-2xl font-semibold">{metric.value}</dd>
                </div>
              ))}
            </dl>
            {project.metricsNote && (
              <p className="mt-3 text-sm text-mocha">
                <strong className="font-semibold">How this was measured:</strong>{' '}
                {project.metricsNote}
              </p>
            )}
          </>
        ) : (
          <Todo value="TODO_RESULTS" />
        )}
      </Block>

      <Block label="What I'd Brew Next" title="Future improvements">
        <BulletsOrTodo items={project.next} />
      </Block>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="sr-only">Links</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-medium text-caramel-ink">
          <li>
            <LinkOrTodo value={project.links.repo} label="Repo" />
          </li>
          {project.links.demo && (
            <li>
              <LinkOrTodo value={project.links.demo} label="Demo" />
            </li>
          )}
          {project.links.writeup && (
            <li>
              <LinkOrTodo value={project.links.writeup} label="Writeup" />
            </li>
          )}
        </ul>
      </section>
    </article>
  )
}
