import { DB, FEED, MY_PRODUCT, WIDGETS } from '@/lib/products';
import {
  CAP_SPENT, CAP_TOTAL, CLASSES, GUARANTEE, applyCatFilter, askFactors, askFor,
  catsFor, classOrderFor, efficiency, standingsFor, widgetStateForRank,
} from '@/lib/economy';
import { bars, hms, money, pad, soft, spark } from '@/lib/format';
import { C, GLASS, RANK_HUE, SHELL } from '@/lib/tokens';
import { brand, cardBg, mix } from '@/lib/brands';
import type { OutrivlState } from './store';

/**
 * Everything the surfaces read, derived in one place from one state object.
 *
 * Keeping the derivation together is deliberate: the market's numbers have to
 * agree across the board, the ledger, the floor and the desk, and the earliest
 * versions of this app drifted precisely because each surface recomputed its
 * own version of "who is the challenger".
 */
/** Largest display size at which a name still holds one line in the slab. */
const IDENTITY_TRACK = 250;
const SILKSCREEN_ADVANCE = 0.8;
function nameSize(name: string): number {
  return Math.max(24, Math.min(42, Math.floor(IDENTITY_TRACK / (name.length * SILKSCREEN_ADVANCE))));
}

export function derive(state: OutrivlState) {
  const D = DB;
  const T = state.t;
  const active = T !== null;

  /** Quantised progress through a phase — the dither steps, not a smooth fade. */
  const stepv = (a: number, b: number, n: number) => {
    const p = Math.min(1, Math.max(0, ((T ?? 0) - a) / (b - a)));
    return Math.round(p * n) / n;
  };

  // ---- Economy -------------------------------------------------------------
  const ckey = state.klass;
  const classOrder = classOrderFor(state.order, ckey);
  const CATS = catsFor(classOrder);
  const catValid = CATS.some((c) => c.key === state.cat) ? state.cat : 'all';
  const throneId = classOrder[0];
  const order = applyCatFilter(classOrder, catValid);
  const activeClass = CLASSES.find((c) => c.key === ckey)!;

  const { quietMin, escalation, decay, vulnerable } = askFactors(state.takeovers, state.reignSec);
  const askN = askFor(throneId, escalation, decay);
  const ask = (id: string) => askFor(id, escalation, decay);

  const standings = standingsFor(classOrder);
  const championId = standings[0];
  const kingId = classOrder[0];
  const throne = D[order[0]];
  const challengerId = order[1] ?? null;
  const hasChallenger = !!challengerId;
  const incoming = D[state.incoming ?? challengerId ?? order[0]];

  const classes = CLASSES.map((c) => ({
    key: c.key,
    label: c.label,
    cap: c.cap,
    count: state.order.filter((id) => D[id].klass === c.key).length,
    bg: c.key === ckey ? C.active : 'transparent',
    bar: c.key === ckey ? C.acid : 'transparent',
    color: c.key === ckey ? C.acid : C.ink,
  }));

  const cats = CATS.map((c) => ({
    key: c.key,
    label: c.label,
    border: c.key === catValid ? C.acid : C.line,
    color: c.key === catValid ? C.acid : C.ink,
  }));

  // ---- Board ---------------------------------------------------------------
  const contenders = order.slice(1, 4).map((id, i) => {
    const p = D[id];
    const up = !String(p.audD).includes('▼');
    return {
      id,
      rank: pad(i + 2),
      hue: RANK_HUE[i + 1],
      initial: p.initial,
      name: p.name,
      category: p.category,
      audience: p.aud,
      audDelta: p.audD,
      audColor: up ? C.up : C.down,
      engagement: p.eng,
      engDelta: p.engD,
      engColor: String(p.engD).includes('▼') ? C.down : C.up,
      bid: `$${p.bid}`,
      spark: spark(p.seed, 14, 10),
      // The challenger compresses out of its row as it rises into the throne.
      shift: active && i === 0 ? `${-Math.min(1, Math.max(0, ((T ?? 0) - 420) / 200)) * 24}px` : '0px',
      bars: bars(10, p.seed),
    };
  });

  const ledger = order.slice(4).map((id, i) => {
    const p = D[id];
    return {
      id,
      rank: pad(i + 5),
      initial: p.initial,
      name: p.name,
      category: p.cat.toUpperCase(),
      audience: p.aud,
      engagement: p.eng,
      change: p.change,
      reign: p.reign,
      bid: `$${p.bid}`,
      color: p.up ? C.up : C.down,
      spark: spark(p.seed, 10, 8),
    };
  });

  // ---- Shell ---------------------------------------------------------------
  const view = state.view;
  const mine = D[MY_PRODUCT];
  const onMine = view === 'product' && state.productId === MY_PRODUCT;

  const navGroups = [
    {
      label: 'THE MARKET',
      items: [
        { key: 'market', glyph: '◆', title: 'MARKET', count: pad(classOrder.length), on: view === 'market' || (view === 'product' && !onMine) },
        { key: 'feed', glyph: '∿', title: 'BATTLE FEED', count: '24', on: view === 'feed' },
        { key: 'season', glyph: '✳', title: 'SEASON', count: '04', on: view === 'season' },
      ],
    },
    {
      label: 'YOUR DESK',
      items: [
        { key: 'mine', glyph: '▣', title: 'YOUR PRODUCT', count: mine.initial, on: onMine },
        { key: 'challenges', glyph: '⚡', title: 'CHALLENGES', count: '03', on: view === 'challenges' },
        { key: 'studio', glyph: '◈', title: 'WIDGET STUDIO', count: 'V4', on: view === 'studio' },
        { key: 'insights', glyph: '◕', title: 'INSIGHTS', count: '—', on: view === 'insights' },
      ],
    },
  ].map((g) => ({
    label: g.label,
    items: g.items.map((n) => ({
      ...n,
      bar: n.on ? C.acid : 'transparent',
      bg: n.on ? C.active : 'transparent',
      glyphColor: n.on ? C.acid : C.grey,
      titleColor: n.on ? C.bone : C.ink,
    })),
  }));

  const narrow = state.vw < SHELL.slabBreakpoint;
  const mobile = state.vw < SHELL.mobileBreakpoint;
  const p = D[state.productId] ?? D.framer;
  const pIndex = order.indexOf(state.productId);

  // ---- Challenges ----------------------------------------------------------
  const myId = classOrder[1] ?? classOrder[0];
  const chTargetId =
    state.chTargetId && D[state.chTargetId]?.klass === ckey ? state.chTargetId : throneId;
  const targetAsk = ask(chTargetId);
  const chFloorN = Math.round(targetAsk * 0.55);
  const chCeilN = Math.round(targetAsk * 1.65);
  const askStep = Math.round(((targetAsk - chFloorN) / (chCeilN - chFloorN)) * 19);
  const bidStep = state.chBidStep === null ? Math.max(0, askStep - 3) : state.chBidStep;
  const bidN = Math.round(chFloorN + (bidStep / 19) * (chCeilN - chFloorN));
  const clears = bidN >= targetAsk;
  const capTotal = CAP_TOTAL[ckey];
  const capSpent = CAP_SPENT[ckey];

  // ---- Brands --------------------------------------------------------------
  const BR = brand(throneId, state.autoTone);
  const siteId = state.focusId ?? throneId;
  const SBR = brand(siteId, state.autoTone);
  const PBR = brand(state.productId, state.autoTone);
  const focusId = state.focusId ?? throneId;
  const focus = D[focusId];

  const wkit = WIDGETS[throneId] ?? WIDGETS.linear;

  // One spec, six canvases. Each state is a different amount of room, not a
  // different design: the same widget compresses from a full throne canvas down
  // to a single ledger line without becoming a different product.
  const SC = {
    ROW:          { w: '540px', pad: '10px 12px', gap: '0px',  mark: '26px', markFont: '9px',  title: '12px', showSub: false, lanes: false, cols: 3, laneH: '0px',   strip: true,  foot: false, size: '320 × 64 — LEDGER LINE' },
    CARD:         { w: '340px', pad: '14px',      gap: '12px', mark: '34px', markFont: '11px', title: '14px', showSub: true,  lanes: false, cols: 3, laneH: '0px',   strip: true,  foot: false, size: '320 × 220 — DISCOVERY TILE' },
    FEATURE:      { w: '660px', pad: '16px',      gap: '14px', mark: '38px', markFont: '13px', title: '15px', showSub: true,  lanes: true,  cols: 2, laneH: '150px', strip: false, foot: true,  size: '640 × 360 — CONTENDER SLOT' },
    THRONE:       { w: '900px', pad: '20px',      gap: '16px', mark: '46px', markFont: '16px', title: '17px', showSub: true,  lanes: true,  cols: 3, laneH: '210px', strip: false, foot: true,  size: '960 × 520 — FULL CANVAS' },
    FLOOR_BOOTH:  { w: '420px', pad: '14px',      gap: '12px', mark: '32px', markFont: '11px', title: '13px', showSub: false, lanes: true,  cols: 1, laneH: '132px', strip: false, foot: false, size: 'SPATIAL — WAKES ON APPROACH' },
    PRODUCT_PAGE: { w: '780px', pad: '18px',      gap: '14px', mark: '40px', markFont: '14px', title: '16px', showSub: true,  lanes: true,  cols: 3, laneH: '176px', strip: false, foot: true,  size: 'PERMANENT — CANONICAL RECORD' },
  } as const;
  const sc = SC[state.studioState] ?? SC.THRONE;

  return {
    // shell
    navGroups, classes, cats, narrow, mobile,
    railOpen: state.railOpen,
    shellDir: narrow ? ('column' as const) : ('row' as const),
    deskFlex: narrow ? '1 1 auto' : `0 0 ${SHELL.desk}px`,
    deskBorderLeft: narrow ? '0' : `1px solid ${C.line}`,
    deskBorderTop: narrow ? `1px solid ${C.line}` : '0',
    marketNote: `${classOrder.length} RANKED IN ${activeClass.label} · ${activeClass.cap}`,
    marketNoteDisplay: narrow ? 'none' : 'flex',
    crumb:
      view === 'product'
        ? `HOME  >  PRODUCTS  >  ${p.name}`
        : `OUTRIVL / ${activeClass.label} / ${
            ({
              market: { board: 'THE THRONE', floor: 'THE FLOOR', ladder: 'THE LADDER' }[state.marketMode],
              challenges: 'CHALLENGES',
              feed: 'BATTLE FEED',
              insights: 'INSIGHTS',
              studio: 'WIDGET STUDIO',
              season: 'SEASON 04',
            } as Record<string, string>)[view] ?? 'THE THRONE'
          }`,
    utc: `${hms(state.clock % 86400)} UTC`,
    reign: hms(state.reignSec),

    isBoard: view === 'market' && state.marketMode === 'board',
    isFloor: view === 'market' && state.marketMode === 'floor',
    isLadder: view === 'market' && state.marketMode === 'ladder',
    isProduct: view === 'product',
    isChallenges: view === 'challenges',
    isFeed: view === 'feed',
    isInsights: view === 'insights',
    isStudio: view === 'studio',
    isSeason: view === 'season',

    marketModes: [
      { key: 'board', label: 'BOARD', note: 'THE TRADING VIEW' },
      { key: 'floor', label: 'FLOOR', note: 'THE EXHIBITION' },
      { key: 'ladder', label: 'LADDER', note: 'THE FULL RECORD' },
    ].map((m) => ({
      ...m,
      bg: m.key === state.marketMode ? C.active : 'transparent',
      border: m.key === state.marketMode ? C.acid : C.line,
      color: m.key === state.marketMode ? C.acid : C.ink,
      noteColor: m.key === state.marketMode ? C.ink : C.greyDeepest,
    })),

    // your position, carried through the desk
    myName: mine.name,
    myInitial: mine.initial,
    myRank: `#${pad(state.order.filter((id) => D[id].klass === mine.klass).indexOf(MY_PRODUCT) + 1)}`,
    myClassLabel: CLASSES.find((c) => c.key === mine.klass)!.label,
    offMarket: mine.klass !== ckey,
    offMarketNote:
      mine.klass !== ckey
        ? `You are spectating ${activeClass.label}. ${mine.name} competes in ${CLASSES.find((c) => c.key === mine.klass)!.label}.`
        : '',

    // throne
    throneName: throne.name,
    throneNameSoft: soft(throne.name),
    throneInitial: throne.initial,
    throneCategory: throne.category,
    throneTagline: throne.tagline,
    throneSpark: spark(throne.seed, 16, 11),
    // Silkscreen advances ~0.8em per glyph, so a long name at the display size
    // overruns the identity column. Step the size down by length rather than
    // wrapping: the name holding one line is what makes the throne read as one
    // object instead of a paragraph.
    throneNameSize: nameSize(throne.name),
    incomingNameSize: nameSize(incoming.name),
    throneAud: throne.aud,
    throneAudD: throne.audD,
    throneAudColor: String(throne.audD).includes('▼') ? C.down : C.up,
    throneEng: throne.eng,
    throneEngD: throne.engD,
    throneEngColor: String(throne.engD).includes('▼') ? C.down : C.up,
    incomingName: incoming.name,
    incomingInitial: incoming.initial,
    incomingCategory: incoming.category,
    engBars: Array.from({ length: 18 }, (_, k) => ({
      h: `${(6 + Math.abs(Math.sin(k * 0.7 + 2)) * 26).toFixed(0)}px`,
    })),

    // the 1240ms settlement, phase by phase
    active,
    flashOp: active && (T ?? 0) < 90 ? 1 : 0,
    sweepTop: `${active && (T ?? 0) >= 80 && (T ?? 0) < 240 ? (((T ?? 0) - 80) / 160) * 100 : -12}%`,
    outOp: !active ? 1 : (T ?? 0) < 240 ? 1 : 1 - stepv(240, 420, 6),
    inOp: !active ? 0 : (T ?? 0) < 600 ? 0 : stepv(600, 780, 6),
    underline: `${!active || (T ?? 0) < 780 ? 0 : Math.min(1, ((T ?? 0) - 780) / 120) * 100}%`,
    ctaLabel: active ? 'TAKING THE THRONE…' : 'TAKE THE THRONE',

    // ask price
    askPrice: `$${askN}`,
    askTrend: state.takeovers > 0 && quietMin < 12 ? '▲ ESCALATED' : '▼ DECAYING',
    askTrendColor: state.takeovers > 0 && quietMin < 12 ? C.down : C.up,
    askDelta:
      state.takeovers > 0 && quietMin < 12
        ? `+${Math.round((escalation - 1) * 100)}% AFTER ${pad(state.takeovers)} TAKEOVER${state.takeovers > 1 ? 'S' : ''}`
        : `-${Math.round((1 - decay) * 100)}% THROUGH A QUIET REIGN`,
    vulnLabel: vulnerable ? 'VULNERABLE' : 'DEFENDED',
    vulnColor: vulnerable ? C.down : C.up,

    // king vs champion — genuinely different in Indie, and shown as such
    kingName: D[kingId].name,
    championName: D[championId].name,
    championSplit: championId !== kingId,
    champion: D[championId].name,
    championCP: D[championId].cp.toLocaleString(),
    standings: standings.slice(0, 3).map((id, i) => ({
      rank: pad(i + 1),
      name: D[id].name,
      cp: D[id].cp.toLocaleString(),
      eff: efficiency(D[id]).toFixed(1),
      isKing: id === kingId ? C.acid : 'transparent',
      color: i === 0 ? C.bone : C.ink,
    })),

    hasChallenger,
    hasContenders: order.length > 1,
    noContenders: order.length <= 1,
    hasLedger: order.length > 4,
    challengeCopy: hasChallenger
      ? `Be the next to outrivl ${soft(throne.name)}. Your ad will take over the #1 position on the throne.`
      : 'No challenger holds a position in this market. Open the throne by placing the first bid above the ask.',
    topChallengerName: hasChallenger ? D[challengerId!].name : '—',
    topChallengerInitial: hasChallenger ? D[challengerId!].initial : '—',
    topChallengerBid: hasChallenger ? `$${D[challengerId!].bid}` : '$0',
    emptyRule:
      'This market has one ranked product. Contenders appear the moment a second product is listed or a challenge clears the ask.',
    guaranteeImps: GUARANTEE[ckey],
    spentToday: money(capSpent),
    capRemaining: ckey === 'open' ? 'UNCAPPED' : money(capTotal - capSpent),

    contenders, ledger,
    classOrder, order, throneId, challengerId, activeClass, myId,
    askN, escalation, decay, vulnerable, ask,

    reignRecord: [
      { label: 'CHALLENGES REPELLED', value: '12', sep: '#2A2A2A' },
      { label: 'PEAK REIGN', value: '41H 12M', sep: '#2A2A2A' },
      { label: 'TAKEOVERS', value: pad(state.takeovers + 3), sep: 'transparent' },
    ],

    // the throne's own advertiser-branded canvas
    brandThrone: BR,
    brandThroneCard: cardBg(BR),
    throneMoves: pad(state.moves),
    throneLanes: [0, 1, 2].map((k) => ({
      key: k,
      name: wkit.lanes[k],
      items: state.cards
        .filter((c) => c.col === k)
        .map((c) => ({ id: c.id, label: wkit.labels[Number(c.id.slice(1)) - 1] ?? c.label })),
      count: state.cards.filter((c) => c.col === k).length,
    })),
    autoToneLabel: state.autoTone ? 'ON' : 'OFF',
    autoToneColor: state.autoTone ? C.acid : C.grey,
    autoToneBorder: state.autoTone ? C.acid : C.line,
    autoToneDot: state.autoTone ? C.acid : '#2A2A2A',

    // bounded live-site panel
    siteOpen: state.siteOpen,
    site: SBR,
    siteCardBg: cardBg(SBR),
    siteUrl: `https://${SBR.label.toLowerCase().replace(/\s+/g, '')}.com`,
    siteTagline: D[siteId].tagline,
    siteNav: ['Product', 'Pricing', 'Docs', 'Changelog'],
    siteCells: [
      { t: 'Built for speed', b: 'Every interaction resolves in under 100ms.' },
      { t: 'Made for teams', b: 'Shared context without the meeting tax.' },
      { t: 'Yours to own', b: 'Export everything, any time, no lock-in.' },
    ],

    // product page
    product: p,
    brandProduct: PBR,
    brandProductCard: cardBg(PBR),
    pName: p.name,
    pNameSoft: soft(p.name),
    pInitial: p.initial,
    pCategory: p.category,
    pCategorySoft: p.cat,
    pTagline: p.tagline,
    pRank: `#${pad(pIndex < 0 ? 2 : pIndex + 1)}`,
    pNameSize: `clamp(${Math.max(22, Math.min(34, nameSize(p.name)))}px, 8vw, 52px)`,
    pHue: RANK_HUE[Math.min(3, pIndex < 0 ? 1 : pIndex)],
    pAbout: `${soft(p.name)} is built for speed and clarity. Everything is fast, minimal, and thoughtfully designed so you can stay in flow and ship great work.`,
    pAsk: money(ask(state.productId)),
    upvotes: `${(state.upvotes / 1000).toFixed(1)}K`,
    tabs: [
      { key: 'overview', label: 'OVERVIEW' },
      { key: 'performance', label: 'PERFORMANCE' },
      { key: 'discussion', label: 'DISCUSSION 128' },
      { key: 'updates', label: 'UPDATES 7' },
      { key: 'team', label: 'TEAM' },
    ].map((t) => ({
      ...t,
      color: t.key === state.tab ? C.bone : C.grey,
      bar: t.key === state.tab ? C.acid : 'transparent',
    })),
    founderInitial: p.founder ? p.founder.i : p.initial,
    founderName: p.founder ? p.founder.n : `${p.name} TEAM`,
    founderState: p.founder?.on ? 'FOUNDER ONLINE' : 'TEAM AWAY',
    founderStateColor: p.founder?.on ? C.up : C.ink,
    founderStatus: p.founder
      ? p.founder.s
      : 'Questions are answered asynchronously, usually within a day.',
    founderHours: p.founder ? p.founder.h : 'NO WINDOW SCHEDULED',
    opportunities: p.opps.map((o) => ({ label: o, color: C.violetLift, border: 'rgba(124,99,203,0.45)' })),
    shareLine: `Ranked #${pad(pIndex < 0 ? 2 : pIndex + 1)} in ${activeClass.label} · ${p.tagline}`,
    cpmSeries: spark(4, 26, 9)
      .split(' ')
      .map((pt, i, arr) => `${((i / (arr.length - 1)) * 240).toFixed(1)},${(Number(pt.split(',')[1]) * 3.4).toFixed(1)}`)
      .join(' '),
    rankSeries: spark(6, 24, 8)
      .split(' ')
      .map((pt, i, arr) => `${((i / (arr.length - 1)) * 240).toFixed(1)},${(110 - Number(pt.split(',')[1]) * 3.2).toFixed(1)}`)
      .join(' '),

    // marquee tape
    feed: [
      { who: 'Framer', what: 'challenged Linear for $72', color: C.violet },
      { who: 'Acme Corp', what: 'overtook Superlist', color: C.rose },
      { who: 'Dub', what: 'moved up to #5', color: C.bone },
      { who: 'Raycast', what: 'lost 2% engagement', color: C.down },
    ],
    activeBattles: 23,

    // focus / floor
    focusId,
    focus,
    focusInitial: focus.initial,
    focusName: focus.name,
    focusRank: `#${pad(classOrder.indexOf(focusId) + 1)}`,
    focusPitch: `${focus.tagline} Approach the booth to wake it; activate to run the real widget inside the installation without leaving the Floor.`,
    focusPresent: !!focus.founder?.on,
    focusPresenceStatus: focus.founder?.on ? focus.founder.s : '',
    focusStats: [
      { k: 'AUDIENCE', v: focus.aud, c: C.bone },
      { k: 'ENGAGEMENT', v: focus.eng, c: C.bone },
      { k: 'ASK', v: money(ask(focusId)), c: C.acid },
      { k: 'CP / $', v: efficiency(focus).toFixed(1), c: C.violetLift },
    ],

    // challenges desk
    chStats: [
      { label: 'OPEN CHALLENGES', value: '03', note: `IN ${activeClass.label}`, color: C.bone },
      { label: 'YOUR POSITION', value: `#${pad(classOrder.indexOf(myId) + 1)}`, note: D[myId].name, color: C.bone },
      { label: 'CURRENT ASK', value: money(askN), note: vulnerable ? 'VULNERABLE' : 'DEFENDED', color: C.acid },
      { label: 'CHALLENGES LEFT', value: '03', note: 'PRO PLAN', color: C.violetLift },
    ],
    chOpen: classOrder.slice(1, 4).map((id, i) => {
      const q = D[id];
      const a = ask(throneId);
      const ratio = Math.min(1, q.bid / a);
      return {
        initial: q.initial,
        name: q.name,
        hue: i === 0 ? C.violet : C.ink,
        bar: i === 0 ? C.violet : C.line,
        direction: i === 0 ? 'INCOMING — AGAINST YOUR POSITION' : `OUTGOING — AGAINST ${D[throneId].name}`,
        market: `${activeClass.label} · ${q.cat.toUpperCase()}`,
        bid: money(q.bid),
        ask: money(a),
        gapSegs: Array.from({ length: 12 }, (_, k) => ({
          fill: k < Math.round(ratio * 12) ? (ratio >= 1 ? C.acid : C.violet) : C.fillIdle,
        })),
        state: ratio >= 1 ? 'CLEARS' : 'PENDING',
        stateColor: ratio >= 1 ? C.acid : C.ink,
        stateBorder: ratio >= 1 ? C.acid : C.line,
        age: ['12m ago', '41m ago', '2h ago'][i],
      };
    }),
    chTargets: classOrder.slice(0, 3).map((id, i) => ({
      key: id,
      rank: pad(i + 1),
      name: D[id].name,
      ask: money(ask(id)),
      hue: id === chTargetId ? C.acid : RANK_HUE[Math.min(3, i)],
      nameColor: id === chTargetId ? C.bone : C.ink,
      bg: id === chTargetId ? 'rgba(207,218,79,0.09)' : 'rgba(8,8,10,0.6)',
    })),
    chBid: money(bidN),
    chBidStep: bidStep,
    chBidSegs: Array.from({ length: 20 }, (_, k) => ({
      key: k,
      fill: k <= bidStep ? (clears ? C.acid : C.violet) : k === askStep ? C.fillOlive : C.fillIdle,
    })),
    chFloor: money(chFloorN),
    chAsk: money(targetAsk),
    chCeiling: money(chCeilN),
    chClear: clears ? 'YES — SETTLES INSTANTLY' : 'NO — HELD AS PENDING',
    chClearColor: clears ? C.up : C.down,
    chTerms: [
      { k: 'GUARANTEED MINIMUM', v: GUARANTEE[ckey], c: C.bone },
      {
        k: 'CAP AFTER THIS BID',
        v: capTotal - capSpent - bidN > 0 ? `${money(capTotal - capSpent - bidN)} LEFT` : 'CAP REACHED',
        c: capTotal - capSpent - bidN > 0 ? C.bone : C.down,
      },
      { k: 'CROWN POINTS EFFECT', v: 'NONE', c: C.violetLift },
    ],
    chCta: active ? 'TAKING THE THRONE…' : clears ? 'PLACE CHALLENGE — CLEARS ASK' : 'PLACE PENDING CHALLENGE',
    capClassLabel: activeClass.label,
    capSegs: Array.from({ length: 20 }, (_, k) => ({
      fill: k < Math.round((capSpent / capTotal) * 20) ? C.acid : C.fillIdle,
    })),
    chHistory: [
      { when: 'TODAY 09:14', target: D[throneId].name, market: activeClass.label, bid: money(ask(throneId) - 4), held: '03:04:17', cp: '4,820', outcome: 'REPELLED', color: C.down },
      { when: 'TODAY 04:02', target: D[myId].name, market: activeClass.label, bid: money(D[myId].bid), held: '01:47:11', cp: '2,140', outcome: 'TOOK THRONE', color: C.up },
      { when: 'YDAY 22:30', target: 'MERIDIAN', market: 'STARTUP', bid: '$58', held: '01:18:22', cp: '1,910', outcome: 'TOOK THRONE', color: C.up },
      { when: 'YDAY 18:47', target: 'LUMEN', market: 'OPEN', bid: '$118', held: '—', cp: '0', outcome: 'OUTBID', color: C.down },
      { when: 'YDAY 11:05', target: 'SUNDIAL', market: 'INDIE', bid: '$34', held: '00:52:06', cp: '980', outcome: 'TOOK THRONE', color: C.up },
      { when: '2D AGO 20:12', target: 'HALFPIPE', market: 'INDIE', bid: '$26', held: '—', cp: '0', outcome: 'WITHDRAWN', color: C.ink },
    ],

    // feed
    feedRate: '24 EVENTS / HR',
    feedFilters: [
      { key: 'all', label: 'ALL' }, { key: 'takeover', label: 'TAKEOVERS' },
      { key: 'challenge', label: 'CHALLENGES' }, { key: 'presence', label: 'PRESENCE' },
      { key: 'pool', label: 'PRIZE POOL' }, { key: 'rank', label: 'RANK MOVES' },
    ].map((f) => ({
      ...f,
      border: f.key === state.feedFilter ? C.acid : C.line,
      color: f.key === state.feedFilter ? C.acid : C.ink,
    })),
    feedEvents: FEED.filter((e) => state.feedFilter === 'all' || e.f === state.feedFilter).map((e) => ({
      ...e,
      kindColor: e.dot,
      titleSize: e.big ? '15px' : '13px',
      border: e.big ? GLASS.border : C.lineSoft,
      bg: e.big ? GLASS.bg : C.panel,
      blur: e.big ? GLASS.blur : 'none',
      shadow: e.big ? GLASS.shadow : 'none',
      pad: e.big ? '18px' : '14px',
      metrics: e.metrics ?? [],
    })),
    feedCounters: [
      { label: 'THRONES TAKEN', value: '07', color: C.acid },
      { label: 'CHALLENGES PLACED', value: '31', color: C.bone },
      { label: 'WIDGET STARTS', value: '184.2K', color: C.bone },
      { label: 'MEANINGFUL INTERACTIONS', value: '57.1K', color: C.violetLift },
      { label: 'CROWN POINTS AWARDED', value: '48,910', color: C.bone },
    ],
    contested: [
      { name: 'INDIE · PRODUCTIVITY', count: '14', w: '100%' },
      { name: 'STARTUP · DEVELOPER TOOLS', count: '11', w: '78%' },
      { name: 'OPEN · FINTECH', count: '06', w: '42%' },
    ],
    presenceList: Object.keys(D)
      .filter((id) => D[id].founder?.on)
      .slice(0, 4)
      .map((id) => ({
        initial: D[id].founder!.i,
        who: `${D[id].founder!.n} · ${D[id].name}`,
        status: D[id].founder!.s,
      })),

    // ladder
    ladderClass: activeClass.label,
    podium: classOrder.slice(0, 3).map((id, i) => {
      const q = D[id];
      return {
        id,
        rank: pad(i + 1),
        name: q.name,
        category: q.category,
        flex: i === 0 ? '2 1 380px' : '1 1 260px',
        rankSize: i === 0 ? '48px' : '30px',
        nameSize: i === 0 ? '30px' : '20px',
        hue: i === 0 ? C.bone : C.violet,
        border: i === 0 ? 'rgba(233,224,196,0.26)' : 'rgba(124,99,203,0.34)',
        bg: i === 0 ? 'rgba(20,20,16,0.6)' : 'rgba(16,14,22,0.55)',
        shadow: i === 0
          ? 'inset 0 1px 0 rgba(233,224,196,0.14), 0 26px 64px rgba(0,0,0,0.65)'
          : 'inset 0 1px 0 rgba(164,143,230,0.14), 0 20px 50px rgba(0,0,0,0.6)',
        glow: i === 0
          ? 'radial-gradient(circle at 22% 12%, rgba(207,218,79,0.16), transparent 62%)'
          : i === 1
            ? 'radial-gradient(circle at 30% 15%, rgba(124,99,203,0.14), transparent 66%)'
            : 'none',
        badge: i === 0 ? (id === championId ? 'KING & CHAMPION' : 'KING NOW') : i === 1 ? 'CHALLENGER' : 'CONTENDER',
        badgeColor: i === 0 ? C.acid : C.violetLift,
        badgeBorder: i === 0 ? C.acid : 'rgba(124,99,203,0.5)',
        stats: [
          { k: 'AUDIENCE', v: q.aud },
          { k: 'CROWN PTS', v: q.cp.toLocaleString() },
          { k: 'CP / $', v: efficiency(q).toFixed(1) },
        ],
      };
    }),
    ladderRows: classOrder.map((id, i) => {
      const q = D[id];
      const ws = widgetStateForRank(i);
      return {
        id,
        rank: pad(i + 1),
        initial: q.initial,
        name: q.name,
        category: q.cat.toUpperCase(),
        hue: i === 0 ? C.bone : i < 3 ? C.violet : C.grey,
        aud: q.aud,
        eng: q.eng,
        cp: q.cp.toLocaleString(),
        eff: efficiency(q).toFixed(1),
        widgetState: ws,
        stateColor: ws === 'THRONE' ? C.acid : ws === 'FEATURE' ? C.violetLift : C.grey,
        bid: money(q.bid),
        spark: spark(q.seed, 10, 8),
        trendColor: q.up ? C.up : C.down,
        present: !!q.founder?.on,
      };
    }),

    // insights
    kpis: [
      { label: 'WIDGET STARTS (30D)', value: '184.2K', delta: '▲ 18%', color: C.up, barColor: C.violet, seed: 1 },
      { label: 'MEANINGFUL INTERACTION', value: '31%', delta: '▲ 4pts', color: C.up, barColor: C.violetLift, seed: 3 },
      { label: 'AVG CPM', value: '$48', delta: '▲ 12%', color: C.up, barColor: C.fillAsh, seed: 2 },
      { label: 'THRONE TIME HELD', value: '18H 42M', delta: '▲ 6h', color: C.up, barColor: C.acid, seed: 5 },
      { label: 'CROWN POINTS / $', value: efficiency(D[myId]).toFixed(1), delta: '▼ 0.4', color: C.down, barColor: C.violet, seed: 4 },
      { label: 'CHALLENGES REPELLED', value: '12', delta: '▲ 3', color: C.up, barColor: C.fillAsh, seed: 6 },
    ].map((k) => ({
      ...k,
      bars: Array.from({ length: 14 }, (_, i) => ({
        h: `${(6 + Math.abs(Math.sin(i * 0.7 + k.seed)) * 20).toFixed(0)}px`,
      })),
    })),
    funnel: [
      { label: 'FLOOR IMPRESSION', value: '1.24M', pct: '100%', w: '100%', color: C.fillAshSoft },
      { label: 'BOOTH FOCUS', value: '486.0K', pct: '39%', w: '62%', color: C.fillAsh },
      { label: 'WIDGET START', value: '184.2K', pct: '15%', w: '44%', color: C.fillIndigo },
      { label: 'MEANINGFUL INTERACTION', value: '57.1K', pct: '4.6%', w: '31%', color: C.violet },
      { label: 'PRODUCT PAGE OPEN', value: '21.4K', pct: '1.7%', w: '20%', color: C.violetLift },
      { label: 'EXTERNAL CTA', value: '8.9K', pct: '0.7%', w: '13%', color: C.acid },
    ],
    scatter: classOrder.map((id) => {
      const q = D[id];
      const eff = efficiency(q);
      return {
        name: q.name,
        x: `${Math.min(94, Math.max(4, ((q.bid - 20) / 120) * 92 + 4)).toFixed(1)}%`,
        y: `${Math.min(92, Math.max(4, ((parseFloat(q.aud) - 6.2) / 3.4) * 88 + 4)).toFixed(1)}%`,
        d: `${Math.min(30, 8 + Math.sqrt(eff) * 2.2).toFixed(0)}px`,
        color: eff > 20 ? C.acid : C.violet,
        fill: eff > 20 ? 'rgba(207,218,79,0.2)' : 'rgba(124,99,203,0.2)',
      };
    }),
    statePerf: [
      { key: 'THRONE', hue: C.acid, w: '100%', rate: '31%', starts: '184.2K' },
      { key: 'PRODUCT_PAGE', hue: C.bone, w: '74%', rate: '23%', starts: '96.4K' },
      { key: 'FEATURE', hue: C.violetLift, w: '58%', rate: '18%', starts: '71.8K' },
      { key: 'FLOOR_BOOTH', hue: C.violet, w: '41%', rate: '13%', starts: '44.1K' },
      { key: 'CARD', hue: C.ink, w: '22%', rate: '7%', starts: '28.6K' },
      { key: 'ROW', hue: C.grey, w: '9%', rate: '3%', starts: '11.2K' },
    ],
    efficiencyLeaders: standings
      .slice()
      .sort((a, b) => efficiency(D[b]) - efficiency(D[a]))
      .slice(0, 5)
      .map((id, i) => ({
        rank: pad(i + 1),
        name: D[id].name,
        spend: money(D[id].spend),
        eff: efficiency(D[id]).toFixed(1),
        color: i === 0 ? C.acid : C.violetLift,
      })),

    // floor
    floorVisitors: '1,284',
    floorRunning: '07',
    floorPulse: [
      { x: '22%', y: '24%', delay: '0s' }, { x: '31%', y: '38%', delay: '.6s' },
      { x: '18%', y: '33%', delay: '1.2s' }, { x: '68%', y: '18%', delay: '.3s' },
      { x: '74%', y: '52%', delay: '1.6s' }, { x: '38%', y: '68%', delay: '2.1s' },
    ],
    floorBooths: classOrder.slice(0, 6).map((id, i) => {
      const q = D[id];
      // Footprint is rank. #1 physically owns the room; the field compresses.
      const L = [
        { x: '4%', y: '5%', w: '46%', h: '46%', rankSize: '34px', nameSize: '18px' },
        { x: '54%', y: '5%', w: '42%', h: '30%', rankSize: '22px', nameSize: '14px' },
        { x: '54%', y: '39%', w: '42%', h: '30%', rankSize: '22px', nameSize: '14px' },
        { x: '4%', y: '55%', w: '22%', h: '26%', rankSize: '16px', nameSize: '11px' },
        { x: '28%', y: '55%', w: '22%', h: '26%', rankSize: '16px', nameSize: '11px' },
        { x: '54%', y: '73%', w: '42%', h: '21%', rankSize: '16px', nameSize: '12px' },
      ][i];
      const on = !!q.founder?.on;
      return {
        id, ...L,
        rank: pad(i + 1),
        name: q.name,
        metric: `AUD ${q.aud}`,
        hue: i === 0 ? C.bone : i < 3 ? C.violet : C.grey,
        border: id === focusId ? C.violetLift : i === 0 ? 'rgba(233,224,196,0.32)' : i < 3 ? 'rgba(124,99,203,0.34)' : C.line,
        shadow: i === 0 ? '0 24px 60px rgba(0,0,0,0.6)' : 'none',
        glow: i === 0
          ? 'radial-gradient(circle at 26% 16%, rgba(207,218,79,0.13), transparent 62%)'
          : i < 3 ? 'radial-gradient(circle at 34% 22%, rgba(124,99,203,0.11), transparent 66%)' : 'none',
        present: on,
        showMeta: i < 3,
        state: i === 0 ? 'THRONE' : i < 3 ? 'FEATURE' : 'IDLE',
      };
    }),
    officeHours: [
      { time: 'NOW', name: 'Mara Ostrow · SUPERLIST', topic: 'Ask me about the offline sync model', state: 'LIVE', timeColor: C.up, stateColor: C.up, stateBorder: '#2A4A2A' },
      { time: '17:00', name: 'Theo Aguer · DUB', topic: 'Shipping the analytics API this week', state: 'SOON', timeColor: C.bone, stateColor: C.acid, stateBorder: C.fillOlive },
      { time: '18:30', name: 'Ines Valdek · FRAMER', topic: 'Walking through the handoff flow', state: 'SCHEDULED', timeColor: C.ink, stateColor: C.ink, stateBorder: C.line },
      { time: '20:00', name: 'Dana Whitmore · LUMEN', topic: 'Reconciliation engine internals', state: 'SCHEDULED', timeColor: C.ink, stateColor: C.ink, stateBorder: C.line },
    ],

    // studio
    studioStates: (['ROW', 'CARD', 'FEATURE', 'THRONE', 'FLOOR_BOOTH', 'PRODUCT_PAGE'] as const).map((k) => ({
      key: k,
      border: k === state.studioState ? C.acid : C.line,
      bg: k === state.studioState ? C.active : 'transparent',
      color: k === state.studioState ? C.acid : C.ink,
    })),
    templates: [
      { key: 'kanban', label: 'TASK BOARD', kind: 'NATIVE SPEC' },
      { key: 'calc', label: 'CALCULATOR', kind: 'NATIVE SPEC' },
      { key: 'ba', label: 'BEFORE / AFTER', kind: 'NATIVE SPEC' },
      { key: 'sdk', label: 'CUSTOM SDK BUILD', kind: 'SIGNED RUNTIME' },
    ].map((t) => ({
      ...t,
      bg: t.key === state.template ? C.active : C.ground,
      color: t.key === state.template ? C.acid : C.ink,
    })),
    checks: [
      { glyph: '✓', label: 'Schema validation — WidgetSpec v2', value: 'PASS', color: C.up },
      { glyph: '✓', label: 'No advertiser JavaScript in main page', value: 'PASS', color: C.up },
      { glyph: '✓', label: 'Reduced-motion fallback present', value: 'PASS', color: C.up },
      { glyph: '✓', label: 'Six render states derived', value: '6 / 6', color: C.up },
      { glyph: '!', label: 'Asset weight above Floor multiplier target', value: '112KB', color: C.acid },
      { glyph: '✓', label: 'Telemetry hooks bound to standard events', value: 'PASS', color: C.up },
    ],
    budgetUse: '68% OF CAP',
    budgetSegs: Array.from({ length: 16 }, (_, k) => ({ fill: k < 11 ? C.up : C.fillIdle })),
    publishLabel: state.published ? 'SUBMITTED FOR REVIEW ✓' : 'PUBLISH VERSION 5',
    versions: [
      { label: 'V4 — LIVE', note: 'Approved 2 days ago · running on all six states', state: 'LIVE', bar: C.acid, stateColor: C.acid },
      { label: 'V3', note: 'Approved 9 days ago · retained for rollback', state: 'ARCHIVED', bar: '#2A2A2A', stateColor: C.grey },
      { label: 'V2 — A/B', note: 'Variant B, 12% lower interaction rate', state: 'RETIRED', bar: '#2A2A2A', stateColor: C.grey },
      { label: 'V1', note: 'Concierge build from the Founding Cohort program', state: 'ARCHIVED', bar: '#2A2A2A', stateColor: C.grey },
    ],
    specLines: [
      { text: '{', color: C.grey },
      { text: `  "product": "${D[throneId].name.toLowerCase()}",`, color: C.ink },
      { text: `  "template": "${state.template}",`, color: C.acid },
      { text: '  "states": ["ROW","CARD","FEATURE",', color: C.ink },
      { text: '             "THRONE","FLOOR_BOOTH","PRODUCT_PAGE"],', color: C.ink },
      { text: '  "primaryAction": "move_card",', color: C.violetLift },
      { text: '  "telemetry": ["start","interaction","cta"],', color: C.ink },
      { text: '  "budget": { "kb": 112, "particles": 0 },', color: C.ink },
      { text: '  "fallback": "static_card",', color: C.up },
      { text: '  "version": 5', color: C.ink },
      { text: '}', color: C.grey },
    ],

    // studio simulator
    sc,
    studioSize: sc.size,
    template: state.template,
    studioStateLabel: state.studioState,
    studioInitial: D[throneId].initial,
    studioName: soft(D[throneId].name),
    studioSub: D[throneId].tagline,
    studioStrip: [
      { h: '8px', w: '100%', c: BR.accent },
      { h: '6px', w: '72%', c: mix(BR.bg, BR.ink, 0.14) },
      { h: '6px', w: '44%', c: mix(BR.bg, BR.ink, 0.09) },
    ],
    studioLanes: Array.from({ length: sc.cols }, (_, k) => ({
      key: k,
      name: wkit.lanes[k] ?? wkit.lanes[0],
      items: state.cards
        .filter((c) => c.col % sc.cols === k)
        .map((c) => ({ id: c.id, label: wkit.labels[Number(c.id.slice(1)) - 1] ?? c.label })),
      count: state.cards.filter((c) => c.col % sc.cols === k).length,
    })),

    // season
    poolNow: '$5,000',
    poolCap: '$25,000',
    poolSegs: Array.from({ length: 48 }, (_, i) => {
      const filled = Math.round(48 * 0.63 * state.poolFill);
      return {
        fill: i < filled ? C.acid : i < 30 ? C.fillWarm : C.fillIdle,
        glow: i === filled - 1 ? '0 0 16px rgba(207,218,79,0.8)' : 'none',
      };
    }),
    poolTiers: [
      { label: 'GUARANTEED FLOOR', amount: '$2,500', status: 'FUNDED AT ANNOUNCE', dot: C.acid, labelColor: C.acid, amountColor: C.bone },
      { label: 'UNLOCK 01', amount: '$5,000', status: 'UNLOCKED — DAY 4', dot: C.acid, labelColor: C.acid, amountColor: C.bone },
      { label: 'UNLOCK 02', amount: '$10,000', status: '73% OF VERIFIED VOLUME', dot: C.fillAsh, labelColor: C.ink, amountColor: C.ink },
      { label: 'FINAL CAP', amount: '$25,000', status: 'HARD MAXIMUM — NEVER EXCEEDED', dot: C.line, labelColor: C.grey, amountColor: C.grey },
    ],
    seasonStandings: standings.map((id, i) => ({
      rank: pad(i + 1),
      name: D[id].name,
      hue: i === 0 ? C.bone : i < 3 ? C.violet : C.grey,
      badge: id === kingId && id === championId
        ? 'KING & CHAMPION'
        : id === kingId ? 'HOLDS THE THRONE' : i === 0 ? 'SEASON CHAMPION' : D[id].cat.toUpperCase(),
      cp: D[id].cp.toLocaleString(),
      eff: efficiency(D[id]).toFixed(1),
      w: `${Math.round((D[id].cp / D[standings[0]].cp) * 100)}%`,
      barColor: i === 0 ? C.acid : C.violet,
      kingBar: id === kingId ? C.acid : 'transparent',
    })),
    seasonTimeline: [
      { label: 'SEASON OPEN', when: 'Day 0 · markets unsealed', dot: C.acid, color: C.ink },
      { label: 'UNLOCK 01 CLEARED', when: 'Day 4 · pool at $5,000', dot: C.acid, color: C.ink },
      { label: 'MID-SEASON RECAP', when: 'Day 7 · champion snapshot published', dot: C.acid, color: C.bone },
      { label: 'FINAL 48 HOURS', when: 'Day 12 · ask escalation doubles', dot: C.violet, color: C.ink },
      { label: 'CHAMPION CEREMONY', when: 'Day 14 · pool locked and snapshotted', dot: C.line, color: C.grey },
    ],
    cohort: ['SL', 'DD', 'SD', 'HP', 'KS', 'MD', 'PB', 'LU', 'QT'],
    seasonSegs: Array.from({ length: 14 }, (_, i) => ({ fill: i < 10 ? C.violet : C.lineDeep })),
    planSegs: Array.from({ length: 10 }, (_, i) => ({ fill: i < 7 ? C.violet : C.lineDeep })),
    shareCards: [
      {
        tag: 'THRONE TAKEN', tagColor: C.ground, tagBg: C.acid,
        head: `${D[throneId].name} TOOK #01`, headSize: '30px',
        body: `Cleared the ask in ${activeClass.label} and expanded into the throne canvas. Reign is live now.`,
        foot: `AUTO-GENERATED · ${activeClass.label}`,
        border: 'rgba(207,218,79,0.32)', bg: 'rgba(18,18,12,0.6)',
        glow: 'radial-gradient(circle at 78% 12%, rgba(207,218,79,0.2), transparent 62%)',
      },
      {
        tag: 'POOL UNLOCKED', tagColor: C.ground, tagBg: C.violetLift,
        head: '$5,000 UNLOCKED', headSize: '32px',
        body: 'Verified marketplace volume cleared Unlock 01. Next tier sits at 73% and the hard cap is $25,000.',
        foot: 'SEASON ZERO · LAUNCH IGNITION',
        border: 'rgba(124,99,203,0.4)', bg: 'rgba(14,12,22,0.6)',
        glow: 'radial-gradient(circle at 76% 14%, rgba(124,99,203,0.24), transparent 64%)',
      },
      {
        tag: 'HIGH CP / $', tagColor: C.bone, tagBg: 'transparent',
        head: 'MOST EFFICIENT REIGN', headSize: '26px',
        body: `${D[myId].name} banked ${D[myId].cp.toLocaleString()} Crown Points on ${money(D[myId].spend)} of spend. Efficiency is public on purpose.`,
        foot: 'FACTUAL EVENT CARD · NO RANKING CLAIM',
        border: C.line, bg: 'rgba(10,10,12,0.6)', glow: 'none',
      },
    ],

    // product-page extras
    pStates: [
      { key: 'ROW', size: '320×64', hue: C.grey, status: 'LIVE', statusColor: C.up },
      { key: 'CARD', size: '320×220', hue: C.ink, status: 'LIVE', statusColor: C.up },
      { key: 'FEATURE', size: '640×360', hue: C.violetLift, status: 'LIVE', statusColor: C.up },
      { key: 'THRONE', size: '960×520', hue: C.acid, status: 'LIVE', statusColor: C.up },
      { key: 'FLOOR_BOOTH', size: 'SPATIAL', hue: C.violet, status: 'LIVE', statusColor: C.up },
      { key: 'PRODUCT_PAGE', size: 'PERMANENT', hue: C.bone, status: 'LIVE', statusColor: C.up },
    ],
    claims: [
      { glyph: '⚡', title: 'Blazing fast', body: 'Built for speed. Every interaction feels instant.' },
      { glyph: '◈', title: 'Focused workflow', body: 'Less noise. More signal. Ship with confidence.' },
      { glyph: '✳', title: 'Powerful, not complex', body: 'Advanced features without the bloat.' },
    ],
    dots: Array.from({ length: 8 }, (_, i) => ({ fill: i === 0 ? C.bone : C.line })),
    activity: [
      { t: '2m', glyph: '⚡', color: C.violet, text: `Framer challenged ${p.name} for $72` },
      { t: '7m', glyph: '◆', color: C.acid, text: `${p.name} overtook Superlist` },
      { t: '15m', glyph: '↑', color: C.up, text: 'New upvote from @dev_junior' },
      { t: '32m', glyph: '◆', color: C.acid, text: `${p.name} reached rank #2` },
      { t: '1h', glyph: '▤', color: C.grey, text: 'New comment on performance' },
    ],
    comments: [
      { initial: 'PX', who: 'pixelchaser', when: '2h ago', score: 128, body: 'Changed how our whole team works. The speed is unreal.' },
      { initial: 'SF', who: 'shipfast', when: '5h ago', score: 84, body: 'Best in class. Everything just feels right.' },
      { initial: 'MN', who: 'maker_node', when: '1d ago', score: 62, body: 'The cycles feature is a game changer.' },
    ],
    team: ['AV', 'BK', 'CJ', 'DM'],
    tab: state.tab,

    // ---- Tab panels --------------------------------------------------------
    // Performance reads from the product's real figures rather than a second
    // set of invented ones, so the tab can never disagree with the desk.
    perfMetrics: [
      { k: 'AUDIENCE SCORE', v: p.aud, d: p.audD, c: String(p.audD).includes('▼') ? C.down : C.up, note: 'INDEPENDENT PANEL' },
      { k: 'ENGAGEMENT (30D)', v: p.eng, d: p.engD, c: String(p.engD).includes('▼') ? C.down : C.up, note: 'MEANINGFUL INTERACTIONS' },
      { k: 'CROWN POINTS', v: p.cp.toLocaleString(), d: '▲ 620', c: C.up, note: 'SEASON 04' },
      { k: 'CP PER DOLLAR', v: efficiency(p).toFixed(1), d: p.spend > 1000 ? '▼ 0.4' : '▲ 1.2', c: p.spend > 1000 ? C.down : C.up, note: 'PUBLISHED ON PURPOSE' },
      { k: 'SEASON SPEND', v: money(p.spend), d: '—', c: C.grey, note: `CAP ${CLASSES.find((c) => c.key === p.klass)!.cap}` },
      { k: 'CURRENT ASK', v: money(ask(state.productId)), d: vulnerable ? '▼ DECAYING' : '▲ HELD', c: vulnerable ? C.up : C.down, note: 'TO TAKE THIS SLOT' },
    ],
    perfStates: [
      { key: 'THRONE', starts: '184.2K', rate: '31%', w: '100%', hue: C.acid },
      { key: 'PRODUCT_PAGE', starts: '96.4K', rate: '23%', w: '74%', hue: C.bone },
      { key: 'FEATURE', starts: '71.8K', rate: '18%', w: '58%', hue: C.violetLift },
      { key: 'FLOOR_BOOTH', starts: '44.1K', rate: '13%', w: '41%', hue: C.violet },
      { key: 'CARD', starts: '28.6K', rate: '7%', w: '22%', hue: C.ink },
      { key: 'ROW', starts: '11.2K', rate: '3%', w: '9%', hue: C.grey },
    ],
    perfReigns: [
      { when: 'TODAY 04:02', held: '01:47:11', cp: '2,140', peak: '#01', outcome: 'ENDED BY DUB', color: C.down },
      { when: 'YDAY 11:05', held: '00:52:06', cp: '980', peak: '#01', outcome: 'ENDED BY SUPERLIST', color: C.down },
      { when: '2D AGO 20:12', held: '03:04:17', cp: '4,820', peak: '#01', outcome: 'REPELLED 3 CHALLENGES', color: C.up },
      { when: '3D AGO 09:40', held: '00:18:52', cp: '310', peak: '#02', outcome: 'WITHDRAWN', color: C.ink },
    ],

    // A real thread, not three floating quotes: replies and a composer.
    discussion: [
      { initial: 'PX', who: 'pixelchaser', when: '2h ago', score: 128, body: 'Changed how our whole team works. The speed is unreal.', replies: [{ initial: 'MO', who: 'mara_o', when: '1h ago', body: 'Appreciate that — the sync rewrite landed last week and it made everything feel lighter.', team: true }] },
      { initial: 'SF', who: 'shipfast', when: '5h ago', score: 84, body: 'Best in class. Everything just feels right.', replies: [] },
      { initial: 'MN', who: 'maker_node', when: '1d ago', score: 62, body: 'The cycles feature is a game changer. Any plans for an API?', replies: [{ initial: 'MO', who: 'mara_o', when: '22h ago', body: 'Yes — public beta this season. It is the next thing on the board.', team: true }] },
      { initial: 'TQ', who: 'tinyquark', when: '2d ago', score: 41, body: 'Switched from three other tools. Has not broken once.', replies: [] },
      { initial: 'DV', who: 'devlogged', when: '3d ago', score: 29, body: 'Offline mode is the reason I stayed.', replies: [] },
    ],

    updates: [
      { v: 'v4.2', when: 'TODAY', tag: 'WIDGET', tagColor: C.acid, title: 'Throne canvas v5 submitted for review', body: 'New lane layout and a lighter card treatment. Running as an A/B variant against v4 until the season closes.' },
      { v: 'v4.1', when: '2D AGO', tag: 'PRODUCT', tagColor: C.violetLift, title: 'Offline sync rewritten', body: 'Conflict resolution is now per-field rather than per-record, so two people editing the same list no longer clobber each other.' },
      { v: 'v4.0', when: '9D AGO', tag: 'PRODUCT', tagColor: C.violetLift, title: 'Cycles', body: 'Recurring work now has first-class support instead of being modelled as duplicated tasks.' },
      { v: '—', when: '14D AGO', tag: 'MARKET', tagColor: C.bone, title: 'Entered the Indie economy', body: 'Listed with a permanent page, a rank and one approved widget. No spend required to be on the board.' },
    ],

    teamMembers: [
      { i: 'MO', n: 'Mara Ostrow', r: 'FOUNDER · ENGINEERING', on: true },
      { i: 'AV', n: 'Ana Vidal', r: 'DESIGN', on: false },
      { i: 'BK', n: 'Ben Kaur', r: 'ENGINEERING', on: true },
      { i: 'CJ', n: 'Chris Jae', r: 'SUPPORT', on: false },
    ],
    productLanes: [0, 1, 2].map((k) => {
      const w = WIDGETS[state.productId] ?? WIDGETS.linear;
      return {
        key: k,
        name: w.lanes[k],
        items: state.cards
          .filter((c) => c.col === k)
          .map((c) => ({ id: c.id, label: w.labels[Number(c.id.slice(1)) - 1] ?? c.label })),
        count: state.cards.filter((c) => c.col === k).length,
      };
    }),
    mix,
  };
}

export type Derived = ReturnType<typeof derive>;
