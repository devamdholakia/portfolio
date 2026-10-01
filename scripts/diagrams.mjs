// generates the architecture diagrams in /public/diagrams
// run with: npm run diagrams
import { mkdirSync, writeFileSync } from 'node:fs'

const OUT = new URL('../public/diagrams/', import.meta.url)
const W = 960
const ROW = 86
const H = 64
const TOP = 24

// palette matches the site tokens, fixed because an <img> SVG cannot read page CSS
const C = {
  paper: '#FBF8F1',
  box: '#F6EFE4',
  store: '#E6D5BF',
  ink: '#3B2A20',
  soft: '#6B4A3A',
  accent: '#7A4A1E',
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function wrap(text, maxChars) {
  const lines = ['']
  for (const word of text.split(' ')) {
    const last = lines[lines.length - 1]
    if (last && (last + ' ' + word).length > maxChars) lines.push(word)
    else lines[lines.length - 1] = last ? `${last} ${word}` : word
  }
  return lines
}

// three-column hub layout: things on the left, the service in the middle, dependencies on the right
const col = { left: { x: 30, w: 200 }, center: { x: 345, w: 270 }, right: { x: 730, w: 200 } }
const y = (row) => TOP + row * ROW
const at = (side, row, node) => ({ ...col[side], y: y(row), h: H, ...node })
const tall = (fromRow, toRow, node) => ({
  ...col.center,
  y: y(fromRow),
  h: y(toRow) + H - y(fromRow),
  ...node,
})

function drawNode(n) {
  const fill = n.kind === 'store' ? C.store : n.kind === 'ghost' ? 'none' : C.box
  const dash = n.kind === 'ghost' ? ' stroke-dasharray="6 5"' : ''
  let out = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8" fill="${fill}" stroke="${C.ink}" stroke-width="1.5"${dash}/>`
  if (n.lines) {
    // tall box: title on top, then a list of responsibilities
    out += `<text x="${n.x + n.w / 2}" y="${n.y + 26}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.ink}">${esc(n.title)}</text>`
    if (n.sub)
      out += `<text x="${n.x + n.w / 2}" y="${n.y + 43}" text-anchor="middle" font-size="11" font-family="ui-monospace, Consolas, monospace" fill="${C.soft}">${esc(n.sub)}</text>`
    const start = n.y + (n.sub ? 70 : 58)
    const step = Math.min(30, (n.h - (start - n.y) - 8) / n.lines.length)
    n.lines.forEach((line, i) => {
      const ly = start + i * step
      out += `<circle cx="${n.x + 18}" cy="${ly - 4}" r="2.5" fill="${C.accent}"/>`
      out += `<text x="${n.x + 28}" y="${ly}" font-size="12" fill="${C.ink}">${esc(line)}</text>`
    })
    return out
  }
  const subs = n.sub ? wrap(n.sub, Math.floor((n.w - 16) / 6.4)) : []
  const titleY = n.y + (subs.length === 0 ? n.h / 2 + 5 : subs.length === 1 ? 28 : 22)
  out += `<text x="${n.x + n.w / 2}" y="${titleY}" text-anchor="middle" font-size="14" font-weight="700" fill="${C.ink}">${esc(n.title)}</text>`
  subs.slice(0, 2).forEach((line, i) => {
    out += `<text x="${n.x + n.w / 2}" y="${titleY + 16 + i * 13}" text-anchor="middle" font-size="10.5" font-family="ui-monospace, Consolas, monospace" fill="${C.soft}">${esc(line)}</text>`
  })
  return out
}

// straight arrows: horizontal when the boxes share a vertical range, vertical when they share a horizontal one
function drawEdge(e, nodes) {
  const a = nodes[e.from]
  const b = nodes[e.to]
  const overlap = (a0, a1, b0, b1) => (Math.min(a1, b1) > Math.max(a0, b0) ? (Math.min(a1, b1) + Math.max(a0, b0)) / 2 : null)
  const oy = overlap(a.y, a.y + a.h, b.y, b.y + b.h)
  const ox = overlap(a.x, a.x + a.w, b.x, b.x + b.w)
  let x1, y1, x2, y2
  if (oy !== null) {
    const ltr = a.x < b.x
    x1 = ltr ? a.x + a.w : a.x
    x2 = ltr ? b.x : b.x + b.w
    y1 = y2 = oy
  } else if (ox !== null) {
    const down = a.y < b.y
    y1 = down ? a.y + a.h : a.y
    y2 = down ? b.y : b.y + b.h
    x1 = x2 = ox
  } else {
    x1 = a.x + a.w / 2
    y1 = a.y + a.h / 2
    x2 = b.x + b.w / 2
    y2 = b.y + b.h / 2
  }
  // leave room for the arrowheads
  const len = Math.hypot(x2 - x1, y2 - y1)
  const ux = (x2 - x1) / len
  const uy = (y2 - y1) / len
  const sx = x1 + (e.both ? ux * 3 : 0)
  const sy = y1 + (e.both ? uy * 3 : 0)
  const ex = x2 - ux * 3
  const ey = y2 - uy * 3
  const dash = e.dashed ? ' stroke-dasharray="5 4"' : ''
  let out = `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${C.soft}" stroke-width="1.5"${dash} marker-end="url(#arrow)"${e.both ? ' marker-start="url(#arrow-start)"' : ''}/>`
  if (e.label) {
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const w = e.label.length * 6.1 + 10
    const horizontal = oy !== null
    const lx = horizontal ? mx : mx + w / 2 + 6
    const ly = horizontal ? my - 9 : my + 4
    out += `<rect x="${lx - w / 2}" y="${ly - 11}" width="${w}" height="15" rx="3" fill="${C.paper}"/>`
    out += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.accent}">${esc(e.label)}</text>`
  }
  return out
}

