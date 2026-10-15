export type Role = {
  title: string
  org: string
  location?: string
  dates: string
  bullets: string[]
  stack?: string[]
}

// newest first is not required, this renders in the order written
export const experience: Role[] = [
  {
    title: 'Software Engineering Intern',
    org: 'USAA',
    location: 'San Antonio, TX',
    dates: 'May to August 2026',
    bullets: [
      "Built product-based member search in Conversant, USAA's internal CRM, cutting a member lookup from 4+ screens to one React/Redux view by fetching linked accounts and product details server-side in Spring Boot",
      'Replaced 6 hand-parsed legacy REST integrations with one typed GraphQL API so the CRM fetches only the fields it needs through a single schema, rolled out behind a feature flag with instant legacy fallback',
      'Shipped member search to production in 3 staged releases (roles config, GraphQL API, React front end) so each layer could be verified and rolled back independently, after designing the data model and API contract',
    ],
    stack: ['Spring Boot', 'React/Redux', 'GraphQL'],
  },
  {
    title: 'Research Assistant',
    org: 'Hardening Build Systems Project, UCF',
    location: 'Orlando, FL',
    dates: 'September 2026 to present',
    bullets: [
      'Classifying 100+ ACM papers by build pipeline attack (secret exfiltration, binary backdoors, pipeline hijacking) across GitHub Actions, Jenkins, and Maven to scope a systematic review of CI/CD supply-chain security',
    ],
    stack: ['GitHub Actions', 'Jenkins', 'Maven'],
  },
]

export type Special = { title: string; org: string; note?: string }

// what Devam is doing right now
export const specials: Special[] = [
  {
    title: 'Research Assistant',
    org: 'Hardening Build Systems Project, UCF',
    note: 'Classifying 100+ ACM papers on CI/CD supply-chain attacks to scope a systematic review of build pipeline security',
  },
  {
    title: 'Secretary',
    org: 'AI@UCF',
    note: '450+ members, hosted 10+ hands-on workshops on LLMs, AI agents, and NLP averaging 20+ attendees',
  },
]
