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
      'Cut a customer lookup from 4+ screens to one view for service reps by fetching linked accounts on the server with Spring Boot and React/Redux',
      'Shipped the lookup feature to production to lower average handle time on rep calls by owning it end to end, from data model and API design through rollout',
      'Moved 6 legacy internal-service integrations off fragile REST response parsing by rebuilding them on a typed GraphQL API where callers request only the fields they need',
    ],
    stack: ['Spring Boot', 'React/Redux', 'GraphQL'],
  },
  {
    title: 'Research Assistant',
    org: 'UCF ISUE Lab',
    location: 'Orlando, FL',
    dates: 'April 2026 to present',
    bullets: [
      'Built the related-work section for a SIGGRAPH submission on generating 3D scenes from text by reviewing and comparing methods across 65 papers',
      'Automated scoring of NASA-TLX and SUS user surveys by fine-tuning LLaMA with QLoRA on consumer hardware and combining several weighted models to improve accuracy',
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
    note: 'Generating 3D scenes from text, fine-tuning LLaMA with QLoRA, and building the related-work section for a SIGGRAPH submission',
  },
  { title: 'Secretary', org: 'AI@UCF', note: '450+ members, hosting technical workshops for student members' },
]
