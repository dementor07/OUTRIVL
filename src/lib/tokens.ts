/**
 * OUTRIVL design tokens.
 *
 * Sampled from the approved golden plates and carried forward verbatim from the
 * approved prototype (`OUTRIVL.dc.html`). The prototype is the visual contract:
 * where it and the Visual Implementation Guide disagree, the prototype wins.
 */

export const C = {
  /** Page ground. Near-black, never pure #000. */
  ground: '#050505',
  /** Panel ground, one step off the page. */
  panel: '#08080A',
  panelAlt: '#0A0A0C',
  /** Selected/active nav and chip fill. */
  active: '#0F0F08',
  hover: '#111114',

  /** Hairline geometry. Every border in the system is 1px of one of these. */
  line: '#222222',
  lineSoft: '#18181B',
  lineDim: '#141414',
  lineDeep: '#1E1E1E',

  /** Bone — the reading ink and the king's accent. */
  bone: '#E9E0C4',
  /** Acid — reserved for the throne, live state and the primary CTA. */
  acid: '#CFDA4F',
  /** Violet — the challenger. */
  violet: '#7C63CB',
  violetLift: '#A48FE6',

  /** Text ladder. */
  ink: '#8E8877',
  grey: '#6E6E6E',
  greyDeep: '#4A4A4A',
  greyDeepest: '#3A3A3A',

  /** Market direction. */
  up: '#7CC26B',
  down: '#E05C42',
  rose: '#D05B78',

  /** Fills used inside meters and bar charts. */
  fillIdle: '#141414',
  fillWarm: '#1A1A12',
  fillOlive: '#3D3F1E',
  fillAsh: '#3A3A32',
  fillAshSoft: '#2A2A26',
  fillIndigo: '#4A3F6B',
} as const;

/**
 * Rank accents are semantic, not decorative (brief §24): the king reads bone,
 * the challenger violet, and everything below is field grey. There is no
 * rainbow ladder — colour here is information, not ornament.
 */
export const RANK_HUE = [C.bone, C.violet, C.grey, C.grey] as const;

export const FONT = {
  /** Display / numerals. The bitmap face, used at large sizes and for marks. */
  display: "'Silkscreen', monospace",
  /** The system's working face: labels, metrics, tables, chrome. */
  mono: "'JetBrains Mono', monospace",
  /** Ordinary reading prose only. Never labels, never numerals. */
  text: "'Archivo', sans-serif",
} as const;

/**
 * The glass layer marks what is *live and changeable* — the prize pool, founder
 * presence, a focused booth, the bid composer, major feed events. Flat panels
 * are the *settled record*. One recipe, not a range.
 */
export const GLASS = {
  bg: 'rgba(18,18,22,0.6)',
  blur: 'blur(18px) saturate(150%)',
  border: 'rgba(233,224,196,0.16)',
  shadow: 'inset 0 1px 0 rgba(233,224,196,0.12), 0 20px 48px rgba(0,0,0,0.55)',
} as const;

/** Shell metrics. */
export const SHELL = {
  rail: 216,
  topbar: 56,
  desk: 288,
  pageMargin: 20,
  /**
   * The desk drops beneath the canvas the moment the canvas can no longer seat
   * the slab's three columns. Derived, not picked: the slab needs
   * 208 numeral + 200 identity + 300 widget + 2×30 gap = 768, and the shell
   * spends 216 rail + 288 desk + 40 page margin + 56 slab padding = 600.
   */
  slabBreakpoint: 768 + 600 + 12,
} as const;

/** The 1240ms dethronement sequence, collapsed to 120ms under reduced motion. */
export const DETHRONE_MS = 1240;
export const DETHRONE_REDUCED_MS = 120;
