/** Zero-padded two-digit string: ranks, hours, counters. */
export const pad = (n: number): string => String(n).padStart(2, '0');

/** Seconds to HH:MM:SS. Reign clocks and the UTC clock both read this way. */
export const hms = (s: number): string =>
  `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;

/** Whole dollars. The market never shows cents. */
export const money = (n: number): string => `$${Math.round(n)}`;

/**
 * Deterministic sparkline points for a product.
 *
 * Seeded off the product so a given company's trace is stable across renders
 * and across surfaces — the same shape on the board, the ledger and the floor.
 */
export function spark(seed: number, n: number, amp = 11): string {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const v = Math.sin(i * 0.9 + seed) * 0.5 + Math.sin(i * 0.41 + seed * 2) * 0.5;
    pts.push(`${((i / (n - 1)) * 120).toFixed(1)},${(16 - v * amp).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Title-case a screaming product name for prose: `SUNDIAL` -> `Sundial`. */
export const soft = (name: string): string =>
  name.charAt(0) + name.slice(1).toLowerCase();

/** Deterministic bar heights for the small engagement histograms. */
export function bars(count: number, seed: number, base = 8, amp = 16): { h: string }[] {
  return Array.from({ length: count }, (_, k) => ({
    h: `${(base + Math.abs(Math.sin(k * 0.8 + seed)) * amp).toFixed(0)}px`,
  }));
}
