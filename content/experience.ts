export type Role = {
  title: string
  org: string
  dates: string
  bullets: string[]
  stack?: string[]
}

// newest first is not required, this renders in the order written
export const experience: Role[] = [
  {
    title: 'Software Engineering Intern',
    org: 'USAA',
    dates: 'May to August 2026',
    bullets: [
      'Built a feature in an internal CRM for member service representatives to search members by product (including HELOC) and view product details, aimed at reducing average handle time on member calls',
      'Implemented a feature flag toggling member data retrieval between the legacy method and GraphQL',
      'Migrated 6 internal services to GraphQL',
    ],
    stack: ['Spring Boot', 'React/Redux', 'Redis', 'YugabyteDB', 'GCP'],
  },
  {
    title: 'Research Assistant',
    org: 'UCF ISUE Lab',
    dates: '2026 to present',
    bullets: [
      'Language-conditioned 3D scene generation',
      'LLaMA fine-tuning with QLoRA',
      'Contributing to a SIGGRAPH-related paper',
    ],
  },
]

export type Special = { title: string; org: string; note?: string }

// what Dev is doing right now
export const specials: Special[] = [
  {
    title: 'Research Assistant',
    org: 'UCF ISUE Lab',
    note: 'Language-conditioned 3D scene generation, LLaMA fine-tuning with QLoRA, and contributing to a SIGGRAPH-related paper',
  },
  { title: 'Secretary', org: 'AI@UCF' },
  {
    title: 'Incoming Software Engineering Intern',
    org: 'USAA',
    note: 'Summer 2027, return offer',
  },
]
