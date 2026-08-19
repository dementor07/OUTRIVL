import type { Product, WidgetKit, FeedEvent } from './types';

/**
 * The roster. Eighteen products across the three economies, six apiece.
 *
 * Hardcoded fake data by design: the brief's build sequence keeps the market
 * on fixtures until the visual grammar is locked, and every figure here is
 * shaped to exercise a real case — Indie products that beat uncapped Open ones
 * on efficiency, a class where the King is not the Champion, founders who are
 * present and founders who are not.
 */
export const DB: Record<string, Product> = {
linear: { cp: 22400, spend: 3100, klass: 'startup', name: 'LINEAR', initial: 'L', category: 'SOFTWARE • PRODUCTIVITY', cat: 'Developer Tools', tagline: 'The issue tracker for high performance teams.', bid: 84, aud: '9.2', audD: '▲ 0.3', eng: '24.6K', engD: '▲ 12%', seed: 3, reign: '05:12:44', change: '▲ 9%', up: true, founder: { n: 'Kaya Ellison', i: 'KE', s: 'Ask me about the cycles model', h: 'TODAY 16:00–16:40 UTC', on: true }, opps: ['HIRING'] },
framer: { cp: 19800, spend: 2400, klass: 'startup', name: 'FRAMER', initial: 'F', category: 'DESIGN • NO-CODE', cat: 'Design', tagline: 'Design and ship sites without handing off.', bid: 72, aud: '8.7', audD: '▲ 0.2', eng: '18.3K', engD: '▲ 8%', seed: 7, reign: '02:41:09', change: '▲ 4%', up: true, founder: { n: 'Ines Valdek', i: 'IV', s: 'Happy to walk through the handoff flow', h: 'TODAY 18:30–19:00 UTC', on: true }, opps: ['SEEKING DESIGN PARTNER'] },
loom: { cp: 8900, spend: 1900, klass: 'startup', name: 'LOOM', initial: 'LM', category: 'COMMUNICATION', cat: 'Communication', tagline: 'Async video for people who ship.', bid: 33, aud: '7.0', audD: '▼ 1%', eng: '7.4K', engD: '▼ 1%', seed: 17, reign: '00:33:18', change: '▼ 1%', up: false, founder: null, opps: [] },
meridian: { cp: 15100, spend: 2050, klass: 'startup', name: 'MERIDIAN', initial: 'MD', category: 'ANALYTICS • DATA', cat: 'Analytics', tagline: 'Warehouse-native product analytics.', bid: 58, aud: '8.2', audD: '▲ 0.5', eng: '12.9K', engD: '▲ 7%', seed: 29, reign: '01:18:22', change: '▲ 7%', up: true, founder: { n: 'Owen Sarraf', i: 'OS', s: 'Hiring a founding data engineer', h: 'TOMORROW 15:00 UTC', on: false }, opps: ['HIRING', 'OPEN TO PARTNERSHIPS'] },
parabol: { cp: 10400, spend: 1450, klass: 'startup', name: 'PARABOL', initial: 'PB', category: 'DEVELOPER TOOLS', cat: 'Developer Tools', tagline: 'Retros that end with decisions, not vibes.', bid: 44, aud: '7.6', audD: '▲ 0.1', eng: '9.1K', engD: '▲ 3%', seed: 31, reign: '00:47:53', change: '▲ 3%', up: true, founder: null, opps: [] },
northwind: { cp: 6200, spend: 980, klass: 'startup', name: 'NORTHWIND', initial: 'NW', category: 'INFRASTRUCTURE', cat: 'Infrastructure', tagline: 'Edge queues without the operational tax.', bid: 31, aud: '6.9', audD: '▼ 0.2', eng: '5.8K', engD: '▼ 2%', seed: 37, reign: '00:19:41', change: '▼ 2%', up: false, founder: null, opps: [] },

superlist: { cp: 18420, spend: 320, klass: 'indie', name: 'SUPERLIST', initial: 'S', category: 'PRODUCTIVITY • SAAS', cat: 'Productivity', tagline: 'Lists, notes and tasks in one surface.', bid: 48, aud: '7.8', audD: '▼ 0.1', eng: '11.2K', engD: '▼ 3%', seed: 5, reign: '03:04:17', change: '▼ 3%', up: false, founder: { n: 'Mara Ostrow', i: 'MO', s: 'Ask me about the offline sync model', h: 'TODAY 14:00–14:30 UTC', on: true }, opps: ['LOOKING FOR COFOUNDER'] },
dub: { cp: 21400, spend: 210, klass: 'indie', name: 'DUB', initial: 'DD', category: 'DEVELOPER TOOLS', cat: 'Developer Tools', tagline: 'Link infrastructure for modern teams.', bid: 41, aud: '7.4', audD: '▲ 5%', eng: '9.6K', engD: '▲ 5%', seed: 9, reign: '01:47:11', change: '▲ 5%', up: true, founder: { n: 'Theo Aguer', i: 'TA', s: 'Shipping the analytics API this week', h: 'TODAY 17:00–17:45 UTC', on: true }, opps: ['HIRING'] },
raycast: { cp: 9600, spend: 260, klass: 'indie', name: 'RAYCAST', initial: 'R', category: 'PRODUCTIVITY', cat: 'Productivity', tagline: 'Everything you need, one keystroke away.', bid: 37, aud: '7.2', audD: '▼ 2%', eng: '8.1K', engD: '▼ 2%', seed: 13, reign: '00:59:32', change: '▼ 2%', up: false, founder: null, opps: [] },
sundial: { cp: 12800, spend: 180, klass: 'indie', name: 'SUNDIAL', initial: 'SD', category: 'TIME TRACKING', cat: 'Productivity', tagline: 'Timesheets that fill themselves in.', bid: 34, aud: '7.5', audD: '▲ 0.4', eng: '7.8K', engD: '▲ 9%', seed: 41, reign: '00:52:06', change: '▲ 9%', up: true, founder: { n: 'Priya Raman', i: 'PR', s: 'Solo founder — ask me anything', h: 'DAILY 09:00–09:30 UTC', on: true }, opps: ['LOOKING FOR COFOUNDER'] },
halfpipe: { cp: 7400, spend: 140, klass: 'indie', name: 'HALFPIPE', initial: 'HP', category: 'DESIGN', cat: 'Design', tagline: 'Motion presets for people who hate keyframes.', bid: 28, aud: '7.1', audD: '▲ 0.2', eng: '5.4K', engD: '▲ 4%', seed: 43, reign: '00:28:19', change: '▲ 4%', up: true, founder: null, opps: [] },
keystone: { cp: 4900, spend: 95, klass: 'indie', name: 'KEYSTONE', initial: 'KS', category: 'DEVELOPER TOOLS', cat: 'Developer Tools', tagline: 'Secrets management for two-person teams.', bid: 22, aud: '6.7', audD: '▼ 0.3', eng: '3.9K', engD: '▼ 1%', seed: 47, reign: '00:11:38', change: '▼ 1%', up: false, founder: null, opps: [] },

acme: { cp: 26100, spend: 12400, klass: 'open', name: 'ACME CORP', initial: 'A', category: 'E-COMMERCE • RETAIL', cat: 'Commerce', tagline: 'Storefronts that load before you blink.', bid: 61, aud: '8.1', audD: '▲ 0.4', eng: '14.8K', engD: '▲ 6%', seed: 11, reign: '06:22:51', change: '▲ 6%', up: true, founder: null, opps: ['OPEN TO PARTNERSHIPS'] },
vercel: { cp: 17300, spend: 9800, klass: 'open', name: 'VERCEL', initial: 'V', category: 'INFRASTRUCTURE', cat: 'Infrastructure', tagline: 'Ship the web, instantly.', bid: 29, aud: '6.8', audD: '▲ 2%', eng: '6.9K', engD: '▲ 2%', seed: 19, reign: '00:21:04', change: '▲ 2%', up: true, founder: null, opps: [] },
notion: { cp: 11200, spend: 8100, klass: 'open', name: 'NOTION', initial: 'N', category: 'PRODUCTIVITY', cat: 'Productivity', tagline: 'One workspace, every team.', bid: 26, aud: '6.5', audD: '▼ 1%', eng: '6.1K', engD: '▼ 1%', seed: 23, reign: '00:12:47', change: '▼ 1%', up: false, founder: null, opps: [] },
lumen: { cp: 21900, spend: 6400, klass: 'open', name: 'LUMEN', initial: 'LU', category: 'FINTECH', cat: 'Fintech', tagline: 'Treasury operations for operators, not banks.', bid: 126, aud: '8.4', audD: '▲ 0.6', eng: '19.7K', engD: '▲ 11%', seed: 53, reign: '02:09:33', change: '▲ 11%', up: true, founder: { n: 'Dana Whitmore', i: 'DW', s: 'Office hours on the reconciliation engine', h: 'TODAY 20:00–21:00 UTC', on: true }, opps: ['HIRING'] },
quanta: { cp: 13600, spend: 7200, klass: 'open', name: 'QUANTA', initial: 'QT', category: 'AI • INFRASTRUCTURE', cat: 'Infrastructure', tagline: 'Inference routing that picks the cheap model first.', bid: 94, aud: '7.9', audD: '▲ 0.2', eng: '13.2K', engD: '▲ 5%', seed: 59, reign: '01:33:12', change: '▲ 5%', up: true, founder: null, opps: [] },
orbital: { cp: 8100, spend: 5100, klass: 'open', name: 'ORBITAL', initial: 'OB', category: 'COMMERCE', cat: 'Commerce', tagline: 'Post-purchase logistics as one API call.', bid: 66, aud: '7.3', audD: '▼ 0.2', eng: '8.6K', engD: '▼ 2%', seed: 61, reign: '00:38:55', change: '▼ 2%', up: false, founder: null, opps: [] }
};

