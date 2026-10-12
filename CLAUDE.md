# CLAUDE.md

Guide for anyone (human or AI assistant) working on ScholarSpring. Read this before making changes, and keep it up to date when something here changes.

## What ScholarSpring is

A scholarship finder for **high-school students applying to college** (mostly juniors and seniors). It was first built in Vibe Coding 1 as a frontend-only demo, then rebuilt step by step for an AI-aided software engineering course.

### Audience and voice

- Write for a high-school student planning for college: plain words, second person ("you"), no jargon.
- Scholarships are for students starting college (e.g. "graduating high-school seniors"), not undergraduates, graduate students or professionals. Avoid "fellowship", "enrolled at an accredited institution" and similar college-level framing.
- The profile asks for **high-school** GPA, the major they're **planning**, and where they want to study ("Anywhere in the US" is shown for the `National` region).
- The tab title is `ScholarSpring · College scholarships for high-school students`; page titles are `<Page> · ScholarSpring` (`useDocumentTitle`).

### Requirements

From the original interview findings:

1. Students can **search** scholarships by name or keyword.
2. Students can **filter** by intended major, region and GPA.
3. Students can **create a profile** (username, password, GPA, intended major, preferred region).
4. Results are **informed by the profile**: a student sees what they qualify for.
5. Students can **save** scholarships and come back to them.

A student "qualifies" on GPA when `scholarship.min_gpa <= student.gpa`. Scholarships listing `Any major` match every major, and those listing `National` match every region.

## Current state

The six-step roadmap is **complete**. Production: https://scholarspring-snowy.vercel.app (Vercel, deploys from `main`). The app is a Vite + React + React Router + TypeScript single-page app, styled with Tailwind CSS v4 (light and dark themes) and Lucide icons, with Supabase for accounts and data.

### Commands

| Command | Use |
|---|---|
| `pnpm install` | Install (pnpm only; `corepack enable` picks up the pinned version) |
| `pnpm dev` | Dev server at localhost:5173 |
| `pnpm build` | `tsc -b` then `vite build` into `dist/` |
| `pnpm lint` | oxlint. Use oxlint only; don't add ESLint, Prettier-as-linter or Biome |
| `pnpm typecheck` | `tsc -b` |
| `pnpm test` | Vitest unit tests |

Before opening a PR, run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`. All four must pass with no oxlint warnings; CI (`.github/workflows/ci.yml`) runs the same checks with `--deny-warnings` on every PR and push to `main`. Fix the code rather than disabling a rule; if a rule truly doesn't fit, change `.oxlintrc.json` and say why in the PR.

### How the app fits together

- **Routes** (`App.tsx`, React Router): `/` home, `/scholarships` browse, `/scholarships/:id` detail, `/saved`, `/profile`, and a 404. `vercel.json` rewrites every non-asset path to `index.html`.
- **App state** lives in `App.tsx` and reaches pages through `AppContext` (`useApp()`): auth, scholarships and load status, saved ids, `toggleSave`, `openAuth`, `toast`, `today` and `browseLink`. `Layout` holds the header, footer, toast and the sign-in / sign-up dialog.
- **Browse state is the URL** (`?q=&major=&region=&gpa=&sort=amount&closed=1`), parsed and written by `src/lib/browse.ts`; updates use `replace` so typing doesn't fill history. Signed-in students' **Browse** link carries their profile filters (`browseLink`); after sign-up they land there.
- **Matching:** `profileMatch()` checks GPA, major and region separately with the same rules as the filters; cards show "Matches your profile" when all three pass, and the detail page lists each criterion.
- **Deadlines:** `deadlineStatus(deadline, today)` with `today` from `localToday()` (the student's calendar date). Open through the end of the deadline day; "soon" within 14 days. Closed scholarships are hidden on Browse unless `closed=1`.
- **Saving while signed out** opens sign-in with a `pendingSaveId`; the save happens once the student is in, and they stay on the page they were on.
- Hooks load data through `src/lib/data.ts` and nothing else; only `data.ts` imports the Supabase client (`src/lib/supabase.ts`). Expected failures are `AuthError` (message shown as is) or `DataError`; `errorMessage()` (`src/lib/errors.ts`) turns anything else into a generic toast.
- `Profile` is `{ username, email, gpa, major, region }` and never includes a password. Sign-in is email + password; the username is chosen at sign-up and can't change. Updating a profile with a blank password keeps the current one.
- Without `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, `supabase` is `null`, data calls reject with `DataError`, and the app shows `ConfigNotice`. Unit tests always run unconfigured (see `vite.config.ts`). Builds pick these up from the environment, so set them explicitly (even to empty) when a build must not use a real project.
- **Theme:** `src/lib/theme.ts` + `useTheme()`; preference `system | light | dark` in `localStorage` (`scholarspring-theme`), applied as a `dark` class on `<html>`. A small script in `index.html` sets it before first paint, so there's no flash.
- Dialogs are native `<dialog>` elements opened with `showModal()` (`components/Modal.tsx`). The auth form remounts each time it opens (`formKey`) instead of resetting state in an effect.
- Breakpoints: `max-md:` is 800px and below, `max-sm:` is 500px and below (see `src/index.css`).
- Build output is split into `supabase`, `react` and app chunks (`vite.config.ts`) so third-party code stays cached across deploys.

