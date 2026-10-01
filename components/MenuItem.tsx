import Link from 'next/link'
import { ArrowRight, Award } from 'lucide-react'
import type { Project } from '@/content/projects'
import { SteamCup } from './SteamCup'
import { TextOrTodo, Todo } from './Todo'
import { isTodo } from '@/content/site'

export function MenuItem({ project }: { project: Project }) {
  return (
    <article className="lift steam-host flex h-full flex-col rounded-lg border border-chalk/25 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-hand text-3xl leading-none text-caramel-chalk">{project.drink}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">{project.name}</h3>
        </div>
        <SteamCup className="h-12 w-12 shrink-0 text-chalk" />
      </div>

      <p className="mt-3 text-chalk/90">
        <TextOrTodo value={project.tastingNote} />
      </p>

      {(project.award || project.teamNote) && (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-chalk/90">
          {project.award && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-caramel-chalk">
              <Award size={16} aria-hidden />
              {project.award}
            </span>
          )}
          {project.teamNote && <span>{project.teamNote}</span>}
        </p>
      )}

      <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li key={item}>
            {isTodo(item) ? (
              <Todo value={item} />
            ) : (
              <span className="inline-block rounded-full border border-chalk/40 px-2.5 py-0.5 font-mono text-xs">
                {item}
              </span>
            )}
          </li>
        ))}
      </ul>

      {project.headlineMetrics.length > 0 && (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {project.headlineMetrics.map((metric) => (
            <div key={metric.value} className="flex flex-col-reverse">
              <dt className="text-sm text-chalk/80">{metric.label}</dt>
              <dd className="font-mono text-lg font-semibold text-caramel-chalk">{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {project.metricsNote && <p className="mt-2 text-xs text-chalk/80">{project.metricsNote}</p>}

      <div className="mt-auto pt-5">
        <Link
          href={`/menu/${project.slug}`}
          aria-label={`Order details: ${project.name}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-caramel-chalk underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          Order details
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  )
}
