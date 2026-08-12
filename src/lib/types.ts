/** Domain types for the OUTRIVL market. */

/**
 * The three economies (brief §4). Each has its own Throne, its own standings,
 * its own season history and its own spending cap. Categories are a *view
 * filter* within a class and never fork the economy.
 */
export type ClassKey = 'indie' | 'startup' | 'open';

/** The six canvas sizes a listing can be rendered into. */
export type WidgetState =
  | 'ROW'
  | 'CARD'
  | 'FEATURE'
  | 'THRONE'
  | 'FLOOR_BOOTH'
  | 'PRODUCT_PAGE';

/** One market surface, three ways of looking at the same entity. */
export type MarketMode = 'board' | 'floor' | 'ladder';

export type ViewKey =
  | 'market'
  | 'product'
  | 'feed'
  | 'season'
  | 'challenges'
  | 'studio'
  | 'insights';

export interface Founder {
  /** Display name. */
  n: string;
  /** Initials for the presence dot. */
  i: string;
  /** What they're currently offering to talk about. */
  s: string;
  /** Office-hours window. */
  h: string;
  /** Present at the booth right now. */
  on: boolean;
}

export interface Product {
  /** Crown Points: throne time × bounded Audience Score (brief §6). */
  cp: number;
  /** Season-to-date spend, used for the public CP-per-dollar efficiency figure. */
  spend: number;
  klass: ClassKey;
  name: string;
  initial: string;
  /** Display category line, e.g. `SOFTWARE • PRODUCTIVITY`. */
  category: string;
  /** Filter key, e.g. `Developer Tools`. */
  cat: string;
  tagline: string;
  /** Standing bid in dollars, before escalation and decay. */
  bid: number;
  /** Audience Score. */
  aud: string;
  audD: string;
  /** Engagement. */
  eng: string;
  engD: string;
  /** Deterministic seed for this product's sparkline shape. */
  seed: number;
  reign: string;
  change: string;
  up: boolean;
  founder: Founder | null;
  /** Founder-declared opportunities: hiring, cofounder search, partnerships. */
  opps: string[];
}

/**
 * An advertiser's own visual identity. The widget carries *their* brand;
 * OUTRIVL owns only the frame around it and the telemetry footer.
 */
export interface Brand {
  bg: string;
  ink: string;
  dim: string;
  accent: string;
  line: string;
  font: string;
  radius: string;
  label: string;
}

export interface FeedEvent {
  kind: string;
  /** Big events render as glass; ordinary ones stay flat. */
  big?: boolean;
  time: string;
  market: string;
  title: string;
  dot: string;
  body: string;
  metrics?: { k: string; v: string; c: string }[];
  /** Filter key. */
  f: string;
}

/** A product's interactive miniature: lane names and the cards that move. */
export interface WidgetKit {
  lanes: [string, string, string];
  labels: string[];
}

export interface Card {
  id: string;
  label: string;
  col: number;
}
