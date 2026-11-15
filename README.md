# Adhil Shanif — Portfolio

Portfolio of Adhil Shanif, based in Dubai. He builds complete software products end to end: web apps, backends, APIs, integrations and AI features, from design and build through security and deploy.

**Live:** [adhilshanif.vercel.app](https://adhilshanif.vercel.app)

## Tech stack

- **Framework:** Next.js (App Router, React 19), statically rendered
- **Styling:** Tailwind CSS v4 with section-level light and dark tokens (`src/app/globals.css`)
- **Type:** DM Sans and DM Mono via `next/font`
- **Interaction:** CSS 3D transforms and small client components, no animation library on the homepage
- **Deployment:** Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Project structure

```
src/
├── app/            # Routes: /, /services, /brief, /privacy, /partners, robots, sitemap, OG image
├── components/     # Sections (Hero, Agencies, WhatIBuild, Work, HowIWork, About, Contact) and interactive pieces
├── data/           # projects, client work, services (single source for page copy and JSON-LD)
└── lib/            # site constants, schema.org graph, brief validation
```

## Search

See [`docs/search-visibility.md`](docs/search-visibility.md) for robots, sitemap, structured data, verification and measurement.

## Checks

```bash
npm run lint
npm run build
npm run test:menu   # needs a running server and CHROME_PATH
```
