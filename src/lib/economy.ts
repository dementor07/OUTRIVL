import { DB } from './products';
import type { ClassKey, Product } from './types';
import { pad } from './format';

/**
 * The three economies. Each is a separate market with its own Throne, its own
 * standings and its own cap. This is the core of the model (brief §4): a later
 * drift toward many industry arenas was explicitly rejected, so category tags
 * are filters and metadata only and must never split an economy.
 */
export const CLASSES: { key: ClassKey; label: string; cap: string }[] = [
  { key: 'indie', label: 'INDIE', cap: 'CAP $50 / DAY' },
  { key: 'startup', label: 'STARTUP', cap: 'CAP $500 / DAY' },
  { key: 'open', label: 'OPEN', cap: 'NO PRACTICAL CAP' },
];

/** Daily spending caps, in dollars. Open has no practical ceiling. */
export const CAP_TOTAL: Record<ClassKey, number> = { indie: 50, startup: 500, open: 4000 };
/** Spend already committed today, per class. */
export const CAP_SPENT: Record<ClassKey, number> = { indie: 32, startup: 318, open: 1240 };

/** Guaranteed minimum widget starts sold with a position, per class. */
export const GUARANTEE: Record<ClassKey, string> = {
  indie: '800 STARTS',
  startup: '4,000 STARTS',
  open: '12,000 STARTS',
};

/** Ask price escalates 18% per takeover... */
export const ESCALATION_PER_TAKEOVER = 0.18;
/** ...and decays 0.8% per quiet minute, with a floor at 70% of the standing bid. */
export const DECAY_PER_QUIET_MINUTE = 0.008;
export const DECAY_FLOOR = 0.7;
/** Below this the throne reads VULNERABLE rather than DEFENDED. */
export const VULNERABLE_AT = 0.9;

/**
 * The live attack price (brief §5).
 *
 * Escalation makes a contested throne progressively expensive, so a bidding war
 * cannot be won purely by having the deepest pockets. Decay makes an
 * uncontested throne progressively cheap, so an incumbent cannot simply sit on
 * a position forever — the longer a reign stays quiet, the more affordable it
 * becomes to end it. The two together are what make timing legible.
 */
export function askFactors(takeovers: number, reignSec: number) {
  const quietMin = Math.floor(reignSec / 60);
  const escalation = 1 + ESCALATION_PER_TAKEOVER * takeovers;
  const decay = Math.max(DECAY_FLOOR, 1 - DECAY_PER_QUIET_MINUTE * quietMin);
  return { quietMin, escalation, decay, vulnerable: decay <= VULNERABLE_AT };
}

/** Resolve a product's current ask from its standing bid. */
export function askFor(id: string, escalation: number, decay: number): number {
  return Math.max(1, Math.round(DB[id].bid * escalation * decay));
}

/** The ranked ids competing in one economy, in current board order. */
export function classOrderFor(order: string[], klass: ClassKey): string[] {
  return order.filter((id) => DB[id].klass === klass);
}

/**
 * Season standings, ordered by Crown Points.
 *
 * Crown Points accrue from throne time weighted by a bounded Audience Score, so
 * the Champion is whoever held attention best across the season — not whoever
 * happens to hold the throne at this instant. The two genuinely diverge, and
 * showing both is the point: it is what lets a capped Indie product beat an
 * uncapped one on the record.
 */
export function standingsFor(classOrder: string[]): string[] {
  return classOrder.slice().sort((a, b) => DB[b].cp - DB[a].cp);
}

/** Crown Points banked per dollar spent. Published on purpose. */
export function efficiency(p: Product): number {
  return p.cp / p.spend;
}

/** Categories present within one economy, as filter chips. Never forks it. */
export function catsFor(classOrder: string[]): { key: string; label: string }[] {
  const seen = classOrder.map((id) => DB[id].cat).filter((c, i, a) => a.indexOf(c) === i);
  return [{ key: 'all', label: 'ALL' }, ...seen.map((c) => ({ key: c, label: c.toUpperCase() }))];
}

/**
 * Apply a category filter inside a class.
 *
 * The throne is the *class* throne and is pinned regardless of the filter — a
 * view narrowing the list must never appear to crown a different product.
 */
export function applyCatFilter(classOrder: string[], cat: string): string[] {
  const throneId = classOrder[0];
  if (!throneId) return [];
  const filtered = cat === 'all' ? classOrder : classOrder.filter((id) => DB[id].cat === cat);
  return [throneId, ...filtered.filter((id) => id !== throneId)];
}

/** Which of the six canvas sizes a rank earns. Rank is layout, not a badge. */
export function widgetStateForRank(i: number): 'THRONE' | 'FEATURE' | 'CARD' | 'ROW' {
  if (i === 0) return 'THRONE';
  if (i < 3) return 'FEATURE';
  if (i < 5) return 'CARD';
  return 'ROW';
}

/** `#03`-style rank label. */
export const rankLabel = (i: number): string => `#${pad(i + 1)}`;
