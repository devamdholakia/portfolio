import type { Metadata } from 'next'
import Image from 'next/image'
import { Download, ExternalLink } from 'lucide-react'
import { LinkOrTodo, TextOrTodo } from '@/components/Todo'
import { awards } from '@/content/awards'
import { experience } from '@/content/experience'
import { projects } from '@/content/projects'
import { site } from '@/content/site'
import { skills } from '@/content/skills'

export const metadata: Metadata = {
  title: 'Résumé',
  description: `Résumé of ${site.name}: experience, projects, skills, and awards.`,
  alternates: { canonical: '/receipt' },
}

const divider = 'my-5 border-t border-dashed border-roast-soft/60 print:border-solid print:border-neutral-400'
const heading = 'text-sm font-semibold tracking-widest uppercase'

// the real résumé up top, with the thermal receipt as a text version underneath
export default function ReceiptPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 print:max-w-none print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="font-display text-3xl font-semibold">Résumé</h1>
        <div className="flex gap-2">
          <a
            href={site.resumePath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-latte"
          >
            <ExternalLink size={16} aria-hidden />
            Open PDF
          </a>
          <a
            href={site.resumePath}
            download="Devam_Dholakia_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-full bg-caramel px-4 py-2 text-sm font-semibold text-roast hover:brightness-105"
          >
            <Download size={16} aria-hidden />
            Download PDF
          </a>
        </div>
      </div>

      {/* the real résumé, rendered from public/resume.pdf. The text version below keeps it readable for screen readers */}
      <a
        href={site.resumePath}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-lg border border-line shadow-lg print:rounded-none print:border-0 print:shadow-none"
      >
        <Image
          src="/resume.png"
          alt={`Résumé of ${site.name}. Opens the PDF. A text version follows on this page`}
          width={1445}
          height={1870}
          priority
          className="h-auto w-full bg-white"
        />
      </a>

      <details className="mx-auto mt-10 max-w-xl print:hidden">
        <summary className="cursor-pointer font-display text-xl font-semibold">
          Text version, as a receipt
        </summary>
      <div className="mt-6 drop-shadow-lg">
        <div className="bg-paper px-5 py-8 font-mono text-sm leading-relaxed text-roast sm:px-8 print:bg-white print:p-0 print:font-sans print:text-black">
          <header className="text-center print:text-left">
            <p className="tracking-widest uppercase print:hidden">{site.cafeName}</p>
            <p className="mt-2 text-xl font-semibold print:mt-0 print:text-2xl">{site.name}</p>
            <p>{site.role}</p>
            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 print:justify-start">
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
          </header>

          <hr className={divider} />
          <section>
            <h2 className={heading}>Education</h2>
            <div className="mt-2 flex flex-wrap justify-between gap-x-4">
              <p className="font-semibold">{site.education.school}</p>
              <p>{site.education.dates}</p>
            </div>
            <p>
              {site.education.degree}, GPA {site.education.gpa}
            </p>
          </section>

          <hr className={divider} />
          <section>
            <h2 className={heading}>Experience</h2>
            {experience.map((role) => (
              <div key={`${role.title}-${role.org}`} className="mt-3 break-inside-avoid">
                <div className="flex flex-wrap justify-between gap-x-4">
                  <h3 className="font-semibold">
                    {role.title}, {role.org}
                  </h3>
                  <p>{role.dates}</p>
                </div>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                {role.stack && <p className="mt-1">Stack: {role.stack.join(', ')}</p>}
              </div>
            ))}
          </section>

          <hr className={divider} />
          <section>
            <h2 className={heading}>Projects</h2>
            {projects.map((project) => (
              <div key={project.slug} className="mt-3 break-inside-avoid">
                <h3 className="font-semibold">
                  {project.name}
                  {project.award && `, ${project.award}`}
                </h3>
                <p>
                  <TextOrTodo value={project.tastingNote} />
                </p>
                {project.headlineMetrics.length > 0 && (
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {project.headlineMetrics.map((metric) => (
                      <li key={metric.value}>
                        {metric.value} {metric.label}
                      </li>
                    ))}
                  </ul>
                )}
                {project.metricsNote && <p className="mt-1 text-xs">{project.metricsNote}</p>}
                <p className="mt-1">
                  Stack:{' '}
                  {project.stack.map((item, i) => (
                    <span key={item}>
                      {i > 0 && ', '}
                      <TextOrTodo value={item} />
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </section>

          <hr className={divider} />
          <section>
            <h2 className={heading}>Skills</h2>
            <dl className="mt-2 space-y-1">
              {skills.map((group) => (
                <div key={group.category}>
                  <dt className="inline font-semibold">{group.category}: </dt>
                  <dd className="inline">{group.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </section>

          <hr className={divider} />
          <section>
            <h2 className={heading}>Awards</h2>
            <ul className="mt-2 space-y-1">
              {awards.map((award) => (
                <li key={`${award.place}-${award.event}`}>
                  {award.place}, {award.event}
                  {award.detail && ` (${award.detail})`}
                </li>
              ))}
            </ul>
          </section>

          <hr className={`${divider} print:hidden`} />
          <p className="text-center text-xs text-roast-soft print:hidden">
            Thank you for stopping by ☕
          </p>
        </div>
        <div aria-hidden className="receipt-edge" />
      </div>
      </details>
    </div>
  )
}
