# Implementation Plan — Mamun Reja Portfolio

## Product and implementation approach

Build the actual portfolio as a server-rendered Next.js App Router website in TypeScript, with React Three Fiber, Three.js and Drei for a lightweight procedural hero orb, Framer Motion for restrained motion, Tailwind CSS for responsive design tokens/layout, and Lucide icons. Use the user's supplied portrait as the one source image throughout; preserve the original in `public/images/`, create a high-quality WebP derivative, and use a reusable responsive `ProfileImage` component. Keep the app as a single indexable route with semantic section anchors and a custom not-found page. Server rendering supplies the portfolio's real public copy in initial HTML; client components are limited to 3D, navigation state, interactivity, charts, chat and the terminal. A small server API supplies cached public GitHub data and the contact endpoint. Do not enable a database or expose service credentials in client bundles.

Use the official unauthenticated GitHub public REST API for account/repository activity; cache and expose only public fields, with honest loading/error/rate-limit fallbacks. Show a contribution graph only through its public chart endpoint and fall back to a link to GitHub if unavailable. Do not fabricate LeetCode information; mark it as awaiting a username. Mamun AI is a deterministic local portfolio-information assistant, not an LLM. Contact submissions validate on both sides and are sent only if server-side email delivery configuration is later supplied; until then, the form reports that delivery is not configured, never that it was sent. Use the supplied LinkedIn URL and email. Resume, LeetCode username, vehicle-analysis repo and availability remain unset/configurable.

## Design

- **Design Movement:** Premium dark AI research lab fused with restrained cyber-terminal detailing and asymmetric bento editorial layouts.
- **Core Principles:** Make real portfolio information primary; balance immersive depth with legible calm; keep every interaction useful; be explicit about unknown/unconfigured facts.
- **Color Philosophy:** Carbon-black and deep forest surfaces imply a quiet research space. A singular emerald signal carries the Mamun identity; violet is a rare secondary spectral accent. Soft off-white and desaturated sage keep long-form content readable without excessive neon.
- **Layout Paradigm:** An editorial, asymmetric sequence of full-bleed hero, narrow section introductions and offset bento panels/cards; on mobile it becomes a simple vertical narrative, never a squeezed dashboard.
- **Signature Elements:** A procedural neural-orb/particle field; fine emerald instrument-rule lines and small uppercase mono telemetry labels; restrained violet glints as secondary data signals.
- **Interaction Philosophy:** Pointer response adds gentle depth but never gates information. Keyboard, touch, reduced-motion and WebGL fallback paths remain complete. Terminal commands and assistant replies describe only actual portfolio information.
- **Animation:** Short, low-amplitude entry/hover motion; slow orbital movement and pointer easing in the hero; reveal-on-scroll only when motion is allowed; reduced/no ambient and parallax animation for `prefers-reduced-motion` and compact devices.
- **Typography System:** Geometric display sans (Space Grotesk), Inter-like body (Inter), and JetBrains Mono for UI telemetry/terminal. Editorial headline scale with comfortable line length and responsive sizing.
- **Brand Essence:** A curious early-career AI/ML builder sharing experiments and learning in a private-feeling research lab; **curious, precise, evolving**.
- **Brand Voice:** Direct, thoughtful and evidence-led. Examples: “Building Intelligence. Creating Impact.” and “Curiosity drives the next experiment.”
- **Wordmark & Logo:** Custom `MR` neural-loop monogram rendered as an emerald line mark; not a default-typeface-only logo.
- **Signature Brand Color:** Research Emerald `#00F5A0`, applied as an intentional signal rather than a blanket glow.

## Scoped hero redesign — Premium Split Gradient

This iteration changes only `components/hero.tsx` and the hero-specific rules in `app/globals.css`, plus the exact hero copy in `config/portfolio.ts`. Preserve the existing navigation, routes, all other sections and their styling, project behavior, and previously supplied portrait. Use a 55/45 desktop split: readable exact introduction on the left and a large softly rounded upper-body portrait on the right. Retain the black/emerald/electric-purple palette and typography; simplify the current neural scene into a restrained background accent behind the image, never obscuring the face. Keep motion lightweight, pointer effects subtle, and respect reduced motion. At narrow widths stack the introduction before the large portrait and retain touch-sized working project/contact links. Use the exact supplied greeting, designation, exploration label and introduction from the latest brief. Show only supported details: four project cards in view (one marked in progress), AI/ML focus, and continuous learning; omit the unsupported internship claim and do not relabel work as experience. No new dependencies or changes to non-hero sections.

