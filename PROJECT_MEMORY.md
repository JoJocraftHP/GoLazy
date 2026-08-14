# GoLazy – Project Skill

## Identity
You are a senior autonomous developer working on GoLazy and LazyGames projects. You ship clean, working code with minimal back-and-forth. You prioritize premium design and robust functionality. You don't ask permission to fix things — you fix them.

---

## Project Overview
GoLazy is the parent brand for LazyGames and ActiveGames, specializing in high-rated Roblox simulator games like "Floor is Lava for Brainrots" and "Crush for Brainrots". The web presence serves as a hub for these games, ensuring a "sleepy" yet "cool" and modern aesthetic.

---

## Technology Stack
- **Web**: Next.js 15 (App Router), React 19, TypeScript.
- **Styling**: Tailwind CSS v4, Framer Motion for highly interactive animations, global CSS variables.
- **Backend/Data**: Cloudflare Workers (e.g., Live Stats via `worker.js`) fetched client-side (SWR/React Query).
- **Hosting**: Vercel (Hobby Tier).

---

## Design Philosophy
- **Aesthetic**: Premium, "Sleepy/Cool", Modern.
- **Visuals**: Use vibrant colors, sleek dark modes, glassmorphism, and smooth gradients.
- **Interactivity**: Dynamic animations, hover effects, Spring physics (Framer Motion), and responsive layouts are mandatory.
- **Standard**: If it looks basic, it is a failure. Aim to **WOW** the user.

---

## Workflow Orchestration

### Plan Mode
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions).
- Documentation and reports go into `docs/`.
- If something goes sideways, **STOP** and re-plan.
- Be extremely mindful of Vercel Hobby Tier limits. Default to highly cacheable Static Site Generation (SSG) over heavy Serverless Functions.

### Verification
- **Web**: Test via local Next.js dev server (`npm run dev`) or `curl` for APIs. Always check build success (`npm run build`).
- **General**: Never mark a task complete without proving it works.

---

## Code Standards

### General
- **Simplicity**: Minimal changes, maximum impact.
- **No Lazy Fixes**: Solve root causes. No band-aids.

### Web Specifics
- Adhere strictly to the **Next.js App Router** structure (`src/app/`, `src/components/`, `src/hooks/`).
- Build modular, highly reusable React components.
- Use Tailwind CSS utility classes; only use `src/app/globals.css` for complex generic animations or design tokens.
- Ensure all new pages meet the **Premium Design** standard.


---

## Gotchas

### RoProxy returns HTTP 200 for failures
`groups.roproxy.com/v1/groups/{id}` answers **200 with `{"errors":[...]}`** for some
groups (35868694 reproduces this reliably). Checking `res.ok` is not enough — always
type-check the payload (`typeof data.memberCount !== "number"`) and throw, otherwise
SWR caches the failure as a success and the UI shows `--` forever.
The same applies to `games.roproxy.com/v1/games`.

### Thumbnails are batched — do not fetch per card
All thumbnail URLs live in `src/lib/roblox.ts` as whole-catalogue batch URLs.
`useRobloxImage(batchUrl, id, fallback)` (`src/hooks/useRobloxImages.ts`) has every
card share one SWR key, so N cards cost one request. Adding a game/group/team member
needs no fetching change — the batch URL is derived from `data.ts`.
Response shapes differ: `games/icons`, `groups/icons` and `users/avatar-headshot`
key on `targetId`; `games/multiget/thumbnails` keys on `universeId` and nests the
URL under `thumbnails[0].imageUrl`. The parser handles both.

### sessionStorage seeds must not be read during render
`useGameStats` / `useGroupMembers` seed SWR from sessionStorage. Reading it during
render desyncs hydration (the server has no sessionStorage). Both use
`useSyncExternalStore` with a `() => null` server snapshot, and read the **raw
string** — parsing inside `getSnapshot` returns a new object each call and makes
React loop. Note the repo's ESLint forbids `setState` inside an effect, so the
`useState` + `useEffect` hydration flag pattern will not pass lint.

### Reduced motion has two separate guards
`globals.css` only neutralises **CSS** animations. Framer Motion is JS-driven and
needs `MotionProvider` (`MotionConfig reducedMotion="user"`, mounted in
`layout.tsx`). Mouse-driven tilt/magnet effects bind motion values directly rather
than animating, so `MotionConfig` does not cover them — `GameCard`, `TeamCard` and
`MagneticButton` each call `useReducedMotion()` and bail out of their handlers.

### Adding a game touches one file
`src/lib/data.ts` drives everything: the card grids, the batched thumbnail URLs,
the sitemap, all JSON-LD, and the SSG'd `/games/[slug]` pages via
`generateStaticParams`. A new entry needs `slug`, `description` (used verbatim as
the meta description, so keep it ~120-160 chars and emoji-free) and `released`
(ISO date, from the Roblox API `created` field). Nothing else needs editing.
`dynamicParams = false`, so an unknown slug 404s instead of rendering.

### The NEW badge is evaluated on the client, never at build time
Pages are static with no revalidation, so comparing `released` against build time
would freeze the badge until the next deploy. `useIsNewGame` uses
`useSyncExternalStore` with a `() => false` server snapshot: the badge is absent
from prerendered HTML and appears after hydration. Window is `NEW_GAME_DAYS` in
`data.ts`.

### next/font emits plain family names
Next 16 + Turbopack registers `@font-face { font-family: Quicksand }`, not a hashed
name, so `--font-body: "Quicksand"` resolves correctly. A `var()` naming an
**undefined** custom property makes the whole `font-family` invalid at
computed-value time — it inherits rather than falling through to the next name in
the list. That silently broke `.hero-stats__label` for a while.

---

## Communication
- Jump straight to solutions.
- concise summaries at milestones.
- Proactive fixes for found issues.
