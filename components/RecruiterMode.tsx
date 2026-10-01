import Link from 'next/link'
import { awards } from '@/content/awards'
import { experience } from '@/content/experience'
import { projects } from '@/content/projects'
import { isTodo, site } from '@/content/site'
import { skills } from '@/content/skills'
import { LinkOrTodo, TextOrTodo } from './Todo'

const heading = 'mt-10 border-b border-line pb-1 text-sm font-semibold tracking-wider uppercase'

// same content as the cafe, no decoration, built to be scanned in one scroll
export function RecruiterMode() {
  return (
    <div className="plain-only mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{site.name}</h1>
      <p className="mt-1 text-mocha">{site.role}</p>
      <p className="mt-1 text-sm text-mocha">
        {site.education.school} · {site.education.degree} · GPA {site.education.gpa} · {site.education.dates}
      </p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-caramel-ink">
        <li>
          <LinkOrTodo value={site.links.email} href={`mailto:${site.links.email}`} label="Email" />
        </li>
        <li>
          <LinkOrTodo value={site.links.github} label="GitHub" />
        </li>
        <li>
          <LinkOrTodo value={site.links.linkedin} label="LinkedIn" />
        </li>
        <li>
          <a href={site.resumePath} className="underline underline-offset-4">
            Résumé (PDF)
          </a>
        </li>
      </ul>

      <p className="mt-6 leading-relaxed">{site.bio}</p>
      <p className="mt-2 text-sm font-medium">{site.availability.replace('Now Brewing: ', '')}</p>

      <h2 className={heading}>Experience</h2>
      {experience.map((role) => (
        <div key={`${role.title}-${role.org}`} className="mt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-semibold">
              {role.title}, {role.org}
            </h3>
            <p className="text-sm text-mocha">{role.dates}</p>
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          {role.stack && <p className="mt-1.5 text-sm text-mocha">Stack: {role.stack.join(', ')}</p>}
        </div>
      ))}

      <h2 className={heading}>Projects</h2>
      {projects.map((project) => (
        <div key={project.slug} className="mt-4">
          <h3 className="font-semibold">
            <Link
              href={`/menu/${project.slug}`}
              className="text-caramel-ink underline underline-offset-4"
            >
              {project.name}
            </Link>
            {project.award && <span className="font-normal"> · {project.award}</span>}
          </h3>
          <p className="mt-1 text-sm">
            <TextOrTodo value={project.tastingNote} />
            {project.teamNote && ` (${project.teamNote.toLowerCase()})`}
          </p>
          {project.headlineMetrics.length > 0 && (
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm">
              {project.headlineMetrics.map((metric) => (
                <li key={metric.value}>
                  <strong>{metric.value}</strong> {metric.label}
                </li>
              ))}
            </ul>
          )}
          {project.metricsNote && <p className="mt-1 text-xs text-mocha">{project.metricsNote}</p>}
          <p className="mt-1.5 text-sm text-mocha">
            Stack:{' '}
            {project.stack.map((item, i) => (
              <span key={item}>
                {i > 0 && ', '}
                <TextOrTodo value={item} />
              </span>
            ))}
            {!isTodo(project.links.repo) && (
              <>
                {' · '}
                <LinkOrTodo value={project.links.repo} label="Repo" className="text-caramel-ink" />
              </>
            )}
          </p>
        </div>
      ))}

      <h2 className={heading}>Skills</h2>
      <dl className="mt-4 space-y-1.5 text-sm">
        {skills.map((group) => (
          <div key={group.category} className="sm:flex sm:gap-2">
            <dt className="shrink-0 font-semibold sm:w-40">{group.category}</dt>
            <dd>{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>

      <h2 className={heading}>Awards</h2>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
        {awards.map((award) => (
          <li key={`${award.place}-${award.event}`}>
            {award.place}, {award.event}
            {award.detail && ` (${award.detail})`}
          </li>
        ))}
      </ul>

      <h2 className={heading}>Résumé</h2>
      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-caramel-ink">
        <a href={site.resumePath} className="underline underline-offset-4">
          Download PDF
        </a>
        <Link href="/receipt" className="underline underline-offset-4">
          View printable résumé
        </Link>
      </p>
    </div>
  )
}
