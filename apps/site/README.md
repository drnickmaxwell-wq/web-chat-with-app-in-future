# web-chat-with-app-in-future

Website + AI chatbot framework for **St Mary’s House Dental Care**.

## Overview

This repository contains the marketing website and chatbot framework for St Mary’s House Dental Care (SMH Dental). It is built with **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, and **pnpm**. The project lays the groundwork for a future secure patient treatment plan app that will live alongside the marketing site in the same repo and share the chatbot.

Key features include:

- Luxury coastal design reflecting SMH Dental’s brand colours (magenta, turquoise, shimmering gold, light grey).
- SEO‑friendly metadata, MDX support, and sitemap generation.
- Strict security headers and GDPR‑compliant cookie consent banner.
- A minimal chatbot UI ready to be wired up to an AI backend via `OPENAI_API_KEY`.

## Repository layout

- `src/app` – App Router pages. The homepage is defined in `page.tsx`. Additional routes include `/cookies` and `/privacy`.
- `src/components` – Shared UI components such as the navigation, footer, chatbot, cookie banner and page sections.
- `src/lib` – SEO configuration and metadata helpers.
- `public` – Static assets including icons and images.
- `next.config.mjs` – Next.js configuration with strict security headers and MDX support.
- `tailwind.config.ts` – Tailwind configuration with custom colours and animations.
- `.github/workflows/ci.yml` – Basic CI that lints, type‑checks and builds the application.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the development server. |
| `pnpm build` | Build the application for production. |
| `pnpm start` | Start the production server locally. |
| `pnpm lint` | Lint all source files with ESLint. |
| `pnpm typecheck` | Run TypeScript type‑checking. |

## Environment variables

The application relies on a number of environment variables, most of which are set in Vercel. Copy `.env.example` to `.env` and fill in values locally if needed. All secrets must be stored in environment variables, **never** hardcoded in the codebase.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Display name of the site. |
| `NEXT_PUBLIC_BRAND_PRIMARY`, `NEXT_PUBLIC_BRAND_SECONDARY`, `NEXT_PUBLIC_ACCENT_GOLD`, `NEXT_PUBLIC_NEUTRAL` | Hex values defining the brand palette. |
| `NEXT_PUBLIC_BASE_URL` | Canonical base URL of the deployed site. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Enables Google Maps components. |
| `OPENAI_API_KEY` | Will power future chatbot backend. |
| `ZAPIER_WEBHOOK_APPTS`, `DENTALLY_ZAPIER_HOOK` | Webhooks for appointment and PMS integrations. |
| `TABEO_API_KEY`, `HEYGEN_API_KEY`, `SYNTHESIA_API_KEY` | Third‑party integrations for finance and video. |
| `TWILIO_SMS_KEY`, `TWILIO_EMAIL_KEY` | SMS/email notification integrations. |
| `AUTH_PROVIDER`, `JWT_SECRET`, `NEXTAUTH_URL` | Authentication scaffolding for the future patient app. |

## GDPR & Cookies

- The site includes a cookie consent banner allowing visitors to opt‑in or reject non‑essential cookies (functional, analytics, marketing). Strictly necessary cookies are always enabled.
- A preferences centre is available at `/cookies` to update choices at any time.
- A privacy and data requests page at `/privacy` outlines how SMH Dental processes personal data and how users can exercise their rights. Contact **info@smhdental.co.uk** for any data requests.

## Deployment & CI/CD

- The project is deployed via Vercel. Preview deployments are created for each pull request. The `main` branch is protected and requires all CI checks to pass (lint, type‑check, build) before merging.
- Environment variables are managed in the Vercel dashboard.

## Future: Secure Patient App

- A secure treatment plan app will be added in a future phase. It will likely live under `src/app/(patient)` or `apps/patient` and reuse the shared chatbot component. Authentication will initially be handled via JWT configured through `AUTH_PROVIDER`, `JWT_SECRET` and `NEXTAUTH_URL`.
- Integrations with Zapier, Dentally, Tabeo, HeyGen, Synthesia and Twilio will also be wired up as keys are provided.
