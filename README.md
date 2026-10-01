# Dev's Daily Grind

Personal portfolio for Devam (Dev) Dholakia, themed as a neighborhood café menu. Built with Next.js (App Router, static export), TypeScript, Tailwind CSS, and Framer Motion.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to /out
npm run preview    # serve /out locally
npm run typecheck
```

Requires Node 20 or newer.

## Editing content

All copy lives in `/content`. You should not need to touch a component to update the site.

| File | What it holds |
|---|---|
| `content/site.ts` | Café name (`CAFE_NAME`), tagline, availability sign, bio, quick facts, links, photo, site URL |
| `content/projects.ts` | Menu items and the full case study for each project page |
| `content/experience.ts` | Journal timeline and the Daily Specials cards |
| `content/skills.ts` | One jar per skill category |
| `content/awards.ts` | Awards wall |

### Placeholders

Any value that starts with `TODO_` shows up on the site as a dashed chip, so nothing unfinished can hide. Search the repo for `TODO` to find what is left:

- `site.url`: the production domain (used by the sitemap, canonical links, and Open Graph)
- `site.links.email` and `site.links.linkedin`. The contact form stays disabled until the email is set
- Apex, Paradise, and uKnight repo links
- Paradise stack, uKnight description
- Problem, architecture, and decisions for Paradise and uKnight
- "What I'd Brew Next" for every project

### Files to add

- `public/resume.pdf`: the Download PDF buttons point here and will 404 until it exists
- `public/diagrams/<name>.svg`: then set `diagram: { src, alt, width, height }` on the project. Without it the page shows a placeholder box
- A photo in `/public`, then set `site.photo`
- `public/og-image.png` is the social preview (1200x630). Replace it if the café name or tagline changes

### Adding a project

Add an object to the `projects` array in `content/projects.ts`. The menu card, the `/menu/[slug]` page, Recruiter Mode, the receipt, and the sitemap all pick it up.

## How it works

- **Routes:** `/` (home), `/menu/[slug]` (project case study), `/receipt` (résumé), `/credits`, plus a 404
- **Recruiter Mode ("Skip the Line"):** the home page ships both views in its HTML. `<html data-mode="plain">` picks one with CSS, and the choice is kept in `?mode=plain` so the link can be shared. See `lib/mode.ts`
- **Night Shift:** follows `prefers-color-scheme` until the toggle is used, then remembers the choice in `localStorage`
- **Design tokens:** the palette and fonts are CSS variables in `app/globals.css`, exposed to Tailwind through `@theme`. Dark mode and Recruiter Mode only swap variables
- **Contact form:** opens the visitor's mail app through a `mailto:` link. To use a form service instead, replace `placeOrder` in `components/OrderTicket.tsx`
- **Motion:** steam and card lift are CSS, section fade-in uses Framer Motion. Everything respects `prefers-reduced-motion`

### Contrast notes

The spec caramel (`#C68A4E`) is about 2.6:1 on cream, which fails AA for text. It is used for button fills and accents only. Text and links use `--caramel-ink` (`#7A4A1E`) on light backgrounds and `--caramel-chalk` (`#E0AC76`) on the chalkboard.

## Deploy (Vercel)

1. Push this folder to a GitHub repo
2. Import the repo in Vercel. The Next.js preset works as is, no environment variables needed
3. Set `site.url` in `content/site.ts` to the final domain and redeploy

The build is a static export (`output: 'export'` in `next.config.ts`), so the `/out` folder can also be hosted on any static host.

## Credits

See [CREDITS.md](CREDITS.md).
