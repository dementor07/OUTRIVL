# OUTRIVL — Design Constitution

Distilled from the working product brief (§24–§29 and §35) and from the approved
prototype. **The prototype is the visual contract.** Where this document and the
built UI disagree, the built UI wins and this document is the thing that gets
amended.

---

## 1. The economy model is not negotiable

**Indie, Startup and Open are three separate economies.** Each has its own
Throne, its own standings, its own season history and its own daily spending
cap. A product competes in exactly one.

**Categories are a filter, never an economy.** `Developer Tools`, `Design`,
`Fintech` and the rest narrow the list *within* a class. They never fork it, and
the throne shown is always the class throne regardless of the active filter.

This inverted once during design and everything economic was built on the wrong
foundation as a result. If a change would give a category its own throne, the
change is wrong.

## 2. Rank is layout

`#1` receives the most physical canvas on the page. `#2` and `#3` are materially
smaller. Everything below collapses into dense rows. The tier cliff is the
design:

| Tier | Height | Canvas |
| --- | --- | --- |
| Throne | ~504px | Full interactive widget |
| Contender (02–04) | 78px | One intact row, seven fields |
| Ledger (05+) | 38px | Dense market line |

Rank must never be reduced to a badge beside identical cards. On the Floor the
same rule becomes floor space; in the Studio it becomes the six render states.

## 3. Products are the protagonists

The widget carries the **advertiser's** brand — their colour, type and corner
radius. OUTRIVL owns only the thin chrome bar above it and the telemetry strip
below. If every widget rendered in OUTRIVL violet, the ad would be OUTRIVL's
rather than the advertiser's, and the whole premise collapses.

**Auto-tone** pulls a brand toward the board palette. It is opt-in per
placement and never forced.

## 4. Colour is information

| Token | Value | Means |
| --- | --- | --- |
| Bone | `#E9E0C4` | Reading ink; the king |
| Acid | `#CFDA4F` | The throne, live state, the primary action |
| Violet | `#7C63CB` | The challenger |
| Grey | `#6E6E6E` | The field, labels, units |
| Green / Red | `#7CC26B` / `#E05C42` | Market direction only |

Accents are semantic, not decorative. There is no rank-hue ladder below `03` —
an earlier four-step rose/amber ladder was removed because it spent the accent
budget on ornament.

## 5. The glass layer

Glass marks what is **live and changeable**: the prize pool as it fills, founder
presence, a focused booth, an unplaced bid, a major feed event, validation on an
unpublished draft. Flat panels are the **settled record**.

One recipe, not a range:

```
background: rgba(18,18,22,0.6);
backdrop-filter: blur(18px) saturate(150%);
border: 1px solid rgba(233,224,196,0.16);
box-shadow: inset 0 1px 0 rgba(233,224,196,0.12), 0 20px 48px rgba(0,0,0,0.55);
```

Tint the border, never the fill. Never on table rows. Never nested. At most a
few per viewport.

## 6. Type

- **Silkscreen** — display. Marks, numerals, headlines. Advances ~0.8em per
  glyph, so long names need a size step-down rather than a wrap.
- **JetBrains Mono** — the working face. Labels, metrics, tables, all chrome.
- **Archivo** — reading prose only. Never a label, never a numeral.

Letter-spacing on small labels is load-bearing, not a default.

## 7. Motion is scarce and meaningful

Reserved for state changes: takeovers, rank expansion and compression, pool
unlocks, presence arriving. Routine browsing stays calm.

The dethronement is a **1240ms** authored sequence — flash, sweep, dither out,
rise, dither in, underline — collapsing to 120ms under reduced motion. Reduced
motion replays the same phases on a compressed clock; it never skips to the
result, because an invisible state change is worse than a fast one.

## 8. Not this

Named anti-patterns, all of which this design deliberately avoids:

- Gradient hero gradients as decoration; soft purple glow as a mood
- Rounded cards with drop shadows standing in for hierarchy
- Generic KPI tiles with no density behind them
- Pill overload, stock dashboard layouts, generic left sidebars
- A literal throne chair, crowns everywhere, swords, faux heraldry
- Beige cute-isometric treatment for the Floor — the mechanic reference plate is
  a **mechanic** inspiration only and must not be copied visually
- Reviewer notes written into the product ("SEPARATE ECONOMY · OWN THRONE").
  The UI states market state, not its own compliance.

Bloomberg is the information-density reference: tiny legible metrics, live tape,
sparklines, deltas, timestamps. It is not permission to copy Bloomberg visually.

## 9. Honesty rules that show up in the UI

These are product commitments the interface is obliged to keep visible:

- Spend buys the slot, never the standing. Audience Score cannot be purchased.
- Crown Points = throne time × bounded Audience Score. **King ≠ Champion**, and
  where they differ the UI says why.
- Efficiency (CP per dollar) is published, so a bought reign is legible as one.
- Floor pulses are aggregated real interactions. Never invented bustle.
- Prize tiers unlock from verified volume, never from an advertiser's own spend.
- Founder presence is opt-in and rate-limited.