/** Stable id list in roster order. */
export const PRODUCT_IDS = Object.keys(DB);

/** The advertiser whose desk this app is: rank #03, indie class. */
export const MY_PRODUCT = 'sundial';

/**
 * Each product's interactive miniature. The widget demonstrates the product
 * rather than describing it — a task board actually moves cards, a storefront
 * actually moves merchandise through checkout.
 */
export const WIDGETS: Record<string, WidgetKit> = {
  sundial:   { lanes: ['RUNNING', 'TODAY', 'INVOICED'], labels: ['Client — brand refresh', 'Internal — standup', 'Client — API audit', 'Admin — expenses', 'Client — retainer'] },
  raycast:   { lanes: ['SUGGESTED', 'RECENT', 'PINNED'], labels: ['Search files', 'Clipboard history', 'Window layouts', 'Snippet expand', 'Quick calendar'] },
  halfpipe:  { lanes: ['PRESETS', 'IN SCENE', 'RENDERED'], labels: ['Spring in', 'Stagger reveal', 'Parallax drift', 'Elastic pop', 'Fade through'] },
  keystone:  { lanes: ['UNSEALED', 'ROTATING', 'SEALED'], labels: ['STRIPE_SECRET', 'DATABASE_URL', 'SENTRY_DSN', 'RESEND_KEY', 'UPSTASH_TOKEN'] },
  meridian:  { lanes: ['MODELLED', 'QUERYING', 'PUBLISHED'], labels: ['Activation funnel', 'Retention cohort', 'Revenue by plan', 'Churn signals', 'Weekly actives'] },
  parabol:   { lanes: ['TO DISCUSS', 'DISCUSSING', 'DECIDED'], labels: ['Deploys keep slipping', 'Retro cadence', 'On-call rotation', 'Flaky test suite', 'Docs ownership'] },
  loom:      { lanes: ['RECORDING', 'PROCESSING', 'SHARED'], labels: ['Sprint walkthrough', 'Bug repro', 'Design handoff', 'Customer call recap', 'Onboarding intro'] },
  northwind: { lanes: ['QUEUED', 'IN FLIGHT', 'DELIVERED'], labels: ['webhook/stripe', 'email/digest', 'index/rebuild', 'report/nightly', 'purge/expired'] },
  lumen:     { lanes: ['UNRECONCILED', 'MATCHING', 'CLEARED'], labels: ['ACH — 12,400', 'Wire — 88,910', 'Card batch — 3,205', 'Refund — 940', 'FX — 15,600'] },
  quanta:    { lanes: ['ROUTED', 'RUNNING', 'COMPLETE'], labels: ['haiku — classify', 'sonnet — summarise', 'haiku — extract', 'opus — reason', 'haiku — rerank'] },
  orbital:   { lanes: ['PACKED', 'IN TRANSIT', 'DELIVERED'], labels: ['ORD-4821 — Berlin', 'ORD-4822 — Lisbon', 'ORD-4823 — Leeds', 'ORD-4824 — Oslo', 'ORD-4825 — Cork'] },
  notion:    { lanes: ['INBOX', 'IN PROGRESS', 'ARCHIVE'], labels: ['Q3 planning doc', 'Meeting notes', 'Hiring pipeline', 'Design system', 'Team wiki'] },
superlist: { lanes: ['TODAY', 'THIS WEEK', 'DONE'], labels: ['Call the accountant', 'Draft launch email', 'Renew domain', 'Book flights', 'Pay invoices'] },
linear: { lanes: ['TODO', 'IN PROGRESS', 'DONE'], labels: ['Improve onboarding', 'Fix keyboard shortcuts', 'Landing page update', 'API rate limits', 'Cycle analytics'] },
acme: { lanes: ['CART', 'CHECKOUT', 'SHIPPED'], labels: ['Merino crew — M', 'Canvas tote', 'Field notebook', 'Enamel mug', 'Cotton cap'] },
dub: { lanes: ['DRAFT', 'ACTIVE', 'ARCHIVED'], labels: ['launch/hero', 'docs/quickstart', 'blog/pricing', 'social/x', 'careers/eng'] },
framer: { lanes: ['WIREFRAME', 'DESIGN', 'PUBLISHED'], labels: ['Pricing page', 'Case study', 'Careers', 'Blog index', 'Changelog'] },
vercel: { lanes: ['BUILDING', 'PREVIEW', 'PRODUCTION'], labels: ['feat/checkout', 'fix/hydration', 'chore/deps', 'feat/og-images', 'perf/edge'] }
};

