# Albatros Tenerife — Real Estate Website

Astro 6 + Sanity + Cloudflare Workers + Tailwind v4

## Stack

- **Frontend:** Astro 6, Tailwind v4, React (islands)
- **CMS:** Sanity v5 (Studio at `/studio`)
- **Hosting:** Cloudflare Workers
- **Email:** Resend
- **i18n:** EN (default, no prefix), CS, PL, HU, IT, ES

## Local Development

```bash
npm install
npm run dev        # Astro dev server → localhost:4321
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
RESEND_API_KEY=
RESEND_FROM=
RESEND_TO=
TURNSTILE_SECRET_KEY=
PUBLIC_TURNSTILE_SITE_KEY=
PUBLIC_SANITY_STUDIO_DEPLOY_HOOK=
```

## Sanity Studio

Local: `localhost:4321/studio`
Cloud: `albatros-tenerife.sanity.studio`

Deploy studio to cloud:

```bash
npx sanity deploy
```

## Deploy

Push to `main` → Cloudflare Workers auto-builds via GitHub integration.

Manual deploy via Cloudflare dashboard or wrangler.
