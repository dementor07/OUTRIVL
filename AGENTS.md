<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OUTRIVL

Read `docs/design-constitution.md` before changing anything visual. The approved
prototype is the visual contract — if a refactor changes a golden scene, treat
it as a regression unless the change was agreed first.

Two rules that are easy to break by accident:

- **Indie / Startup / Open are separate economies.** Categories are a filter
  within a class and must never fork it or move the throne.
- **Widgets carry the advertiser's brand,** not OUTRIVL's. The frame and the
  telemetry strip are ours; everything inside them is theirs.

All market numbers derive in one place, `src/state/derive.ts`. Add derived
values there rather than recomputing them per surface.