/** The starting card set every miniature shares. */
export const INITIAL_CARDS = [
  { id: 'c1', label: 'Improve onboarding', col: 0 },
  { id: 'c2', label: 'Fix keyboard shortcuts', col: 1 },
  { id: 'c3', label: 'Landing page update', col: 2 },
  { id: 'c4', label: 'API rate limit handling', col: 0 },
  { id: 'c5', label: 'Add cycle analytics', col: 1 },
];

/**
 * The battle feed. Major events (a throne changing hands, a pool unlocking, a
 * founder arriving) carry metrics and render on the glass layer; routine market
 * chatter stays flat.
 */
export const FEED: FeedEvent[] = [
{ kind: 'THRONE TAKEN', big: true, time: '00:12', market: 'INDIE', title: 'SUPERLIST → DUB', dot: '#CFDA4F', body: 'Dub cleared the $41 ask and took the Indie throne. Superlist held for 3h 04m and banked 4,820 Crown Points on the way out.', metrics: [{ k: 'CLEARING BID', v: '$41', c: '#E9E0C4' }, { k: 'REIGN ENDED', v: '03:04:17', c: '#E9E0C4' }, { k: 'NEXT ASK', v: '$48', c: '#CFDA4F' }], f: 'takeover' },
{ kind: 'CHALLENGE', time: '01:04', market: 'STARTUP', title: 'Meridian challenged Linear', dot: '#7C63CB', body: 'Bid $58 against an ask of $84. The gap closes as the reign decays — currently 31% short.', f: 'challenge' },
{ kind: 'FOUNDER ONLINE', big: true, time: '01:22', market: 'INDIE', title: 'Mara Ostrow is at the Superlist booth', dot: '#7CC26B', body: 'Office hours open for 30 minutes. “Ask me about the offline sync model.” Questions are asynchronous and rate-limited.', metrics: [{ k: 'WINDOW', v: '30 MIN', c: '#7CC26B' }, { k: 'QUESTIONS', v: '14', c: '#E9E0C4' }], f: 'presence' },
{ kind: 'POOL UNLOCKED', big: true, time: '02:47', market: 'ALL', title: 'UNLOCK 01 — $5,000', dot: '#CFDA4F', body: 'Verified marketplace volume crossed the first milestone. The pool is funded and locked at the new tier; next unlock sits at 73%.', metrics: [{ k: 'POOL NOW', v: '$5,000', c: '#CFDA4F' }, { k: 'NEXT TIER', v: '$10,000', c: '#E9E0C4' }, { k: 'PROGRESS', v: '73%', c: '#A48FE6' }], f: 'pool' },
{ kind: 'LIVE LAUNCH', time: '03:15', market: 'OPEN', title: 'Lumen opens its reconciliation demo', dot: '#A48FE6', body: 'Scheduled launch window with the richer widget enabled for 60 minutes.', f: 'launch' },
{ kind: 'RANK MOVE', time: '04:02', market: 'INDIE', title: 'Sundial entered the top three', dot: '#E9E0C4', body: 'Audience Score up 0.4 on the week. Booth footprint on the Floor resized accordingly.', f: 'rank' },
{ kind: 'CHALLENGE', time: '05:31', market: 'OPEN', title: 'Quanta challenged Lumen', dot: '#7C63CB', body: 'Bid $94 against an ask of $126. Open market — no practical ceiling, but the efficiency figure is public.', f: 'challenge' },
{ kind: 'WIDGET', time: '06:18', market: 'STARTUP', title: 'Framer published version 7', dot: '#A48FE6', body: 'New spec passed schema validation in 1.2s. Running as an A/B variant against version 6.', f: 'widget' },
{ kind: 'RANK MOVE', time: '07:44', market: 'INDIE', title: 'Keystone fell to #06', dot: '#E05C42', body: 'Engagement down 1% over 24 hours with no active defence.', f: 'rank' }
];
