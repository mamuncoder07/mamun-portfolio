# Mamun Reja portfolio

A server-rendered Next.js portfolio with an interactive Three.js/R3F research-orb, public GitHub activity panel, keyboard-accessible portfolio terminal, deterministic Mamun AI helper, and responsive sections.

## Run locally

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm typecheck` checks TypeScript; `pnpm build` creates the production build. The app listens on port 3000 and honors `PORT` in its production container.

## Personalize only with verified details

The supplied LinkedIn profile and public email are configured in `config/portfolio.ts`. The LeetCode profile is configured as `CodewithMamun`; public statistics are fetched server-side from the unofficial Alfa LeetCode API and cached for 15 minutes. Update the same file if these details change, or when the owner supplies a resume file URL, vehicle-emissions repository URL or an explicit availability label. Keep any unset value blank; the UI then labels it as not configured. No résumé is shipped by default. The GitHub identity and two supplied repository links are already configured.

Set `NEXT_PUBLIC_SITE_URL` only after a real public origin is selected; this enables absolute canonical, Open Graph image and sitemap URLs. Until then, guessed canonical origins are omitted.

The contact form validates in the browser and server. Email delivery stays disabled until the server-only values `RESEND_API_KEY`, `CONTACT_EMAIL`, and `CONTACT_FROM_EMAIL` are configured through the managed environment/secrets interface. Keep these values out of browser code and committed files. Without them the endpoint responds with an explicit “delivery is not configured” message; it does not store form content or claim to have sent it.

The Mamun AI widget is a local, deterministic information helper, not a connected language model. GitHub figures come from the public GitHub API; the contribution graph is a separate public chart service with a fallback link.

Technology logos are local SVG marks sourced from [Devicon](https://github.com/devicons/devicon) (MIT license; see `public/brand-logos/LICENSE-devicon.txt`) and [Simple Icons](https://github.com/simple-icons/simple-icons) for Linux. Brand marks remain the property of their respective owners and are shown only to identify the technologies and services used.

Mamun AI's green mascot uses the MIT-licensed `@bible-strong/avatar-react` and `@bible-strong/avatar-core` 1.0.1 runtime packages. Its animation state reflects the local assistant's actual interaction and answer events; the Lab exposes the runtime's supported states and gestures alongside the existing terminal.

The Certificates section metadata is maintained in `config/certificates.ts`. Keep the original certificate PDFs in the project root and copy each listed file, with its exact filename, into `public/certificates/` so it can be previewed and downloaded. Issuers and completion dates are omitted unless verified.
