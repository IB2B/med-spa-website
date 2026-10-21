# Med spa landing page

Landing page and booking flow for **medspa.intelligentb2b.com**, the IntelligentB2B offer for
aesthetic clinics: we run ads for high-value treatments, pre-screen every patient for budget and
book them straight into the clinic's calendar.

The site is **Italian only** and lives at the root:

| Address | Page |
| --- | --- |
| `/` | Landing page |
| `/book` | Booking page (pick a slot, leave your details, confirmed) |
| `/it`, `/it/book` | Redirect to `/` and `/book` |
| `/en`, `/fr`, `/ar` | Not published (404) |

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui on Base UI
- Vercel BotID on the booking API
- Booking slots and appointments come from the CRM calendar (shared with the TORCH site)

> This Next.js version has breaking changes. Read `AGENTS.md` and the guides in
> `node_modules/next/dist/docs/` before changing framework code.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Before every push:

```bash
npm run lint
npm run build
```

## Environment variables

Server-only, set in `.env.local` locally and in Vercel → Settings → Environment Variables in production.

| Variable | What it is |
| --- | --- |
| `GHL_PRIVATE_TOKEN` | Private integration token of the CRM sub-account |
| `GHL_LOCATION_ID` | CRM sub-account (location) ID |
| `GHL_CALENDAR_ID` | Calendar the booking page reads free slots from and books 30-minute calls on |
| `NEXT_PUBLIC_SITE_URL` | Optional. Public URL used in metadata; defaults to `https://medspa.intelligentb2b.com` |

## Landing page sections

In order, as rendered by `src/app/[lang]/page.tsx`:

1. **Hero** with the video player (`agency-hero.tsx`, `hero-video.tsx`)
2. **Testimonials**, real WhatsApp messages from clients (`client-messages.tsx`)
3. **Pain points**, "Ti suona familiare?" (`pain-points.tsx`)
4. **What you get**, "Cosa ottieni ogni mese" (`offer-section.tsx`)
5. **Technology**, "Scopri Torch™" (`technology-section.tsx`)
6. **FAQ** and the black **"Vuoi riempire la tua agenda?"** call band (`faq-section.tsx`)
7. **Footer** (`site-footer.tsx`)

Every "Prenota una call gratuita" button opens `/book`.

## Where the text lives

- **In the component**, at the top under `Edit everything here`: hero, video player labels,
  testimonials and "What you get". Each has an `en` and an `it` block.
- **In `src/i18n/dictionaries/`**: pain points, technology, FAQ, booking, footer, page title and description.
- **In `src/content/site.ts`**: links and business details that aren't translated (site URL, WhatsApp).

Text in `[brackets]` is a placeholder and must be filled before launch (for example the FAQ answers
"[X] giorni" and "[Risposta: es. …]").

### Hero video

The video URL is `copy.video.src` in `src/components/landing/agency-hero.tsx`. It can be a full URL
or a file in `public/` (e.g. `/hero/clinic.mp4`). Add a `poster` image to show a still before it loads.

## Languages

Italian is the default locale (`src/i18n/config.ts`). `src/proxy.ts` serves the `/it` pages at the
root and redirects `/it/...` to the unprefixed address. Only `it` is built (`generateStaticParams`
in `src/app/[lang]/layout.tsx`); the English, French and Arabic text stays in the code for later.

## Deployment

Hosted on Vercel. Preview deploys from pull requests need a plan that can deploy from a private
GitHub organization repository.
