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

The roadmap is at **step 1 of 6**. The app is still the original three files:

| File | Role |
|---|---|
| `index.html` | Page layout, profile dialog, detail dialog |
| `styles.css` | All styles (minified); the palette lives in `:root` |
| `app.js` | Data, filtering, profile, saving. One global `state` object; `persist()` writes `localStorage` and redraws everything |

Run it with `python3 -m http.server 8000`. There are no dependencies, build, linter or tests yet.

Known bugs (details in `docs/CURRENT_ARCHITECTURE.md`):
- GPA filter is backwards: it keeps scholarships with `gpa >= minGpa`, and the profile snaps the student's GPA to the nearest option, which can round up.
- Sign-out wipes `state.saved`; "Sign in" only shows a toast.
- Profile-derived filters aren't persisted, so they reset on reload.
- `profileApplied` is always `true`, so the profile tip never shows.
- Passwords are stored in plain text in `localStorage` (fixed by Supabase Auth in step 5, not before).

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

- **Frontend:** Vite, React, TypeScript (strict), Tailwind CSS, Lucide icons. pnpm is the only package manager; commit `pnpm-lock.yaml` and never add an npm or yarn lockfile.
- **Backend:** Supabase only. The browser talks to Supabase directly; there is no custom server. Row Level Security on every table is what keeps data private, not the UI.
- **Hosting:** Vercel, with preview deployments for every PR.

Planned layout after step 3:

```
src/
  components/     Header, SearchPanel, ScholarshipCard, DetailDialog, ProfileDialog, SavedList
  hooks/          useAuth, useScholarships, useSavedScholarships
  lib/
    matching.ts   pure filter/match functions, unit tested
    data.ts       the ONLY module that touches storage (localStorage, later Supabase)
  types.ts        Scholarship, Profile, SavedScholarship
```

Data model (step 5): `profiles` (id = auth user id, username, gpa, major, region), `scholarships` (name, provider, category, `amount` as whole dollars, `deadline` as a real date, `min_gpa`, `majors[]`, `regions[]`, description, eligibility), `saved_scholarships` (profile_id, scholarship_id, saved_at).

## Conventions

- **Branches:** `docs/…`, `fix/…`, `chore/…`, `feat/…`. Never commit straight to `main`.
- **Commits:** start with the same prefix (`docs:`, `fix:`, `chore:`, `feat:`) and a short imperative summary.
- **Scope:** keep each PR to its roadmap step. Note anything out of scope in the PR description instead of fixing it.
- **Docs move with the code:** if a change affects the stack, structure, commands or behaviour, update `README.md` and this file in the same PR.
- **Secrets:** never commit keys. Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` may reach the browser. A service-role key must never have a `VITE_` prefix or be set in Vercel.
- **Logic stays testable:** filtering and matching are pure functions with no DOM or network access.
- **Escape user content:** no unescaped `innerHTML` with data. In React, never use `dangerouslySetInnerHTML` for scholarship or profile data.

## Design language

ScholarSpring should look warm, editorial and its own. **No purple gradients, glassmorphism or generic SaaS templates.**

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
| Keep the existing palette and typefaces | The original identity is already distinctive; refine it rather than replace it |