### Database

Schema lives in `supabase/migrations/` (applied with the SQL Editor or `supabase db push`); `src/lib/database.types.ts` mirrors it by hand.

| Table | Who can do what (Row Level Security + grants) |
|---|---|
| `scholarships` | Everyone (anon and signed in) can read. Nobody can write from the app; edit in the dashboard or a migration. `id` is a slug like `stem-forward`. |
| `profiles` | One row per auth user, created by the `on_auth_user_created` trigger from the `signUp` metadata. A student can read and update only their own row, and only `gpa`, `major`, `region` (column grants). Usernames are unique ignoring case. |
| `saved_scholarships` | A student can read, insert and delete only their own rows. `profile_id` defaults to `auth.uid()`. No updates. |

`username_available(name)` is a `security definer` function anon can call, so sign-up can say "username taken" before creating the account.

Rules for schema changes:
- Never edit a migration that has been applied; add a new timestamped file.
- Every new table gets RLS enabled and explicit policies in the same migration. Revoke what clients shouldn't do.
- Update `database.types.ts`, `toScholarship`/`toProfile` and the tests with it.
- Never use the `service_role` key or database password in the app, `.env.local`, Vercel or CI.

## Roadmap

One branch and one PR per step, merged before the next step starts. Full plan: `docs/TARGET_ARCHITECTURE.md`.

| Step | Branch | Scope |
|---|---|---|
| 1 | `docs/readme` | New `README.md` and this file |
| 2 | `fix/round-1-bugs` | Fix the known bugs in the existing vanilla code. No stack changes |
| 3 | `chore/vite-react-ts` | Port the current UI as-is to Vite + React + TypeScript + Tailwind + pnpm + Lucide. Still `localStorage`, but only through `src/lib/data.ts`. Add unit tests for matching |
| 4 | `chore/vercel-deploy` | Deploy to Vercel; add the live demo badge and link to the README |
| 5 | `feat/supabase` | Supabase tables, RLS, seed data, Supabase Auth; switch `src/lib/data.ts` over |
| 6 | `feat/ui-refresh` | New UI per the design language below: bold forest look, routes, dark mode, match and deadline cues, sorting |

All six steps are done. New work follows the same pattern: one branch and PR per change, with README and this file updated in the same PR.

## Target architecture

- **Frontend:** Vite, React, TypeScript (strict), Tailwind CSS, Lucide icons. pnpm is the only package manager; commit `pnpm-lock.yaml` and never add an npm or yarn lockfile. Lint with oxlint only.
- **Backend:** Supabase only. The browser talks to Supabase directly; there is no custom server. Row Level Security on every table is what keeps data private, not the UI.
- **Hosting:** Vercel, with preview deployments for every PR. `vercel.json` pins install (`pnpm install --frozen-lockfile`), build (`pnpm build`) and output (`dist`), rewrites every non-`/assets/` path to `index.html` for client-side routes, caches hashed `/assets/*` for a year, and sets `nosniff` and `Referrer-Policy` headers.

Layout:

```
src/
  App.tsx         routes and app state
  pages/          HomePage, BrowsePage, ScholarshipPage, SavedPage, ProfilePage, NotFoundPage
  components/     Layout, Header, Footer, ThemeToggle, ScholarshipCard (+ grid, skeletons), Chips, SaveButton,
                  PageBand (+ PageBody, EmptyState), AuthDialog, ProfileFields, Modal, Toast, ConfigNotice,
                  Brand, SparkleMark, button.ts
  context/        AppContext (useApp)
  hooks/          useAuth, useScholarships, useSavedScholarships, useTheme, useToast, useDocumentTitle
  lib/
    data.ts       the ONLY module that talks to Supabase
    supabase.ts   the Supabase client (null when the VITE_ variables are missing)
    database.types.ts  row types mirroring supabase/migrations
    matching.ts   filters and profileMatch, unit tested
    browse.ts     Browse URL state, sorting, hiding closed, unit tested
    deadlines.ts  deadline status and localToday, unit tested
    format.ts     money and date formatting (UTC)
    theme.ts      theme preference, unit tested
    errors.ts     errorMessage for toasts
    fixtures.ts   the seeded scholarships, for tests
    options.ts    major and region lists
  index.css       light/dark colour tokens, Tailwind theme and base styles
  types.ts        Scholarship, Profile, ProfileDetails, AuthMode
```

