# OUTRIVL

A live attention market. Products compete for the top of their category, and the
prize is the largest interactive canvas on the page — the winner's actual
product runs inside it, in their own brand.

This repository is the **frontend**, built against the working product brief and
the approved design prototypes. It runs entirely on fixtures; there is no
backend yet.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Route | What it is |
| --- | --- |
| `/` | Public landing page |
| `/app` | The advertiser application |

## What's here

**The landing page** — hero with a live market pane, the four-step mechanic, a
draggable dethronement scrubber, an advertiser switcher that re-skins the live
widget, an ask-price simulator, the three economies, prize pool, Floor teaser,
pricing and FAQ.

**The app** — one MARKET surface with three views (Board / Floor / Ladder) over
the three economies, plus the advertiser's own desk:

- **Board** — throne slab with a live per-product widget, contender rows, ledger,
  and the 1240ms dethronement sequence
- **Floor** — the same ladder as a place; footprint is rank
- **Ladder** — the full record with Crown Points and CP-per-dollar
- **Your Product** — the permanent product page, in the advertiser's brand
- **Challenges** — bid composer with live gap-to-clear and cap metering
- **Widget Studio** — one spec re-rendered across all six canvas states
- **Insights** — the attention funnel, efficiency leaders, per-state performance
- **Battle Feed** and **Season** — the event tape and the progressive prize pool

## Stack

Next.js · React · TypeScript · Tailwind · Vitest, as specified in brief §17.
Deliberately **no** Supabase, Redis, auth or payments yet — the brief's build
sequence keeps infrastructure out until the visual grammar is locked, and every
number on screen comes from `src/lib/products.ts`.

## Layout

```
src/lib/        tokens, brand palettes, product roster, economy maths
src/state/      the store, the single derivation, landing interactions
src/components/ shell · market · product · desk · widget · ui
docs/           the brief and the design constitution
references/     the three approved golden plates
```

`src/state/derive.ts` is the one place every surface reads from. That is
deliberate: the market's numbers have to agree across the board, the ledger, the
floor and the desk, and earlier versions drifted precisely because each surface
recomputed its own answer to "who is the challenger".

## Tests

```bash
npm test        # economy maths
npm run lint
npm run typecheck
```

The tests cover the parts that are easy to break silently — class separation,
the throne staying pinned under a category filter, ask escalation and decay,
and the King/Champion split.

## Before changing the design

Read [`docs/design-constitution.md`](docs/design-constitution.md). The
approved prototype is the visual contract; if a refactor changes a golden scene,
that is a regression unless the change was agreed first.
