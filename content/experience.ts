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
      "Collapsed a 4+ screen rep lookup into a single round-trip by resolving a customer's linked-account graph server-side, shipping the feature in Spring Boot with a React/Redux client",
      'Drove end-to-end development of the feature, from data model and API contract through production rollout, targeting the service-rep workflow that drives average handle time',
      'Migrated 6 legacy internal-service integrations onto GraphQL, replacing brittle REST response parsing with a typed contract that lets callers select only the fields they need',
    ],
    stack: ['Spring Boot', 'React/Redux', 'GraphQL', 'Redis', 'YugabyteDB', 'GCP'],
  },
  {
    title: 'Research Assistant',
    org: 'UCF ISUE Lab',
    location: 'Orlando, FL',
    dates: 'April 2026 to present',
    bullets: [
      'Analyzed and synthesized methodologies from 65 papers to construct the related-works framework for a SIGGRAPH submission on language-conditioned 3D scene generation',
      'Automated NASA-TLX and SUS survey scoring by engineering a QLoRA fine-tuning pipeline for LLaMA on consumer-grade hardware, ensembling weighted models to improve accuracy',
    ],
    stack: ['PyTorch', 'QLoRA / PEFT', 'LLaMA'],
  },
]

export type Special = { title: string; org: string; note?: string }

// what Devam is doing right now
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
