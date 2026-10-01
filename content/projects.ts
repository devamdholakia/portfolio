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

// priority order: the first entry is the House Special, and this is the order on the menu
export const projects: Project[] = [
  {
    slug: 'paradise',
    drink: 'House Special',
    name: 'Paradise',
    tastingNote:
      'Touch-only wrist-vibration guidance for people with visual and auditory impairments',
    award: '3rd Best Overall, ShellHacks 2026',
    teamNote: '4-person team',
    stack: [
      'JavaScript',
      'Node.js',
      'YOLO',
      'CLIP',
      'Depth Anything V2',
      'Gemini API',
      'ONNX Runtime',
      'WebRTC',
      'WebSockets',
      'WebHID',
    ],
    headlineMetrics: [
      { value: '3 signals', label: 'left, right, and forward, plus a double buzz for arrival' },
    ],
    problem:
      'Most navigation tools assume you can see a screen or hear spoken directions. For people with combined visual and auditory impairments, a ride arriving nearby says nothing about where the car stopped, how to reach it, or where the door handle is. Paradise explores whether touch alone can cover that last stretch: it guides the wearer through vibrations on their wrists, to an object indoors or to a specific car on the street.',
    architecture:
      'The wearer has a controller on each wrist and a phone mounted on their chest. YOLO runs on the phone to spot people, cars, and obstacles in the path, and the camera streams live to a laptop over WebRTC. On the laptop, a second detector looks for the requested object and estimates its distance from its usual size. A small classifier trained on CLIP features picks out the target car, and routing follows sidewalks instead of a straight line. Gemini turns a request like "something to drink" into an object the camera can search for, and confirms from a photo that the target is within reach. The laptop drives the two controllers over WebHID and serves a live dashboard of the feed, detections, and current signal.',
    diagram: {
      src: '/diagrams/paradise.svg',
      alt: 'Paradise architecture: a chest phone, a second phone, and a spoken request feed a laptop coordinator, which drives two wrist controllers and uses Gemini, sidewalk routing, and a live dashboard',
      width: 960,
      height: 370,
    },
    decisions: [
      'A vocabulary of three steady signals. The first version had more and was hard to follow, so it was cut down to left, right, and forward, with a double buzz for arrival. When the buzzing stops, you stop',
      'Arrival gets its own check. From a chest camera a bottle can look close while still out of reach, so the arrival buzz waits for a size-based distance estimate and a Gemini photo check',
      'Where a model runs matters. Time-sensitive obstacle detection runs on the phone, object finding runs on the laptop, and the language model only interprets requests and confirms the final approach',
      'An object only counts once it appears in 3 of the last 5 frames, which filters out one-frame false detections',
      'Object detectors missed some obstacles, such as a box on the floor, so a depth model was added as a second layer',
      'If a person or obstacle enters the path, the walk signal stops until the way is clear',
      'There is no public API for the ride service, so a second phone stands in for the car and the ride status is simulated. The demo says so plainly',
    ],
    results: [
      { value: '3rd', label: 'Best Overall at ShellHacks 2026' },
      { value: '3 signals', label: 'plus a double buzz for arrival' },
      { value: '3 of 5 frames', label: 'needed before a detection counts' },
      {
        value: 'Blindfold test',
        label: 'a tester with a blindfold and ear defenders found a water bottle and walked to a car',
      },
    ],
    next: [
      'Work with people who have visual impairments or combined visual and auditory impairments, and improve the design from their feedback',
      'Connect to a real ride service so the car location and arrival status are live',
      'Move more processing onto the phone so the laptop is not needed',
      'Support more everyday tasks, such as finding a door, an empty seat, or a crosswalk button',
    ],
    links: {
      repo: 'https://github.com/Akhileshreddym/Paradise',
      writeup: 'https://devpost.com/software/paradise-n0i7of',
    },
  },
  {
    slug: 'uknight',
    drink: 'Team Roast',
    name: 'uKnight',
    tastingNote: 'Anonymous video chat for verified students',
    teamNote: 'Built with a 6-engineer team',
    stack: ['Spring Boot', 'WebRTC', 'React', 'PostgreSQL', 'Redis', 'GCP Cloud Run', 'Docker'],
    headlineMetrics: [{ value: '72 users', label: 'verified .edu sign-ups in 3 weeks' }],
    problem:
      'On a large campus you are surrounded by thousands of people, yet most interactions stay inside existing friend groups and majors. uKnight brings back spontaneous video chat inside a verified community: only students with a school .edu email can join, get matched, and talk, with built-in games and icebreakers to get past the awkward first minute.',
    architecture:
      'A Next.js front end talks to a Spring Boot (Java 21) backend over WebSockets with STOMP for signaling, and WebRTC carries peer-to-peer media. Redis holds the matchmaking queue, session state, and a live online counter. PostgreSQL persists account state. The signaling and API tiers are containerized with Docker and run on GCP Cloud Run, with the front end on Vercel.',
    diagram: {
      src: '/diagrams/uknight.svg',
      alt: 'uKnight architecture: two student browsers signal through a Spring Boot service on Cloud Run backed by Redis, PostgreSQL, and Firestore, while media flows peer to peer over WebRTC with a TURN fallback',
      width: 960,
      height: 284,
    },
    decisions: [
      'Redis-backed matchmaking queue keeps pairing state out of the app tier, so signaling scales statelessly and autoscaled instances stay interchangeable',
      'Matching runs as a Lua script on a Redis sorted set scored by join time. It is atomic, which removes the race where two threads claim the same waiting user, and it gives FIFO ordering for free',
      'STUN/TURN fallback relays through TURN when symmetric NAT blocks a direct peer path, which keeps calls connecting on locked-down campus networks',
      'Session state lives in Redis hashes with a 2-hour TTL instead of in-memory maps, so it survives restarts and is shared across instances',
      'Stale queue entries older than 5 minutes are pruned on each match attempt, as a safety net for connections that dropped without a clean disconnect',
      'Signup is gated behind .edu verification, so safety is part of onboarding and not bolted on later',
    ],
    results: [
      { value: '72', label: 'verified .edu users in 3 weeks' },
      { value: '6', label: 'engineers on the team' },
    ],
    next: [
      'Multi-campus support beyond the first university',
      'Group experiences such as themed study rooms',
      'Automated admin tooling for moderation',
      'Scaling the real-time stack to higher concurrency across campuses',
    ],
    links: {
      repo: 'https://github.com/uKnight-Co/uKnight',
      demo: 'https://www.uknight.net',
      writeup: 'https://devpost.com/software/uknight-qlam8n',
    },
  },
  {
    slug: 'apex',
    drink: 'Pit Stop Cold Brew',
    name: 'Apex',
    tastingNote:
      'Real-time race strategy simulator with ML lap-time prediction and Monte Carlo strategy engine',
    teamNote: 'Built at Hacklytics 2026 with a 4-person team',
    stack: ['Python', 'XGBoost', 'NumPy', 'FastAPI', 'WebSockets', 'Next.js'],
    headlineMetrics: [
      { value: '0.91s MAE', label: 'at mid-race, a 41% cut over the naive baseline' },
      { value: '14ms p95', label: 'for 10,000 Monte Carlo race simulations' },
    ],
    problem:
      'Race strategy is decided live, while the race is still unfolding. Apex puts the user on the pit wall: when an event such as rain or a safety car hits, the backend predicts lap times, simulates the rest of the race thousands of times, and streams a strategy recommendation back in real time.',
    architecture:
      'A steward console sends an event over WebSocket to a FastAPI server. Stage 1, a Ridge regression on circuit geometry, estimates base pace for the circuit. Stage 2, XGBoost, predicts the per-lap residual from race state such as tire age, compound, position, stint, and fuel load. A vectorized NumPy Monte Carlo engine then runs 10,000 race simulations and the result is broadcast to every connected pit wall client. The dashboard is a Next.js app.',
    diagram: {
      src: '/diagrams/apex.svg',
      alt: 'Apex architecture: a steward console sends events over WebSocket to a FastAPI server that runs the Ridge and XGBoost model and a Monte Carlo engine, then streams results to the pit wall dashboard',
      width: 960,
      height: 284,
    },
    decisions: [
      'Two-stage lap-time model. Ridge handles the circuit-level baseline because, with one row per circuit, a regularized linear model extrapolates more safely than a tree. XGBoost then learns the per-lap residual, where it is strong on tabular data with nonlinear interactions',
      'Honest evaluation over a flattering one. Inflated cross-validation scores were traced to a base-pace target leak, and validation was rebuilt around grouped and forward-chaining splits. Under forward-chaining validation the number is 0.91s',
      'Monte Carlo vectorized with NumPy, so 10,000 simulations run at 14ms p95',
      'WebSocket streaming instead of request/response, pushing strategy updates to the client at 120 per second',
      'The language model only formats the result into a radio call. All of the math stays in the model and the simulation',
    ],
    results: [
      { value: '0.91s', label: 'lap-time MAE at mid-race, under forward-chaining validation' },
      { value: '41%', label: 'error cut over a mean-of-observed-laps baseline' },
      { value: '14ms p95', label: 'for 10,000 race simulations' },
      { value: '120/sec', label: 'strategy updates streamed over WebSockets' },
      { value: '10,244 laps', label: 'cleaned, across 11 races and 22 drivers' },
      { value: '14', label: 'engineered features' },
    ],
    next: [
      'More circuit data for the Stage 1 base-pace model',
      'Learn event penalties from historical races instead of hardcoding them',
      'Full race replays and custom scenarios',
      'Player versus player strategy battles',
    ],
    links: {
      repo: 'https://github.com/Akhileshreddym/Apex',
      writeup: 'https://devpost.com/software/apex-vq9a2m',
    },
  },
  {
    slug: 'webhookd',
    drink: 'Double Shot',
    name: 'Webhookd',
    tastingNote:
      'At-least-once webhook delivery service with retries, signing, and failure recovery',
    stack: ['Java 21', 'Spring Boot 3', 'AWS SQS', 'DynamoDB', 'Docker', 'Prometheus', 'LocalStack'],
    headlineMetrics: [
      { value: '200 events/sec', label: 'sustained under k6 load testing' },
      { value: '0 events lost', label: 'across simulated 10-minute subscriber outages' },
    ],
    metricsNote:
      'Measured locally against LocalStack with a custom failure-injection receiver, not in production.',
    problem:
      'Webhook subscribers time out, go offline, and come back later. Webhookd accepts events over HTTP, fans them out to subscriber endpoints, retries with exponential backoff and jitter, and dead-letters after a bounded number of attempts. An accepted event is always delivered, dead-lettered, or still retrying.',
    architecture:
      'Ingest reserves an idempotency key, matches subscriptions, writes PENDING delivery rows to DynamoDB, then enqueues a reference on SQS. A long-polling worker loads the delivery, checks the per-subscription circuit breaker, and POSTs the payload with an HMAC-SHA256 signature. A 2xx deletes the message, a retryable failure extends its visibility timeout, and an exhausted delivery goes to the dead-letter queue. A sweeper runs every 30 seconds and re-enqueues stale PENDING rows. Metrics are exported through Micrometer to Prometheus.',
    diagram: {
      src: '/diagrams/webhookd.svg',
      alt: 'Webhookd architecture: a producer posts events to webhookd, which keeps state in DynamoDB, queues references on SQS, sends signed requests to subscribers, dead-letters exhausted deliveries, and exposes metrics to Prometheus',
      width: 960,
      height: 370,
    },
    decisions: [
      'Attempts are counted in DynamoDB, not by the SQS receive count. Parking a message behind an open circuit breaker still increments the receive count, so letting SQS own the retry budget would dead-letter healthy events without a single HTTP call',
      'Retries reuse the same message through ChangeMessageVisibility instead of re-enqueueing with a delay. That avoids a delete-then-send window where a crash duplicates the delivery, and visibility goes to 12 hours where delay caps at 15 minutes',
      'The queue carries a reference, not the payload. Messages stay tiny and no application data lives in the queue, at the cost of one strongly consistent read per attempt',
      'State is written before the enqueue, and a sweeper over a sparse GSI closes the gap. The index only holds in-flight work, so the sweep stays small. This is what makes the at-least-once claim hold through a crash',
      'Per-subscription circuit breaker: after 10 consecutive failures the endpoint is marked open for 30 seconds, so one dead subscriber cannot occupy the worker pool',
      'Full jitter on backoff. Without it, every retry parked during an outage fires the moment the endpoint recovers and knocks it over again',
      '4xx and 5xx are treated differently. Subscriber configuration errors such as 404 or 401 go straight to the dead-letter queue, while 408, 429, 5xx, and timeouts retry',
      'Idempotent ingest per tenant and idempotency key for 24 hours. A repeat returns the original event ID and does not fan out again',
    ],
    results: [
      { value: '200 events/sec', label: 'sustained under k6 load testing' },
      { value: '0 events lost', label: 'across simulated 10-minute subscriber outages' },
      { value: '7 attempts', label: 'spread over roughly 20 minutes before dead-lettering' },
      { value: '~$7.10', label: 'modeled cost per million deliveries, from on-demand pricing' },
    ],
    next: [
      'Payload offload to S3 above the 200KB cap, with the reference in DynamoDB',
      'Dead-letter replay endpoint',
      'Optional per-subscriber FIFO ordering',
      'Subscription secret rotation with dual-signature headers during the overlap',
      'Per-subscriber rate limiting so a slow endpoint cannot dominate the pool',
      'Batched deletes and skipping the per-attempt write on first-attempt success, to cut the DynamoDB-bound cost',
    ],
    links: { repo: 'https://github.com/devamdholakia/Webhookd' },
  },
  {
    slug: 'sap-archive-decoder',
    drink: "Champion's Pour",
    name: 'SAP Archive Decoder',
    tastingNote: 'Decodes binary SAP archives into CSV and JSON with schema-driven parsers',
    award: '1st place, KnightHacks 2025 (Auritas Challenge)',
    teamNote: '4-person team',
    stack: ['Python', 'concurrent.futures', 'struct', 'gzip', 'lz4', 'zstandard'],
    headlineMetrics: [
      { value: '5/5 archives', label: 'decoded to CSV/JSON' },
      { value: '≥95%', label: 'field accuracy, built in 36 hours' },
    ],
    problem:
      'The Auritas Challenge at KnightHacks 2025: take binary SAP archives, which use specialized data types and fixed-length fields inside several compression formats, and turn them into accurate CSV and JSON within a 36-hour hackathon.',
    architecture:
      'A single Python CLI. Each file is fingerprinted by its container framing to tell gzip, lz4, and zstandard apart, then decompressed. Records are parsed against a schema that gives each field a name, type, and length, covering SAP types such as CHAR, NUMC, DATE, INT4, and packed decimal. Files are decoded in parallel with ProcessPoolExecutor, per-field validators check the output, and the parsed data is exported to CSV and JSON.',
    diagram: {
      src: '/diagrams/sap-archive-decoder.svg',
      alt: 'SAP Archive Decoder pipeline: archives are fingerprinted, decompressed, parsed against a schema, and validated in parallel workers, then exported to CSV and JSON, with corrupt records quarantined',
      width: 960,
      height: 328,
    },
    decisions: [
      'Schema-driven parsers for 7 SAP field types, including PACKED/BCD, so a new layout is a schema change and not new parsing code',
      'Compression is detected per file from container framing, so one CLI handles every archive variant with no per-file configuration or format hints',
      'Error-tolerant parsing that quarantines corrupt records and reports them, instead of failing the run',
      'Per-file decoding is parallelized with ProcessPoolExecutor',
    ],
    results: [
      { value: '5/5', label: 'binary archives decoded' },
      { value: '≥95%', label: 'field accuracy' },
      { value: '7', label: 'SAP field types handled, including PACKED/BCD' },
      { value: '36 hours', label: 'from start to submission' },
    ],
    next: ['TODO_NEXT_STEPS'],
    links: {
      repo: 'https://github.com/Britjit/hackathon',
      writeup: 'https://devpost.com/software/knighthacks-sap-decryption-project-fresh',
    },
  },
  {
    slug: 'passionfruit',
    drink: 'Local Roast',
    name: 'Passionfruit',
    tastingNote: 'Crowdfunding platform for discovering and investing in local businesses',
    teamNote: 'Built the backend, on a 4-person team at SwampHacks XI',
    stack: ['FastAPI', 'Python', 'Next.js 14', 'TypeScript', 'Zustand', 'Mapbox', 'Gemini API'],
    headlineMetrics: [],
    problem:
      'Running a local business means constant pressure from wages, rent, supplies, and taxes. Passionfruit lets a community back the businesses it cares about: people browse local postings on a dashboard or an interactive map, see why each one needs funding along with its financials and progress, and invest. Owners create postings through a questionnaire.',
    architecture:
      'A Next.js 14 front end in TypeScript, with Zustand for state and a Mapbox map that geocodes business addresses and pins them. It makes REST calls to a FastAPI backend with endpoints for businesses, investments, and analytics. The backend processes each investment, updates funding, runs analytics on request, and persists state to JSON files.',
    diagram: {
      src: '/diagrams/passionfruit.svg',
      alt: 'Passionfruit architecture: a Next.js front end with a Mapbox map calls a FastAPI backend over REST, which persists to JSON files and uses the Gemini API for risk analysis',
      width: 960,
      height: 198,
    },
    decisions: [
      'The backend owns the money flow end to end: it processes the investment and updates the stored funding state, and the front end only reads the result',
      'JSON file persistence instead of a database, which was enough for a hackathon build',
      'A sandbox banking API was planned for mock accounts but did not fit, so the investment flow runs through the backend instead',
    ],
    results: [],
    next: [
      'Stricter verification before a business can list, to prevent fraudulent postings',
      'Mobile app for iOS and Android',
      'Real-time investment tracking, and the ability to sell an investment early',
    ],
    links: {
      repo: 'https://github.com/devamdholakia/KnightVision',
      writeup: 'https://devpost.com/software/passionfruit-moaw07',
    },
  },
  {
    slug: 'studyapp',
    drink: 'Study Hall Latte',
    name: 'StudyApp',
    tastingNote: 'Two-person study rooms with video and a shared Pomodoro timer',
    stack: ['React', 'Vite', 'WebRTC', 'WebSockets', 'Cloudflare Durable Objects', 'Node.js'],
    headlineMetrics: [],
    problem:
      'Studying with a friend remotely works better when both people are on the same clock. StudyApp pairs two people in a room with camera and mic, a shared 25/5 Pomodoro timer, and a points tally.',
    architecture:
      'A React client connects to a room over WebSocket. The room server relays WebRTC signaling between the two peers and owns the timer and scores. There are two room backends: a Node.js WebSocket server, and a Cloudflare Worker where each room is a Durable Object.',
    diagram: {
      src: '/diagrams/studyapp.svg',
      alt: 'StudyApp architecture: two React clients exchange WebRTC signaling through a room server that owns the timer and points, running as a Node.js server or a Cloudflare Durable Object',
      width: 960,
      height: 284,
    },
    decisions: [
      'The timer is owned by the room, not the clients. The server stores the phase and its end time and broadcasts room state, so both peers see the same clock',
      'Each room is a Durable Object that persists the timer and points to storage, so room state survives the object being evicted',
      'Rooms are capped at two participants, which keeps the WebRTC connection a single peer-to-peer link',
    ],
    results: [],
    next: ['TODO_NEXT_STEPS'],
    links: { repo: 'https://github.com/devamdholakia/StudyApp' },
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
