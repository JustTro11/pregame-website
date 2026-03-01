# CLAUDE.md — PreGame Website

## Project Overview

**PreGame ★泡沫紅茶店★** is a multilingual website for a bubble tea restaurant in Tainan, Taiwan. It handles online menus, reservations, and Instagram lookbook display, with a LINE chatbot backend.

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 (PostCSS plugin, not CLI)
- **Backend**: Supabase (PostgreSQL, Storage, Edge Functions)
- **i18n**: next-intl with 5 locales: `zh-TW` (default), `en`, `zh-CN`, `ja`, `ko`
- **Forms**: react-hook-form
- **Testing**: Jest (unit) + Playwright (e2e)
- **Package manager**: npm

## Project Structure

```
app/
├── [locale]/           # All pages under locale dynamic segment
│   ├── page.tsx        # Home
│   ├── menu/           # Menu listing
│   ├── reserve/        # Reservation form
│   ├── about/          # About/contact
│   └── confirmation/   # Booking confirmation
├── components/
│   ├── layout/         # Header, Footer
│   ├── home/           # Hero, FeaturedDrinks, Lookbook, QuickReserve
│   ├── menu/           # MenuClient, DrinkCard, CategoryFilter
│   ├── reservation/    # ReservationForm, TimeSlotPicker, PartySizeSelector
│   └── ui/             # Button, Input, Card, DatePicker, etc.
├── actions/            # Server Actions (menu.ts, reservation.ts)
├── config/             # business.ts (hours/seating), design.ts (tokens)
└── i18n/               # routing.ts, request.ts
lib/                    # Supabase client, Instagram fetch, utils
messages/               # i18n JSON files per locale
supabase/               # Edge Functions (line-webhook, send-reminders)
__tests__/              # Jest unit tests (mirrors app structure)
e2e/                    # Playwright tests (home, menu, reservation)
scripts/                # sync_instagram.py, seed_supabase.py, etc.
```

## Key Conventions

### Components
- Server Components by default; add `'use client'` only when needed (interactivity, hooks)
- All user-facing text must use `useTranslations()` or server-side `getTranslations()` — no hardcoded strings
- Path alias `@/*` maps to project root

### i18n
- All 5 locales must have matching keys in `messages/{locale}.json`
- Routing is path-based: `/zh-TW/menu`, `/en/menu`, etc.
- `middleware.ts` handles locale detection and redirects

### Database (Supabase)
- Use Server Actions (`app/actions/`) for all DB mutations
- Use the anon client (`lib/supabase/client.ts`) for browser reads, service role client for server-side/edge functions
- Key tables: `menu_categories`, `menu_items`, `reservations`, `instagram_posts`, `line_conversations`

### Styling
- Tailwind CSS v4 — use utility classes; no separate config file, configuration is in CSS
- Design tokens are in `app/config/design.ts` and CSS variables in `app/globals.css`
- Theme: dark streetwear — near-black background (`#0A0A0A`), amber accent (`#E8A849`), cream text (`#F2E8D5`)
- Use `tailwind-merge` + `clsx` for conditional classes (via `lib/utils.ts`)

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Jest unit tests
npm run test:e2e     # Playwright e2e tests
npm run test:e2e:ui  # Playwright with interactive UI
```

## Testing

- **Every new feature or bug fix requires tests.** Unit tests go in `__tests__/` mirroring the source path.
- Jest uses jsdom environment; mock Supabase calls in unit tests.
- E2E tests are in `e2e/` and run against the dev server.
- Run `npm test` before marking any implementation complete.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` must never be used in client components or exposed to the browser.

## External Integrations

- **LINE Bot**: Supabase Edge Function at `supabase/functions/line-webhook/` handles booking state machine and FAQ
- **Instagram**: GitHub Actions runs `scripts/sync_instagram.py` daily to sync posts into `instagram_posts` table
- **Supabase Storage**: Static assets (images) are served from Supabase Storage, not `/public`

## Business Rules (reference)

- Operating hours: Mon–Tue, Thu–Fri 3 PM–11 PM; Sat 3 PM–1 AM; closed Wednesday and Sunday (verify in `app/config/business.ts`)
- Reservations: 1–8 guests, up to 7 days in advance
- Seating capacity: 26 total

## What Not To Do

- Do not add hardcoded strings — all copy must go through i18n
- Do not use the service role key in any client component
- Do not commit `.env.local`
- Do not bypass ESLint or test hooks without explicit instruction
