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

## Visual regression

The approved scenes are a visual contract, so they are kept as screenshot
fixtures — 27 captures covering every surface, both phone layouts, all six
widget render states and all four widget templates.

```bash
npm run test:visual           # compare against the committed baselines
npm run test:visual:update    # regenerate after an intended design change
```

Two things make the suite trustworthy rather than decorative:

- **It always builds.** The Playwright web server never reuses a running
  server. Reusing one silently compares new baselines against a stale build,
  which passes while the design is broken.
- **The tolerance is tight.** A percentage-based tolerance is the wrong shape:
  1% of a full-page capture is ~24,000 pixels, more than every acid-coloured
  element on the Board combined, so the suite would pass through an accent
  colour change. Captures are deterministic — animations frozen, live clocks
  masked — so the budget is a small absolute pixel count instead.

Baselines are per-platform (`tests/visual/__screenshots__/{platform}/`) because
font rendering differs across operating systems. Regenerate them deliberately,
never to turn a red run green.