function render({ title, desc, nodes, edges, groups = [] }) {
  const height = Math.max(...Object.values(nodes).map((n) => n.y + n.h), ...groups.map((g) => g.y + g.h)) + TOP
  const body = [
    ...groups.map(
      (g) =>
        `<rect x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="10" fill="none" stroke="${C.soft}" stroke-dasharray="6 5"/>` +
        `<text x="${g.x + 12}" y="${g.y + g.h - 10}" font-size="11" font-weight="600" fill="${C.soft}">${esc(g.label)}</text>`,
    ),
    ...edges.map((e) => drawEdge(e, nodes)),
    ...Object.values(nodes).map(drawNode),
  ].join('\n  ')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif">
  <title>${esc(title)}</title>
  <desc>${esc(desc)}</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${C.soft}"/></marker>
    <marker id="arrow-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 0L0 5L10 10z" fill="${C.soft}"/></marker>
  </defs>
  <rect width="${W}" height="${height}" fill="${C.paper}"/>
  ${body}
</svg>
`
  return { svg, height }
}

const diagrams = {
  paradise: {
    title: 'Paradise architecture',
    desc: 'A chest phone, a second phone, and a spoken request feed a laptop coordinator, which drives two wrist controllers and uses Gemini, sidewalk routing, and a live dashboard.',
    nodes: {
      phone: at('left', 0, { title: 'Chest phone', sub: 'camera, on-device YOLO' }),
      car: at('left', 1, { title: 'Second phone', sub: 'stands in for the car' }),
      ask: at('left', 2, { title: 'Wearer request', sub: 'spoken command' }),
      hub: tall(0, 3, {
        title: 'Laptop coordinator',
        sub: 'Node.js',
        lines: [
          'Object finder: YOLO, 3 of 5 frames',
          'Car classifier: CLIP features',
          'Depth model: obstacle layer',
          'Distance from known object size',
          'Guidance: left, right, forward, stop',
        ],
      }),
      wrists: at('right', 0, { title: 'Wrist controllers', sub: 'left and right haptics' }),
      gemini: at('right', 1, { title: 'Gemini API', sub: 'request to object, arrival photo check', kind: 'store' }),
      route: at('right', 2, { title: 'Sidewalk routing', sub: 'OSRM on OpenStreetMap', kind: 'store' }),
      dash: at('right', 3, { title: 'Live dashboard', sub: 'feed, detections, signal' }),
    },
    edges: [
      { from: 'phone', to: 'hub', label: 'WebRTC video' },
      { from: 'car', to: 'hub', label: 'GPS location' },
      { from: 'ask', to: 'hub', label: 'speech' },
      { from: 'hub', to: 'wrists', label: 'WebHID buzz' },
      { from: 'hub', to: 'gemini', label: 'photo check', both: true },
      { from: 'hub', to: 'route', label: 'route', both: true },
      { from: 'hub', to: 'dash', label: 'WebSocket' },
    ],
  },

  uknight: {
    title: 'uKnight architecture',
    desc: 'Two student browsers signal through a Spring Boot service on Cloud Run, backed by Redis, PostgreSQL, and Firestore, while media flows peer to peer over WebRTC with a TURN relay fallback.',
    nodes: {
      a: at('left', 0, { title: 'Student A', sub: 'Next.js client on Vercel' }),
      media: at('left', 1, { title: 'WebRTC media', sub: 'peer to peer, TURN relay fallback', kind: 'ghost' }),
      b: at('left', 2, { title: 'Student B', sub: 'Next.js client on Vercel' }),
      hub: tall(0, 2, {
        title: 'Spring Boot service',
        sub: 'Docker on GCP Cloud Run',
        lines: [
          '.edu email verification',
          'STOMP signaling over WebSocket',
          'Matchmaking and skip / requeue',
          'Stateless: any instance can serve',
        ],
      }),
      redis: at('right', 0, { title: 'Redis', sub: 'queue (ZSET + Lua), sessions, online count', kind: 'store' }),
      pg: at('right', 1, { title: 'PostgreSQL', sub: 'accounts and profiles', kind: 'store' }),
      fs: at('right', 2, { title: 'Firestore', sub: 'verification codes', kind: 'store' }),
    },
    edges: [
      { from: 'a', to: 'hub', label: 'STOMP / WS', both: true },
      { from: 'b', to: 'hub', label: 'STOMP / WS', both: true },
      { from: 'a', to: 'media', both: true },
      { from: 'media', to: 'b', both: true },
      { from: 'hub', to: 'redis', label: 'atomic match', both: true },
      { from: 'hub', to: 'pg', label: 'persist', both: true },
      { from: 'hub', to: 'fs', label: 'OTP', both: true },
    ],
  },

  apex: {
    title: 'Apex architecture',
    desc: 'A steward console sends an event over WebSocket to a FastAPI server, which runs a Ridge and XGBoost lap-time model and a Monte Carlo engine, then streams results to the pit wall dashboard.',
    nodes: {
      steward: at('left', 0, { title: 'Steward console', sub: 'triggers rain, safety car' }),
      wall: at('left', 2, { title: 'Pit wall dashboard', sub: 'Next.js, live timing' }),
      hub: tall(0, 2, {
        title: 'FastAPI server',
        sub: 'WebSocket endpoint',
        lines: [
          '1. Ridge: circuit base pace',
          '2. XGBoost: per-lap residual',
          '3. NumPy Monte Carlo: 10,000 sims',
          '4. Recommendation + win probability',
        ],
      }),
      models: at('right', 0, { title: 'Trained models', sub: 'Ridge + XGBoost artifacts', kind: 'store' }),
      data: at('right', 1, { title: 'Historical laps', sub: '10,244 laps, used for training', kind: 'store' }),
      llm: at('right', 2, { title: 'Language model', sub: 'formats the radio call, no math', kind: 'store' }),
    },
    edges: [
      { from: 'steward', to: 'hub', label: 'WS event' },
      { from: 'hub', to: 'wall', label: 'WS results' },
      { from: 'models', to: 'hub', label: 'load' },
      { from: 'data', to: 'models', label: 'train', dashed: true },
      { from: 'hub', to: 'llm', label: 'radio call', both: true },
    ],
  },

  webhookd: {
    title: 'Webhookd architecture',
    desc: 'A producer posts events to webhookd, which stores delivery state in DynamoDB, queues references on SQS, delivers signed requests to subscribers, dead-letters exhausted deliveries, and exposes metrics to Prometheus.',
    nodes: {
      producer: at('left', 0, { title: 'Producer', sub: 'POST /v1/events' }),
      sub: at('left', 2, { title: 'Subscriber endpoint', sub: 'verifies HMAC signature' }),
      prom: at('left', 3, { title: 'Prometheus', sub: 'deliveries, latency, queue depth', kind: 'store' }),
      hub: tall(0, 3, {
        title: 'webhookd',
        sub: 'Spring Boot 3, Java 21',
        lines: [
          'Ingest: idempotency key, fan-out',
          'Write PENDING state, then enqueue',
          'Worker: breaker check, signed POST',
          'Retry: full-jitter backoff, 7 attempts',
          'Sweeper: re-enqueue orphans, 30s',
        ],
      }),
      ddb: at('right', 0, { title: 'DynamoDB', sub: 'deliveries, idempotency, subscriptions, health', kind: 'store' }),
      sqs: at('right', 1, { title: 'SQS work queue', sub: 'carries {deliveryId} references', kind: 'store' }),
      dlq: at('right', 2, { title: 'Dead-letter queue', sub: 'exhausted or non-retryable', kind: 'store' }),
    },
    edges: [
      { from: 'producer', to: 'hub', label: 'HTTP' },
      { from: 'hub', to: 'sub', label: 'signed POST' },
      { from: 'prom', to: 'hub', label: 'scrape' },
      { from: 'hub', to: 'ddb', label: 'state', both: true },
      { from: 'hub', to: 'sqs', label: 'enqueue / poll', both: true },
      { from: 'hub', to: 'dlq', label: 'dead-letter' },
    ],
  },

  'sap-archive-decoder': {
    title: 'SAP Archive Decoder pipeline',
    desc: 'Binary SAP archives are fingerprinted, decompressed, parsed against a schema, and validated in parallel workers, then exported to CSV and JSON, with corrupt records quarantined and reported.',
    nodes: {
      input: { x: 30, y: y(0), w: 190, h: H, title: 'Binary SAP archives', sub: '5 files, mixed compression', kind: 'store' },
      detect: { x: 275, y: y(0), w: 190, h: H, title: 'Fingerprint', sub: 'gzip, lz4, or zstandard framing' },
      unzip: { x: 510, y: y(0), w: 190, h: H, title: 'Decompress', sub: 'matching codec' },
      parse: { x: 745, y: y(0), w: 190, h: H, title: 'Schema-driven parser', sub: '7 field types, PACKED/BCD' },
      check: { x: 745, y: y(1) + 14, w: 190, h: H, title: 'Per-field validators', sub: 'type and length checks' },
      bad: { x: 510, y: y(1) + 14, w: 190, h: H, title: 'Quarantine', sub: 'corrupt records, reported' },
      out: { x: 745, y: y(2) + 44, w: 190, h: H, title: 'CSV / JSON export', sub: 'value, type, byte length', kind: 'store' },
    },
    groups: [{ x: 257, y: y(0) - 14, w: 696, h: ROW * 2 + 28, label: 'ProcessPoolExecutor: one worker per file' }],
    edges: [
      { from: 'input', to: 'detect' },
      { from: 'detect', to: 'unzip' },
      { from: 'unzip', to: 'parse' },
      { from: 'parse', to: 'check' },
      { from: 'check', to: 'bad', label: 'bad' },
      { from: 'check', to: 'out', label: 'valid' },
    ],
  },

  passionfruit: {
    title: 'Passionfruit architecture',
    desc: 'A Next.js front end with a Mapbox map calls a FastAPI backend over REST. The backend processes investments, persists to JSON files, and uses the Gemini API for risk analysis.',
    nodes: {
      web: at('left', 0, { title: 'Next.js front end', sub: 'Zustand state, NextAuth sign-in' }),
      map: at('left', 1, { title: 'Mapbox map', sub: 'geocoded business pins', kind: 'store' }),
      hub: tall(0, 1, {
        title: 'FastAPI backend',
        lines: [
          'Businesses and postings',
          'Investments: process, update funding',
          'Analytics on request',
        ],
      }),
      json: at('right', 0, { title: 'JSON file store', sub: 'businesses, investments', kind: 'store' }),
      gemini: at('right', 1, { title: 'Gemini API', sub: 'risk analysis for postings', kind: 'store' }),
    },
    edges: [
      { from: 'web', to: 'hub', label: 'REST', both: true },
      { from: 'web', to: 'map', label: 'pins' },
      { from: 'hub', to: 'json', label: 'read / write', both: true },
      { from: 'hub', to: 'gemini', label: 'analyze', both: true },
    ],
  },

  studyapp: {
    title: 'StudyApp architecture',
    desc: 'Two React clients exchange WebRTC signaling through a room server that owns the Pomodoro timer and points. The room server runs either as a Node.js WebSocket server or as a Cloudflare Durable Object with persistent storage.',
    nodes: {
      a: at('left', 0, { title: 'Peer A', sub: 'React client' }),
      media: at('left', 1, { title: 'WebRTC media', sub: 'camera and mic, peer to peer', kind: 'ghost' }),
      b: at('left', 2, { title: 'Peer B', sub: 'React client' }),
      hub: tall(0, 2, {
        title: 'Room server',
        sub: 'one room, two peers',
        lines: [
          'Relays WebRTC signaling',
          'Owns Pomodoro phase and end time',
          'Tracks points per participant',
          'Broadcasts room state',
        ],
      }),
      node: at('right', 0, { title: 'Node.js ws server', sub: 'backend 1: rooms in memory' }),
      durable: at('right', 1, { title: 'Durable Object', sub: 'backend 2: Cloudflare Worker, one per room' }),
      storage: at('right', 2, { title: 'Durable storage', sub: 'timer and points', kind: 'store' }),
    },
    edges: [
      { from: 'a', to: 'hub', label: 'WebSocket', both: true },
      { from: 'b', to: 'hub', label: 'WebSocket', both: true },
      { from: 'a', to: 'media', both: true },
      { from: 'media', to: 'b', both: true },
      { from: 'hub', to: 'node', label: 'runs as', dashed: true },
      { from: 'hub', to: 'durable', label: 'runs as', dashed: true },
      { from: 'durable', to: 'storage', label: 'persist' },
    ],
  },
}

mkdirSync(OUT, { recursive: true })
for (const [slug, spec] of Object.entries(diagrams)) {
  const { svg, height } = render(spec)
  writeFileSync(new URL(`${slug}.svg`, OUT), svg)
  console.log(`${slug}.svg ${W}x${height}`)
}
