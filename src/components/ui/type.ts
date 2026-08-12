import type { CSSProperties } from 'react';
import { FONT } from '@/lib/tokens';

/**
 * Type helpers.
 *
 * The prototype writes every rule as a `font:` shorthand with an explicit
 * letter-spacing. These keep that exactness — the tracking on a 9px label is
 * load-bearing in this design, not a default — without repeating the family on
 * every element.
 */

type T = { w?: number; s: number; lh?: number; ls?: number; c?: string };

/** The working face: labels, metrics, tables, chrome. */
export function mono({ w = 400, s, lh, ls, c }: T): CSSProperties {
  return {
    fontFamily: FONT.mono,
    fontWeight: w,
    fontSize: `${s}px`,
    ...(lh !== undefined ? { lineHeight: lh } : null),
    ...(ls !== undefined ? { letterSpacing: `${ls}em` } : null),
    ...(c ? { color: c } : null),
  };
}

/** The bitmap display face: marks, numerals, headlines. */
export function display({ w = 700, s, lh, ls, c }: T): CSSProperties {
  return {
    fontFamily: FONT.display,
    fontWeight: w,
    fontSize: `${s}px`,
    ...(lh !== undefined ? { lineHeight: lh } : null),
    ...(ls !== undefined ? { letterSpacing: `${ls}em` } : null),
    ...(c ? { color: c } : null),
  };
}

/** Reading prose only. Never a label, never a numeral. */
export function text({ w = 400, s, lh, ls, c }: T): CSSProperties {
  return {
    fontFamily: FONT.text,
    fontWeight: w,
    fontSize: `${s}px`,
    ...(lh !== undefined ? { lineHeight: lh } : null),
    ...(ls !== undefined ? { letterSpacing: `${ls}em` } : null),
    ...(c ? { color: c } : null),
  };
}
