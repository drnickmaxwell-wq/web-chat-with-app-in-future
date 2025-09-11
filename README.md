# St Mary’s House Dental Care – Monorepo

This repository houses the website and AI chatbot framework for **St Mary’s House Dental Care**.  It is structured as a monorepo using pnpm workspaces so that the public website, shared packages and future patient‑facing app live together in one place.  At this stage only the website (under `apps/site`) is live.  Additional features are staged inside `packages/incoming` for incremental integration.

## Contents

### Apps

- **`apps/site`** – The Next.js 14 App Router application for the public website and chatbot.  It includes:
  - Responsive pages built with server components and Tailwind CSS.
  - A health endpoint at `/api/health` which returns `{ ok: true }` for monitoring.
  - Cookie consent and privacy pages (`/cookies` and `/privacy`) with configurable categories (Strictly Necessary, Functional, Analytics and Marketing).
  - A GDPR consent drawer for secure video consultations.

### Packages

| Package | Purpose |
| --- | --- |
| `packages/incoming/*` | Raw components and features extracted from the provided ZIP archives.  These files are **not yet wired into the live site** but are available for future integration. |

Future packages (to be created during integration) will include:

- `packages/ui` – Shared UI primitives, tokens and layout components.
- `packages/features/*` – Self‑contained modules such as the hero video (`hero-fx`), 3D/AR viewer (`tryon`), personalisation, smile quiz, content automation, appointments, and video consultations.
- `packages/chatbot` – A reusable chatbot interface and server routes for AI conversations shared between the website and the future patient app.
- `packages/seo` – Helpers for OpenGraph, Twitter cards, sitemap and schema.org markup.
- `packages/pwa` – Performance & PWA enhancements (service workers, caching strategies).
- `packages/security` – Security and GDPR utilities (consent management, CSP headers, etc.).
- `packages/analytics` – GDPR‑aware analytics that respect user consent and anonymise data.

## Local development

This project uses pnpm workspaces.  To get started locally:

```bash
# Install pnpm if you do not already have it
npm install -g pnpm

# Install dependencies for all workspaces
pnpm install

# Run the site locally
pnpm --filter site... dev

# Run type checking and linting
pnpm run typecheck
pnpm run lint
```

The website will start at `http://localhost:3000`.  When adding environment variables locally, copy `.env.example` to `.env` and fill in the required secrets.

### Tests

Smoke tests for key flows (homepage render, contact form submit, chatbot launch, treatments list render, fees schema presence, blog post render and health endpoint) should be added to `apps/site/tests`.  Jest and @testing-library/react are recommended.

## Environment variables

The following environment variables are defined in `.env.example`.  Populate `.env` locally or via the Vercel dashboard.  Features without keys are stubbed so that builds remain green.

| Name | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_NAME` | Human‑readable application name (used in meta tags). |
| `NEXT_PUBLIC_BASE_URL` | The fully qualified domain where the site is deployed. |
| `NEXT_PUBLIC_BRAND_PRIMARY` | Primary brand colour (magenta). |
| `NEXT_PUBLIC_BRAND_SECONDARY` | Secondary brand colour (turquoise). |
| `NEXT_PUBLIC_ACCENT_GOLD` | Accent colour (shimmering gold). |
| `NEXT_PUBLIC_NEUTRAL` | Neutral light grey. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | API key for embedding Google Maps. |
| `OPENAI_API_KEY` | Key for OpenAI requests used by the chatbot. |
| `HEYGEN_API_KEY` | API key for HeyGen avatar generation (voice/video). |
| `SYNTHESIA_API_KEY` | API key for Synthesia avatars. |
| `ZAPIER_WEBHOOK_APPTS` | Webhook URL for creating appointments via Zapier/Dentally. |
| `DENTALLY_ZAPIER_HOOK` | Zapier hook for Dentally integration. |
| `TABEO_API_KEY` | Key for Tabeo finance integration. |
| `HEIDI_HEALTH_API_KEY` | Key for Heidi Health integration (clinical notes). |
| `STRIPE_SECRET_KEY` | Stripe secret for deposit payments. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for Stripe webhooks. |
| `TWILIO_SMS_KEY` | Twilio key for SMS notifications. |
| `TWILIO_EMAIL_KEY` | Twilio (SendGrid) key for email notifications. |
| `AUTH_PROVIDER` | Authentication provider (e.g. `jwt`). |
| `JWT_SECRET` | Secret used to sign JWTs (patient app). |
| `NEXTAUTH_URL` | URL used by NextAuth (for the future patient app). |

> **Note:** never commit `.env` with real secrets.  Store sensitive keys in Vercel project settings.

## GDPR and cookie consent

The website complies with UK GDPR and PECR regulations.  Users are prompted to set cookie preferences via a banner that categorises cookies into **Strictly Necessary**, **Functional**, **Analytics** and **Marketing**.  Strictly necessary cookies are always enabled.  Users can change their preferences at any time via the Preferences Centre (`/cookies`).  For data requests please email **info@smhdental.co.uk**.

For video consultations, users must explicitly consent to data processing before entering the secure portal.  The GDPR consent drawer outlines what data is collected, how it is protected, and the user’s rights.

## Patient app provisions

While the secure patient app is not yet implemented, this monorepo is structured to support it.  A second application will live under `apps/patient` and will reuse shared packages (`chatbot`, `ui`, `analytics`, `security`, `integrations`, etc.).  Authentication scaffolding has been provided via `AUTH_PROVIDER`, `JWT_SECRET` and `NEXTAUTH_URL` environment variables.  When the patient app is added it will import components from these shared packages instead of duplicating code.

## Deployment

This repository is configured for continuous deployment via GitHub → Vercel.  The CI workflow (defined in `.github/workflows/ci.yml`) runs linting, type checking, unit tests and a build on every pull request and push to `main`.  Production deployments require that the health endpoint returns `ok: true` and that Lighthouse budgets for performance, accessibility, best practices and SEO are met.  Preview deployments for feature branches are protected behind a Vercel password to prevent unauthorised access.

## Next steps

The raw component archives provided by the design and engineering teams have been extracted into `packages/incoming`.  These files must be incrementally integrated into the live site via feature branches.  The planned mapping is described in the project brief (e.g. 3D viewer into `features/tryon`, hero effects into `features/hero-fx`, etc.).  Stubbing and graceful degradation should be maintained so that missing environment keys do not break the build.