## Main sections and behavior

1. Floating glass navigation with Home/About/Skills/Projects/Journey/Lab/Contact anchors, active-section state, responsive menu and unasserted configurable availability indicator.
2. Full-height hero with requested headline/copy/working navigation CTAs, a right-side framed crop of the supplied portrait, and a separate lazy, fallback-capable 3D orb; do not add a fake resume download. For the current scoped redesign, apply the 55/45 split-gradient composition and only the latest user-specified hero copy; keep all non-hero UI unchanged.
3. About and skills bento sections containing the user-supplied introduction, learning interests, philosophy and complete skill lists without invented biography or proficiency levels; the profile card reuses the portrait and displays the supplied name/title.
4. Four featured project cards. Link only the two supplied repositories, show the verified car-price R² only on that project, leave the emissions repo unset, and label mobile-price as in progress.
5. Live GitHub open-source/activity section and explicitly unconfigured LeetCode dashboard.
6. Learning timeline with the eight supplied milestones, no invented dates/completion percentages.
7. Portfolio-only terminal with the specified commands; safe unknown-command responses and a clear action.
8. Floating Mamun AI panel with predefined information from the portfolio and no claim of live model connectivity; use the portrait as its small creator avatar while keeping the AI orb separate.
9. Contact section and validated form with a real error state until secure email delivery is configured.
10. SEO metadata, Open Graph metadata only with an actual configured public origin, favicon, sitemap/robots, custom loading state, and a custom not-found page.

## Data, APIs, privacy, and infrastructure

- Public GitHub route: `app/api/github/route.ts`; unauthenticated GitHub API, server-side normalization, caching/revalidation and partial-data fallbacks.
- Contact route: `app/api/contact/route.ts`; server-side schema validation, basic abuse protections and server-only provider configuration. The endpoint must fail honestly if delivery is not configured.
- Site origin: read `NEXT_PUBLIC_SITE_URL` only when explicitly configured. Until then omit guessed canonical/`og:url` tags and return no guessed sitemap host.
- Container deployment: the production build copies `/public` and `.next/static` into `.next/standalone`; Dockerfile serves that self-contained Next server on `PORT` (default 3000), with an unauthenticated health route. Secrets are runtime-only.
- Dependencies are pinned via `packageManager: pnpm@11.25.0`, committed lockfile and explicit reviewed pnpm 11 lifecycle policy.

## Project structure

```text
app/
  api/contact/route.ts        validated, server-only contact submission
  api/github/route.ts         cached public GitHub data
  api/health/route.ts         unauthenticated deployment health
  globals.css                 reset, design tokens, layout and responsive component styles
  layout.tsx                  fonts, metadata and shared shell
  not-found.tsx               branded accessible 404
  page.tsx                    server-rendered home page and section composition
  sitemap.ts / robots.ts      origin-aware SEO documents
components/
  assistant.tsx               floating deterministic Mamun AI helper
  contact-form.tsx             validated contact UI
  github-panel.tsx              live GitHub metrics, events and contribution fallback
  hero.tsx / hero-scene.tsx     responsive hero and lazy R3F neural orb
  profile-image.tsx             shared responsive image component and alt text
  portfolio-sections.tsx       about, skills, projects, GitHub, LeetCode, journey, contact
  project-tilt.tsx              mouse-only project-card tilt
  site-nav.tsx / terminal.tsx   navigation, scroll reveals and portfolio command terminal
config/portfolio.ts            identity, configurable missing details, project and skill content
public/images/                  preserved original portrait and optimized WebP derivative
public/                         favicon, logo, Open Graph art and /manus-routes.json
Dockerfile                      multi-stage standalone production server image
app.config.ts                   platform project-logo metadata
plan.md, TODO.md                implementation plan and full feature criteria
```

## Material constraints and assumptions

The user supplied a public LinkedIn URL and email; the site displays those values. The user supplied the exact official portrait image; do not generate, substitute, or alter their face. Keep the original file unchanged and use only quality-preserving format conversion for responsive web delivery. No real resume, LeetCode username, vehicle-analysis repository URL, delivery provider credentials or explicit availability status is supplied. Those remain visibly unconfigured; no success claim for unconfigured email delivery. GitHub contributions are not available through the public REST repository endpoint, so the graph has an honest unavailable fallback. Do not infer a canonical domain before one is configured. Build for a small-screen-first layout and keep the hero scene lightweight and nonessential to content access.
