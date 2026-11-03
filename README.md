# Kalkidan Yishak Zerihun · Portfolio

A static portfolio for Kalkidan Yishak Zerihun, a fullstack developer based in Addis Ababa. Built with Astro and no runtime dependencies, so it deploys cleanly to Cloudflare Pages.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Astro prints. To check the production build:

```bash
npm run build
npm run preview
npm run check
```

## Deploy to Cloudflare Pages

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 20.3+ or 22+ (the project is pinned to Astro 5 for broad Node compatibility)

The canonical URL and sitemap use `https://resume-aby.pages.dev` by default. Set the `SITE_URL` environment variable in Cloudflare if the final domain changes, then rebuild.

## Content and structure

- `src/data/site.ts`: identity, contact, social links
- `src/data/projects.ts`: selected work and explorations
- `src/data/services.ts`: service offers and working principles
- `src/data/resume.ts`: credentials used on both the homepage and the résumé
- `src/pages/index.astro`: homepage
- `src/pages/resume.astro`: accessible, print-friendly résumé
- `src/styles/global.css`: design tokens, material system and shared foundations
- `src/scripts/motion.ts`: the single scroll/interaction engine
- `public/images/`: optimized WebP project captures and generated surface layers
- `public/fonts/`: self-hosted Fraunces, Instrument Sans and Spline Sans Mono (Latin subsets)
- `public/og/og-image.jpg`: social preview card

## Design system

The site uses one warm monochrome surface, a single accent, and soft neumorphic depth. Raised surfaces are reserved for cards and controls; recessed surfaces are reserved for readouts, wells and pressed states. Fraunces handles display type, Instrument Sans carries the reading text, and Spline Sans Mono sets the technical labels and metadata. Every motion path respects `prefers-reduced-motion`, and the layout remains readable without JavaScript.

The page ground is a layered drafting-sheet pattern rather than a flat fill: a fine dot lattice, a 112px rule grid, a warm light wash, a generated contour field and a paper grain. The atmosphere is fixed so every screen shares the same material. The page is a sequence of full-screen screens (intro, work index, one screen per project, other work, services, method, about, credentials, toolkit, contact and the closing footer) with mandatory scroll snapping on large viewports. On smaller screens the chapters flow naturally without snap. The header hides on downward scroll and returns on upward scroll.

## Asset notes

- Kerawi and ePSIRS visuals are captures of their public, unauthenticated pages. No patient, guest, or booking data is shown.
- The CUAMM dashboard is authenticated. Its visual is a deliberately labeled illustrative interface preview using synthetic data; it is not presented as a live dashboard capture.
- The Better Hack homepage no longer resolves, so the site links to the public prototype listed in the source résumé. The Agricultural Data Platform links to its public prototype.
- All project claims are drawn from the supplied résumé and public project pages. Where the source did not state ownership, the site frames that work as supporting or partial scope.
- `bg-texture.webp` and `bg-contours.webp` are generated, decorative material layers. They carry no information and are hidden in print.
- Fraunces, Instrument Sans and Spline Sans Mono are self-hosted under the SIL Open Font License.
