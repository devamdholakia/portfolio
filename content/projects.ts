export type Metric = { value: string; label: string }

export type Project = {
  slug: string
  // playful menu name
  drink: string
  // real project name
  name: string
  tastingNote: string
  award?: string
  teamNote?: string
  stack: string[]
  // 1 to 2 numbers shown on the menu card
  headlineMetrics: Metric[]
  // how the numbers were measured, shown next to them
  metricsNote?: string
  problem: string
  architecture: string
  // file under /public/diagrams, leave out to show a placeholder box
  diagram?: { src: string; alt: string; width: number; height: number }
  decisions: string[]
  results: Metric[]
  next: string[]
  links: { repo: string; demo?: string; writeup?: string }
}

export const projects: Project[] = [
  {
    slug: 'webhookd',
    drink: 'House Special',
    name: 'Webhookd',
    tastingNote:
      'At-least-once webhook delivery service with retries, signing, and failure recovery',
    stack: ['Java 21', 'Spring Boot 3', 'AWS SQS', 'DynamoDB', 'Docker'],
    headlineMetrics: [
      { value: '200 events/sec', label: 'sustained under k6 load testing' },
      { value: '0 events lost', label: 'across simulated 10-minute subscriber outages' },
    ],
    metricsNote:
      'Measured locally against LocalStack with a custom failure-injection receiver, not in production.',
    problem:
      'Webhook subscribers time out, go offline, and come back later. Webhookd is a delivery service built around that reality: it accepts each event once, then keeps working to deliver it at least once, with signed payloads and recovery paths for the failures in between.',
    architecture:
      'Ingest is idempotent, with a 24h dedup window. Each delivery is signed with HMAC-SHA256. Failed attempts are retried with full-jitter exponential backoff, up to 7 times, before the delivery is dead-lettered. A per-subscription circuit breaker trips after 10 consecutive failures, and a background sweeper scans a sparse DynamoDB GSI to recover orphaned deliveries.',
    decisions: [
      'At-least-once delivery: duplicates are possible by design, in exchange for not silently dropping events',
      'Idempotent ingest with a 24h dedup window, so a producer can safely retry a publish',
      'HMAC-SHA256 signing, so subscribers can verify where a payload came from and that it was not altered',
      'Full-jitter exponential backoff across 7 retries before dead-lettering, which spreads retries out instead of sending them in synchronized bursts',
      'Per-subscription circuit breaker after 10 consecutive failures, so a failing endpoint is isolated from the other subscriptions',
      'Background sweeper over a sparse DynamoDB GSI to recover orphaned deliveries. A sparse index only holds the items that carry the indexed attribute, which keeps the sweep small',
    ],
    results: [
      { value: '200 events/sec', label: 'sustained under k6 load testing' },
      { value: '0 events lost', label: 'across simulated 10-minute subscriber outages' },
      { value: '7 retries', label: 'with full-jitter backoff before dead-lettering' },
      { value: '24h', label: 'dedup window on ingest' },
    ],
    next: ['TODO_NEXT_STEPS'],
    links: { repo: 'https://github.com/devamdholakia/Webhook' },
  },
  {
    slug: 'apex',
    drink: 'Pit Stop Cold Brew',
    name: 'Apex',
    tastingNote:
      'Real-time race strategy simulator with ML lap-time prediction and Monte Carlo strategy engine',
    teamNote: 'Built all four layers solo',
    stack: ['Python', 'XGBoost', 'NumPy', 'FastAPI', 'WebSockets', 'Next.js'],
    headlineMetrics: [
      { value: '0.91s MAE', label: 'at mid-race, a 41% cut over the naive baseline' },
      { value: '9.5ms p50', label: 'Monte Carlo strategy engine' },
    ],
    problem:
      'Race strategy is decided live, while the race is still unfolding. Apex predicts lap times with a machine learning model, runs a Monte Carlo engine over possible strategies, and streams the results to the browser in real time.',
    architecture:
      'Four layers, built solo: a two-stage Ridge + XGBoost lap-time residual model, a vectorized Monte Carlo strategy engine, a WebSocket streaming backend on FastAPI, and a Next.js frontend.',
    decisions: [
      'Two-stage lap-time model: Ridge first, then XGBoost on the residual',
      'Monte Carlo engine vectorized with NumPy, which keeps a strategy run at 9.5ms p50',
      'WebSocket streaming instead of request/response, holding a 7.8ms p50 round-trip at 120 updates/sec',
    ],
    results: [
      { value: '0.91s', label: 'lap-time MAE at mid-race' },
      { value: '41%', label: 'cut in error over the naive baseline' },
      { value: '9.5ms p50', label: 'Monte Carlo strategy engine' },
      { value: '7.8ms p50', label: 'WebSocket round-trip at 120 updates/sec' },
    ],
    next: ['TODO_NEXT_STEPS'],
    links: { repo: 'TODO_LINK' },
  },
  {
    slug: 'paradise',
    drink: 'Hackathon Blend',
    name: 'Paradise',
    tastingNote:
      'Touch-only wrist-vibration guidance for people with visual and auditory impairments',
    award: '3rd place overall, ShellHacks 2026',
    teamNote: 'Team project',
    stack: ['TODO_STACK'],
    headlineMetrics: [],
    problem: 'TODO_PROBLEM_STATEMENT',
    architecture: 'TODO_ARCHITECTURE',
    decisions: ['TODO_DESIGN_DECISIONS'],
    results: [],
    next: ['TODO_NEXT_STEPS'],
    links: { repo: 'TODO_LINK' },
  },
  {
    slug: 'uknight',
    drink: 'Team Roast',
    name: 'uKnight',
    tastingNote: 'TODO_DESCRIPTION',
    teamNote: 'Built with a 6-engineer team',
    stack: ['Spring Boot', 'WebRTC', 'Redis', 'Google Cloud Run'],
    headlineMetrics: [],
    problem: 'TODO_PROBLEM_STATEMENT',
    architecture: 'TODO_ARCHITECTURE',
    decisions: ['TODO_DESIGN_DECISIONS'],
    results: [],
    next: ['TODO_NEXT_STEPS'],
    links: { repo: 'TODO_LINK' },
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
