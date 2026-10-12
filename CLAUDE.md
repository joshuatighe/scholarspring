# CLAUDE.md

Guide for anyone (human or AI assistant) working on ScholarSpring. Read this before making changes, and keep it up to date when something here changes.

## What ScholarSpring is

A scholarship finder for students. It was first built in Vibe Coding 1 as a frontend-only demo. It is now being rebuilt step by step for an AI-aided software engineering course.

### Requirements

From the original interview findings:

1. Students can **search** scholarships by name or keyword.
2. Students can **filter** by intended major, region and GPA.
3. Students can **create a profile** (username, password, GPA, intended major, preferred region).
4. Results are **informed by the profile**: a student sees what they qualify for.
5. Students can **save** scholarships and come back to them.

A student "qualifies" on GPA when `scholarship.min_gpa <= student.gpa`. Scholarships listing `Any major` match every major, and those listing `National` match every region.

## Current state

The roadmap is at **step 5 of 6**. Production: https://scholarspring-snowy.vercel.app (Vercel, deploys from `main`). The app is a Vite + React + TypeScript single page, styled with Tailwind CSS v4 and Lucide icons, with Supabase for accounts and data. It still looks like the original; the redesign is step 6.

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

- `App.tsx` owns UI state: filters, which dialog is open, the toast, `busy` while a request runs. Filters are derived from the signed-in profile until the student changes one (`customFilters` is `null` until then).
- Hooks load data through `src/lib/data.ts` and nothing else; only `data.ts` imports the Supabase client (`src/lib/supabase.ts`). Expected failures are `AuthError` (message shown to the student as is) or `DataError`; anything else gets a generic toast.
- `Profile` is `{ username, email, gpa, major, region }` and never includes a password. Sign-in is email + password; the username is chosen at sign-up and can't change. Updating a profile with a blank password keeps the current one.
- Without `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`, `supabase` is `null`, data calls reject with `DataError`, and the app shows `ConfigNotice`. Unit tests always run unconfigured (see `vite.config.ts`).
- supabase-js keeps the session in `localStorage` itself. On load the app deletes the old `scholarspring-demo` key, which held the browser-only accounts with plain-text passwords.
- Dialogs are native `<dialog>` elements opened with `showModal()` (`components/Modal.tsx`). The profile form remounts each time it opens (`formKey`) instead of resetting state in an effect.
- Breakpoints match the original CSS: `max-md:` is 800px and below, `max-sm:` is 500px and below (see `src/index.css`).

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
| 6 | `feat/ui-refresh` | New UI per the design language below |

When a step merges, update the roadmap table and the `roadmap-step_N_of_6` badge in `README.md`, and the "Current state" section here.

## Target architecture

- **Frontend:** Vite, React, TypeScript (strict), Tailwind CSS, Lucide icons. pnpm is the only package manager; commit `pnpm-lock.yaml` and never add an npm or yarn lockfile. Lint with oxlint only.
- **Backend:** Supabase only. The browser talks to Supabase directly; there is no custom server. Row Level Security on every table is what keeps data private, not the UI.
- **Hosting:** Vercel, with preview deployments for every PR. `vercel.json` pins install (`pnpm install --frozen-lockfile`), build (`pnpm build`) and output (`dist`), caches hashed `/assets/*` for a year, and sets `nosniff` and `Referrer-Policy` headers. The app is a single page with hash links, so no SPA rewrite is needed; add one if client-side routes are introduced.

Layout (since step 3):

```
src/
  App.tsx         page composition and UI state
  components/     Header, Hero, SearchSection, ScholarshipCard, ScholarshipGrid, SavedSection,
                  CtaSection, Footer, ProfileDialog, DetailDialog, Modal, Toast, Brand, button.ts
  hooks/          useAuth, useScholarships, useSavedScholarships, useToast
  lib/
    data.ts       the ONLY module that talks to Supabase
    supabase.ts   the Supabase client (null when the VITE_ variables are missing)
    database.types.ts  row types mirroring supabase/migrations
    matching.ts   pure filter/match functions, unit tested
    format.ts     money and date formatting (UTC)
    fixtures.ts   the seeded scholarships, for tests
    options.ts    major and region lists
  index.css       Tailwind theme tokens and base styles
  types.ts        Scholarship, Profile, AuthMode
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

ScholarSpring should look warm, editorial and its own. **No purple gradients, glassmorphism or generic SaaS templates.**

The tokens below are Tailwind theme colours in `src/index.css` (`bg-ink`, `text-coral`, `border-line`, …). Use them instead of new hex values.

| Token | Value | Use |
|---|---|---|
| ink | `#193631` | Text, dark surfaces |
| muted | `#6a7774` | Secondary text |
| cream | `#f7f5ef` | Page background |
| paper | `#fffdf8` | Cards, header |
| mint | `#d8ebe1` | Soft fills, badges |
| sage | `#8fb9a5` | Accents |
| coral | `#ec795f` | Primary actions, the ✦ mark |
| yellow | `#f6d77b` | Highlights |
| line | `#dfe6df` | Borders |

- **Type:** Playfair Display (700) for headlines, DM Sans for everything else.
- **Icons:** Lucide from step 3 on; no emoji as UI icons.
- **Accessibility:** keyboard reachable, visible focus, labelled icon buttons, AA contrast, works down to 375px wide.
- **Dark mode** arrives with the UI refresh. Design it on purpose; don't just invert the colours.

## Assets

- `.github/assets/logo-light.svg` and `logo-dark.svg`: the ✦ mark plus "ScholarSpring" in Playfair Display 700, converted to outlines so they render the same everywhere.
- `.github/assets/screenshot.png`: the README hero image. Retake it when the UI changes visibly.

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
