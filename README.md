# Storefront

Next.js e-commerce template with Supabase, Tailwind CSS, and admin tools. Replace branding, copy, and environment values before production.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_APP_URL`, Supabase keys, and optional email/SMS keys.
3. Dev server: `npm run dev` (default port **3005**). Open `http://localhost:3005`.

## Scripts

- `npm run build` — production build  
- `npm run lint` — ESLint  
- `npm run db:migrate` — run SQL migration helper  
- `npm run create-admin` — create an admin user (see script usage)  
- `npm run supabase:link` — link Supabase CLI to a project  
- `npm run supabase:push` — push migrations  

## Customize

- Defaults: `lib/site-defaults.ts`, `context/CMSContext.tsx`, `app/layout.tsx`, `public/manifest.json`
- Add `public/og-image.png` (1200×630) and favicons as needed
- Point `public/robots.txt` sitemap URL at your real domain or generate robots via `app/robots.ts` when `NEXT_PUBLIC_APP_URL` is set
