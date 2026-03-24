# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Run production server
```

No test suite is configured.

## Architecture

This is a minimal Next.js app (3 source files) that scrapes new software engineering job postings and emails them daily.

**Data flow:**
1. Vercel cron (`vercel.json`) hits `GET /api/find-jobs` at 5 PM UTC daily
2. `app/api/find-jobs/route.ts` fetches the raw markdown from the SimplifyJobs New-Grad-Positions GitHub repo
3. Cheerio parses the HTML-rendered markdown table
4. Filters: only rows where age is `0d` and role matches SWE keywords
5. Sends an HTML email via Resend with the matching jobs

**Frontend** (`app/page.tsx`) is a client component with a single button that calls the same API route manually — useful for testing outside the cron schedule.

## Environment Variables

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend email service key |
| `CRON_SECRET` | Bearer token to protect the cron endpoint (authorization check currently commented out in route) |

## Key Details

- **Email recipient** is hardcoded in `app/api/find-jobs/route.ts` — change `sachin.kathir.123@gmail.com` if needed
- **Email sender** uses `onboarding@resend.dev` (Resend's shared domain); switch to a verified domain for production
- The `CRON_SECRET` authorization check in the route is currently disabled
- No database — completely stateless
- Tailwind v4 is used (inline `@theme` syntax in `globals.css`, not `tailwind.config.js`)
