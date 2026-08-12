import { mix } from './brands';
import { C } from './tokens';

/**
 * Landing-page advertiser brands.
 *
 * Three of the roster's products, carried with their own lane names and CTA
 * copy so the widget switcher on the marketing page demonstrates the real
 * claim: switch advertiser and the entire surface changes, because the kit
 * constrains structure and never colour or type.
 */
export interface LandingBrand {
  bg: string; ink: string; dim: string; accent: string; line: string;
  font: string; radius: string; label: string; cta: string; tagline: string;
  lanes: [string, string, string];
  labels: string[];
}

export const LANDING_BRANDS: Record<string, LandingBrand> = {
  superlist: {
    bg: '#07160F', ink: '#E8FBF1', dim: '#7BAF95', accent: '#35D98A', line: 'rgba(53,217,138,0.26)',
    font: "'Archivo', sans-serif", radius: '12px', label: 'Superlist', cta: 'Start free',
    tagline: 'Lists, notes and tasks in one surface.',
    lanes: ['Today', 'This week', 'Done'],
    labels: ['Call the accountant', 'Draft launch email', 'Renew the domain', 'Book flights for the demo', 'Pay open invoices'],
  },
  dub: {
    bg: '#05070E', ink: '#EAF1FF', dim: '#7086AC', accent: '#3B82F6', line: 'rgba(59,130,246,0.3)',
    font: "'JetBrains Mono', monospace", radius: '2px', label: 'Dub', cta: 'Create link',
    tagline: 'Link infrastructure for modern teams.',
    lanes: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
    labels: ['launch/hero', 'docs/quickstart', 'blog/pricing', 'social/x', 'careers/eng'],
  },
  halfpipe: {
    bg: '#140A1C', ink: '#F6ECFF', dim: '#A085BC', accent: '#C06BFF', line: 'rgba(192,107,255,0.3)',
    font: "'Archivo', sans-serif", radius: '16px', label: 'Halfpipe', cta: 'Open editor',
    tagline: 'Motion presets for people who hate keyframes.',
    lanes: ['Presets', 'In scene', 'Rendered'],
    labels: ['Spring in', 'Stagger reveal', 'Parallax drift', 'Elastic pop', 'Fade through'],
  },
};

export function landingBrand(key: string, tone: boolean): LandingBrand {
  const b = LANDING_BRANDS[key] ?? LANDING_BRANDS.superlist;
  if (!tone) return b;
  return {
    ...b,
    bg: mix(b.bg, C.ground, 0.62),
    ink: mix(b.ink, C.bone, 0.55),
    dim: mix(b.dim, C.ink, 0.6),
    accent: mix(b.accent, C.ink, 0.34),
    line: 'rgba(233,224,196,0.16)',
  };
}

export const LANDING_CARDS = [
  { id: 'c1', label: 'Call the accountant', col: 0 },
  { id: 'c2', label: 'Draft launch email', col: 1 },
  { id: 'c3', label: 'Renew the domain', col: 2 },
  { id: 'c4', label: 'Book flights for the demo', col: 0 },
  { id: 'c5', label: 'Pay open invoices', col: 1 },
];

export const HERO_STATS = [
  { value: '1,284', label: 'PRODUCTS LISTED' },
  { value: '312', label: 'THRONES CONTESTED' },
  { value: '31%', label: 'MEDIAN INTERACTION RATE' },
  { value: '$48', label: 'AVG CPM (30D)' },
];

export const HERO_LADDER = [
  { rank: '02', name: 'DUB', aud: '7.4', bid: '$41', hue: C.violet },
  { rank: '03', name: 'SUNDIAL', aud: '7.5', bid: '$34', hue: C.grey },
  { rank: '04', name: 'RAYCAST', aud: '7.2', bid: '$37', hue: C.grey },
  { rank: '05', name: 'HALFPIPE', aud: '7.1', bid: '$28', hue: C.grey },
];