Data model (since step 5): see [Database](#database) above.

## Conventions

- **Branches:** `docs/…`, `fix/…`, `chore/…`, `feat/…`. Never commit straight to `main`.
- **Commits:** start with the same prefix (`docs:`, `fix:`, `chore:`, `feat:`) and a short imperative summary.
- **Scope:** keep each PR to its roadmap step. Note anything out of scope in the PR description instead of fixing it.
- **Docs move with the code:** if a change affects the stack, structure, commands or behaviour, update `README.md` and this file in the same PR.
- **Secrets:** never commit keys. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` may reach the browser. A service-role key must never have a `VITE_` prefix or be set in Vercel.
- **Logic stays testable:** filtering and matching are pure functions with no DOM or network access. New logic in `src/lib/` comes with Vitest tests next to it (`*.test.ts`).
- **Escape user content:** no unescaped `innerHTML` with data. In React, never use `dangerouslySetInnerHTML` for scholarship or profile data.

## Design language

**Bold forest.** Deep forest-green bands (header, every page's opening band, feature blocks), cream type on them,
coral as the only accent, and oversized Playfair numbers for award amounts. Warm and editorial, never generic:
**no purple gradients, glassmorphism or SaaS templates.**

Colours are semantic tokens defined twice in `src/index.css` (`:root` and `:root.dark`) and exposed to Tailwind
(`bg-page`, `bg-band`, `text-muted`, `bg-accent text-accent-fg`, …). Use the tokens, never raw hex values, so both
themes keep working. Every text/background pair below meets WCAG AA in both themes.

| Token | Light | Dark | Use |
|---|---|---|---|
| `page` | `#f7f5ef` | `#0d1c19` | Page background |
| `card` | `#fffdf8` | `#142a25` | Cards, inputs, dialogs |
| `band` / `band-fg` / `band-muted` | `#193631` / `#f7f5ef` / `#b9cbc4` | `#0a1714` / `#f3efe4` / `#9fb3ac` | Forest bands and the text on them |
| `fg` / `muted` | `#193631` / `#5c6b67` | `#f3efe4` / `#a3b3ae` | Text |
| `line` | `#dfe6df` | `#24403a` | Borders |
| `accent` / `accent-fg` | `#ec795f` / `#193631` | `#f0876e` / `#10211d` | Coral fills (buttons, today chip) and the dark text on them |
| `accent-text` | `#b5472f` | `#f4a08b` | Coral used as small text on page or card |
| `mint` / `mint-fg` | `#d8ebe1` / `#193631` | `#1f4038` / `#f3efe4` | "Matches your profile", soft highlights |
| `yellow` / `yellow-fg` | `#f6d77b` / `#193631` | `#e9c968` / `#10211d` | "Closes soon" |

- **Never** white text on coral, or plain `accent` as small text on cream: both fail AA. Use `accent-fg` on coral and `accent-text` for coral text.
- **Type:** Playfair Display (700, 800 for big numbers) for headings and amounts, DM Sans for everything else. Use `tabular-nums` for money.
- **Icons:** Lucide; the ✦ brand mark is `SparkleMark` (matches the logo and favicon). No emoji as UI icons.
- **Accessibility:** skip link, keyboard reachable, visible focus (`:focus-visible` coral outline), labelled icon buttons, AA contrast, `prefers-reduced-motion` respected, works down to 375px wide.

## Assets

- `.github/assets/logo-light.svg` and `logo-dark.svg`: the ✦ mark plus "ScholarSpring" in Playfair Display 700, converted to outlines so they render the same everywhere.
- `.github/assets/screenshot-light.png` and `screenshot-dark.png`: the README hero image in each theme. Retake them when the UI changes visibly.

## Decisions

| Decision | Why |
|---|---|
| Fix bugs before changing the stack | The port in step 3 should copy working behaviour, not bugs |
| Port the UI as-is in step 3, redesign in step 6 | Keeps the stack change reviewable on its own |
| One storage module (`src/lib/data.ts`) | The localStorage → Supabase switch touches one file |
| Supabase directly from the browser, guarded by RLS | No server to build or host; the anon key is safe to expose when RLS is on |
| Email + password sign-in, username kept for display | Standard Supabase Auth, so password reset can be added later; the username still personalises the UI |
| Profiles created by a database trigger from sign-up metadata | Works even when email confirmation is on (no session yet), and a profile can't exist without an account |
| Scholarship ids are slugs, not UUIDs | Readable, stable ids that match the original data |
| Amount as whole dollars, deadline as a `date` | So they can be sorted and filtered; the UI formats them (`src/lib/format.ts`, in UTC so days never shift) |
| Keep the existing palette and typefaces | The original identity is already distinctive; refine it rather than replace it |
| "Bold forest" direction for step 6 | Chosen over a quieter editorial look and a ticket/field-guide look: high contrast, memorable, still the same palette |
| Coral fills carry dark text, not white | White on coral is 2.8:1 and fails AA; ink on coral passes in both themes |
| Real routes, but sign-in stays a dialog | Pages for things worth linking to; signing in shouldn't lose your place |
| Browse filters in the URL; profile filters via the Browse link | Shareable and reload-proof searches, while signed-in students still start from their profile |
| Hide closed scholarships by default | Students act on open ones; closed ones are one click away |
| Migration moving the demo deadlines into 2027 | The seeded 2026 deadlines had passed, which would have left Browse empty |
| Demo scholarships reworded for high-school seniors | The original copy mixed undergraduate and professional awards; "Women Who Build" became "Future Founders Award" (`future-founders`), with saved rows moved over |