export const TAPE = [
  { who: 'Dub', what: 'challenged Superlist for $41', color: C.violet },
  { who: 'Acme Corp', what: 'took the Open throne', color: C.rose },
  { who: 'Sundial', what: 'entered the top three', color: C.bone },
  { who: 'Linear', what: 'repelled 3 challenges', color: C.acid },
  { who: 'Raycast', what: 'lost 2% engagement', color: C.down },
];

export const STEPS = [
  { n: '01', hue: C.bone, title: 'LIST FOR FREE', foot: 'PERMANENT URL', body: 'Every product gets a permanent page, a rank and one interactive widget. No card, no contract, no minimum spend.' },
  { n: '02', hue: C.acid, title: 'READ THE ASK', foot: 'LIVE STATE VARIABLE', body: 'The throne carries a live price. It escalates with every takeover and decays through a quiet reign, so an idle king gets cheap to remove.' },
  { n: '03', hue: C.violet, title: 'TAKE THE THRONE', foot: 'INSTANT SETTLEMENT', body: 'Clear the ask and your widget expands into the #1 canvas immediately. The incumbent compresses on screen while it happens.' },
  { n: '04', hue: C.grey, title: 'HOLD IT', foot: 'SEASON SCORING', body: 'Crown Points accrue from throne time multiplied by Audience Score — a panel figure that money cannot buy. Season champion is a different race from current king.' },
];

export const WIDGET_FACTS = [
  { k: 'SPEC', v: 'Declarative WidgetSpec, validated server-side against a JSON schema.' },
  { k: 'SANDBOX', v: 'Signed runtime, capped budgets, no arbitrary advertiser JavaScript in the page.' },
  { k: 'FALLBACK', v: 'Every widget ships a static representation for reduced-motion and weak devices.' },
];

export const RENDER_STATES = [
  { key: 'ROW', size: '320×64', hue: C.grey, note: 'Ledger rank line. Mark, name, one metric.', bars: [{ h: '6px', w: '100%', c: '#2A2A2A' }, { h: '6px', w: '48%', c: '#3A3A3A' }] },
  { key: 'CARD', size: '320×220', hue: C.ink, note: 'Discovery tile with one live signal.', bars: [{ h: '26px', w: '100%', c: '#1E1E1E' }, { h: '6px', w: '72%', c: '#2A2A2A' }, { h: '6px', w: '40%', c: '#2A2A2A' }] },
  { key: 'FEATURE', size: '640×360', hue: C.violetLift, note: 'Contender slot. One real interaction enabled.', bars: [{ h: '34px', w: '100%', c: '#2A2340' }, { h: '8px', w: '86%', c: '#2A2A2A' }, { h: '8px', w: '54%', c: '#2A2A2A' }] },
  { key: 'THRONE', size: '960×520', hue: C.acid, note: 'The full canvas. The product runs in the page.', bars: [{ h: '46px', w: '100%', c: '#3D3F1E' }, { h: '10px', w: '100%', c: '#2A2A2A' }, { h: '10px', w: '68%', c: '#2A2A2A' }] },
  { key: 'FLOOR_BOOTH', size: 'SPATIAL', hue: C.violet, note: 'Idle until approached, then wakes and activates.', bars: [{ h: '16px', w: '44%', c: '#2A2340' }, { h: '16px', w: '70%', c: '#2A2340' }, { h: '8px', w: '30%', c: '#2A2A2A' }] },
  { key: 'PRODUCT_PAGE', size: 'PERMANENT', hue: C.bone, note: 'The canonical record. Same entity, full depth.', bars: [{ h: '12px', w: '60%', c: '#3A3A32' }, { h: '30px', w: '100%', c: '#1E1E1E' }, { h: '8px', w: '82%', c: '#2A2A2A' }] },
];

export const ECONOMIES = [
  { name: 'INDIE', cap: '$50', count: '486', hue: C.acid, border: C.acid, bg: '#0A0A06', king: 'SUPERLIST', ask: '$52', body: 'Solo makers and bootstrapped teams. A hard daily ceiling means the throne is won on widget quality, not treasury depth.' },
  { name: 'STARTUP', cap: '$500', count: '523', hue: C.violetLift, border: C.line, bg: C.ground, king: 'LINEAR', ask: '$84', body: 'Funded teams with a real budget line. Fast rotation, aggressive escalation, the most contested thrones on the platform.' },
  { name: 'OPEN', cap: 'NO CAP', count: '275', hue: C.bone, border: C.line, bg: C.ground, king: 'LUMEN', ask: '$126', body: 'Unbounded spend. Efficiency is still published — Crown Points per dollar exposes anyone buying a reign they cannot hold.' },
];

export const POOL_TIERS = [
  { label: 'GUARANTEED FLOOR', amount: '$2,500', status: 'FUNDED AT ANNOUNCE', dot: C.acid, labelColor: C.acid, amountColor: C.bone },
  { label: 'UNLOCK 01', amount: '$5,000', status: 'UNLOCKED — DAY 4', dot: C.acid, labelColor: C.acid, amountColor: C.bone },
  { label: 'UNLOCK 02', amount: '$10,000', status: '73% OF VERIFIED VOLUME', dot: C.fillAsh, labelColor: C.ink, amountColor: C.ink },
  { label: 'FINAL CAP', amount: '$25,000', status: 'HARD MAXIMUM — NEVER EXCEEDED', dot: C.line, labelColor: C.grey, amountColor: C.grey },
];

export const FLOOR_FACTS = [
  { g: '◆', t: 'The #1 installation takes the largest footprint and the richest booth treatment. Scale carries the status — no medieval props.' },
  { g: '◉', t: 'Environmental energy derives from real aggregated events: booth focus, widget starts, meaningful interaction. Never fake bustle.' },
  { g: '◍', t: 'FOUNDER ONLINE presence and scheduled office hours, opt-in and rate-limited. A team can be present without exposing a person.' },
  { g: '◈', t: 'A dethronement plays on the Floor in the same motion language as the Board: incumbent compresses, challenger expands.' },
];

export const FLOOR_PULSE = [
  { x: '24%', y: '22%', delay: '0s' }, { x: '36%', y: '34%', delay: '.7s' },
  { x: '68%', y: '20%', delay: '1.4s' }, { x: '54%', y: '62%', delay: '2.0s' },
];

export const BOOTHS = [
  { rank: '01', name: 'SUPERLIST', metric: 'AUD 7.8', hue: C.bone, border: 'rgba(233,224,196,0.35)', glow: 'radial-gradient(circle at 30% 20%, rgba(207,218,79,0.14), transparent 62%)', flex: '1 1 100%', minw: '200px', h: '148px', rankSize: '30px', nameSize: '16px', present: true },
  { rank: '02', name: 'DUB', metric: 'AUD 7.4', hue: C.violet, border: 'rgba(124,99,203,0.4)', glow: 'radial-gradient(circle at 40% 30%, rgba(124,99,203,0.13), transparent 66%)', flex: '1 1 46%', minw: '130px', h: '104px', rankSize: '20px', nameSize: '13px', present: true },
  { rank: '03', name: 'SUNDIAL', metric: 'AUD 7.5', hue: C.violet, border: 'rgba(124,99,203,0.28)', glow: 'none', flex: '1 1 46%', minw: '130px', h: '104px', rankSize: '20px', nameSize: '13px', present: true },
  { rank: '04', name: 'RAYCAST', metric: 'AUD 7.2', hue: C.grey, border: C.line, glow: 'none', flex: '1 1 30%', minw: '104px', h: '74px', rankSize: '15px', nameSize: '11px', present: false },
  { rank: '05', name: 'HALFPIPE', metric: 'AUD 7.1', hue: C.grey, border: C.line, glow: 'none', flex: '1 1 30%', minw: '104px', h: '74px', rankSize: '15px', nameSize: '11px', present: false },
  { rank: '06', name: 'KEYSTONE', metric: 'AUD 6.7', hue: C.grey, border: C.line, glow: 'none', flex: '1 1 30%', minw: '104px', h: '74px', rankSize: '15px', nameSize: '11px', present: false },
];

export interface Plan {
  name: string; monthly: string; yearly: string; hue: string; border: string; bg: string;
  featured: boolean; body: string; cta: string; ctaBg: string; ctaColor: string; ctaBorder: string;
  feats: { on: boolean; label: string }[];
}

export const PLANS: Plan[] = [
  {
    name: 'FREE', monthly: '$0', yearly: '$0', hue: C.bone, border: C.line, bg: C.ground, featured: false,
    body: 'Everything you need to be on the board and be beaten fairly.',
    cta: 'LIST A PRODUCT', ctaBg: 'transparent', ctaColor: C.bone, ctaBorder: C.line,
    feats: [
      { on: true, label: 'Permanent product page and rank' },
      { on: true, label: 'One approved interactive widget' },
      { on: true, label: 'Crown Points and season eligibility' },
      { on: true, label: '3 challenges per month' },
      { on: false, label: 'Widget version history' },
    ],
  },
  {
    name: 'PRO', monthly: '$29', yearly: '$23', hue: C.acid, border: C.acid, bg: '#0A0A06', featured: true,
    body: 'For teams actually running a market position week to week.',
    cta: 'START PRO', ctaBg: C.acid, ctaColor: C.ground, ctaBorder: C.acid,
    feats: [
      { on: true, label: 'Unlimited challenges' },
      { on: true, label: 'Widget Studio with all six render states' },
      { on: true, label: 'Version history and A/B variants' },
      { on: true, label: '90-day analytics window and CSV export' },
      { on: true, label: 'Founder presence and scheduled office hours' },
    ],
  },
  {
    name: 'CLOUD', monthly: '$99', yearly: '$79', hue: C.violetLift, border: C.line, bg: C.ground, featured: false,
    body: 'Managed widget authoring and generation credits on top of Pro.',
    cta: 'TALK TO US', ctaBg: 'transparent', ctaColor: C.violetLift, ctaBorder: C.violet,
    feats: [
      { on: true, label: 'Everything in Pro' },
      { on: true, label: 'AI-assisted widget authoring credits' },
      { on: true, label: 'Concierge widget build for launch' },
      { on: true, label: 'Priority non-security review lane' },
      { on: true, label: 'Custom share-card art direction' },
    ],
  },
];

export const FAQ = [
  { key: 'q1', q: 'Does spending money improve my rank?', a: 'It buys the throne slot, not the score. Audience Score comes from an independent evaluation panel and cannot be purchased. Crown Points multiply throne time by that score, so a bought reign with a weak product converts badly — and the efficiency figure is public.' },
  { key: 'q2', q: 'What stops a funded company from bulldozing everyone?', a: 'Class separation. Indie, Startup and Open are sealed economies with their own thrones, champions and daily ceilings. A $50/day market never meets a $50,000/day budget.' },
  { key: 'q3', q: 'Why does the ask price move on its own?', a: 'Escalation and decay. Every successful takeover raises the ask for the next challenger; every quiet minute of a reign decays it. An incumbent who stops defending becomes cheap to remove, which keeps thrones from calcifying.' },
  { key: 'q4', q: 'Does my widget have to look like OUTRIVL?', a: 'No — that would defeat the point. The kit constrains structure, interaction verbs and resource budgets. Colour, type, radius and layout are yours. Auto-tone is available if you want your placement to sit more quietly on the board, but it is opt-in per placement.' },
  { key: 'q5', q: 'Can people reach my real site from inside OUTRIVL?', a: 'Yes, through a bounded panel with visible OUTRIVL chrome — isolated frame, no shared storage, telemetry capped. It counts as one meaningful interaction, and the external CTA is tracked separately so you can see which one actually converts.' },
];

export const NAV_LINKS = [
  { href: '#mechanic', label: 'MECHANIC' },
  { href: '#takeover', label: 'TAKEOVER' },
  { href: '#widget', label: 'THE WIDGET' },
  { href: '#pool', label: 'PRIZE POOL' },
  { href: '#pricing', label: 'PRICING' },
];
