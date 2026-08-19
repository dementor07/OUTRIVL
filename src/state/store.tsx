'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DB, INITIAL_CARDS, MY_PRODUCT } from '@/lib/products';
import { DETHRONE_MS, DETHRONE_REDUCED_MS } from '@/lib/tokens';
import type { Card, ClassKey, MarketMode, ViewKey, WidgetState } from '@/lib/types';

export interface OutrivlState {
  view: ViewKey;
  marketMode: MarketMode;
  /** Opt-in: pulls advertiser brands toward the board palette. Never forced. */
  autoTone: boolean;
  siteOpen: boolean;
  klass: ClassKey;
  /** Category filter within the class. `all` or a `Product.cat` value. */
  cat: string;
  tab: string;
  productId: string;
  /** Dethronement playhead in ms, or null when idle. */
  t: number | null;
  /** The product currently expanding into the throne canvas. */
  incoming: string | null;
  reignSec: number;
  clock: number;
  upvotes: number;
  feedFilter: string;
  studioState: WidgetState;
  template: string;
  focusId: string | null;
  chTargetId: string | null;
  chBidStep: number | null;
  poolFill: number;
  published: boolean;
  order: string[];
  cards: Card[];
  moves: number;
  takeovers: number;
  /** Available shell width, observed rather than read off the viewport. */
  vw: number;
  /** Mobile nav drawer. Ignored once the rail is permanently visible. */
  railOpen: boolean;
}

const INITIAL: OutrivlState = {
  view: 'market',
  marketMode: 'board',
  autoTone: false,
  siteOpen: false,
  klass: 'indie',
  cat: 'all',
  tab: 'overview',
  productId: 'framer',
  t: null,
  incoming: null,
  reignSec: 11662,
  clock: 34883,
  upvotes: 3412,
  feedFilter: 'all',
  studioState: 'THRONE',
  template: 'kanban',
  focusId: null,
  chTargetId: null,
  chBidStep: null,
  poolFill: 0,
  published: false,
  order: [
    'superlist', 'dub', 'sundial', 'raycast', 'halfpipe', 'keystone',
    'linear', 'framer', 'meridian', 'parabol', 'loom', 'northwind',
    'acme', 'lumen', 'quanta', 'orbital', 'vercel', 'notion',
  ],
  cards: INITIAL_CARDS,
  moves: 0,
  takeovers: 0,
  vw: 1440,
  railOpen: false,
};

export interface OutrivlActions {
  setClass: (k: ClassKey) => void;
  setCat: (k: string) => void;
  goNav: (key: string) => void;
  goThrone: () => void;
  goFloor: () => void;
  goLadder: () => void;
  goStudio: () => void;
  goStudioPreview: () => void;
  goFeed: () => void;
  goMine: () => void;
  setMode: (m: MarketMode) => void;
  toggleAutoTone: () => void;
  openSite: () => void;
  closeSite: () => void;
  setFeedFilter: (k: string) => void;
  setStudioState: (k: WidgetState) => void;
  setTemplate: (k: string) => void;
  setFocus: (id: string) => void;
  openFocusProduct: () => void;
  setChTarget: (id: string) => void;
  setChBid: (step: number) => void;
  publish: () => void;
  openProduct: (id: string) => void;
  setTab: (k: string) => void;
  upvote: () => void;
  moveCard: (id: string) => void;
  takeThrone: () => void;
  setShellWidth: (w: number) => void;
  toggleRail: () => void;
  closeRail: () => void;
}

const Ctx = createContext<{ state: OutrivlState; actions: OutrivlActions } | null>(null);

export function OutrivlProvider({
  children,
  reducedMotion = false,
}: {
  children: React.ReactNode;
  reducedMotion?: boolean;
}) {
  const [state, setState] = useState<OutrivlState>(INITIAL);
  const raf = useRef<number | null>(null);
  /** Guards the takeover so a second click mid-sequence cannot re-enter it. */
  const running = useRef(false);

  // The market clock and the reign clock both tick in real time; a reign that
  // is visibly ageing is what makes the decaying ask price legible.
  useEffect(() => {
    const id = setInterval(
      () => setState((s) => ({ ...s, clock: s.clock + 1, reignSec: s.reignSec + 1 })),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  // The prize pool fills on arrival rather than appearing pre-filled.
  useEffect(() => {
    const id = setTimeout(() => setState((s) => ({ ...s, poolFill: 1 })), 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  const patch = useCallback(
    (p: Partial<OutrivlState> | ((s: OutrivlState) => Partial<OutrivlState>)) =>
      setState((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) })),
    [],
  );

  const takeThrone = useCallback(() => {
    if (running.current) return;
    setState((s) => {
      const inClass = s.order.filter((id) => DB[id].klass === s.klass);
      // From a product page the challenger is that product; from the board it
      // is whoever currently sits at #02.
      const challenger = s.view === 'product' ? s.productId : inClass[1];
      if (!challenger || challenger === inClass[0]) return s;

      running.current = true;
      const total = reducedMotion ? DETHRONE_REDUCED_MS : DETHRONE_MS;
      const start = performance.now();

      const loop = (now: number) => {
        // The sequence is authored against a 1240ms timeline; reduced motion
        // replays the same phases on a compressed clock rather than skipping
        // straight to the result, so the state change is never invisible.
        const t = (now - start) * (DETHRONE_MS / total);
        if (t >= DETHRONE_MS) {
          running.current = false;
          setState((prev) => {
            const order = prev.order.slice();
            const i = order.indexOf(challenger);
            order.splice(i, 1);
            order.unshift(challenger);
            return { ...prev, order, t: null, incoming: null, reignSec: 0, takeovers: prev.takeovers + 1 };
          });
          return;
        }
        setState((prev) => ({ ...prev, t }));
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
      return { ...s, incoming: challenger, t: 0 };
    });
  }, [reducedMotion]);

  const actions = useMemo<OutrivlActions>(
    () => ({
      setClass: (k) => patch({ klass: k, cat: 'all', chTargetId: null, focusId: null }),
      setCat: (k) => patch({ cat: k }),
      goNav: (key) =>
        key === 'mine'
          ? patch({ view: 'product', productId: MY_PRODUCT, tab: 'overview', railOpen: false })
          : patch({ view: key as ViewKey, railOpen: false }),
      goThrone: () => patch({ view: 'market', marketMode: 'board' }),
      goFloor: () => patch({ view: 'market', marketMode: 'floor' }),
      goLadder: () => patch({ view: 'market', marketMode: 'ladder' }),
      goStudio: () => patch({ view: 'studio' }),
      goStudioPreview: () => patch({ view: 'studio', studioState: 'FLOOR_BOOTH' }),
      goFeed: () => patch({ view: 'feed' }),
      goMine: () => patch({ view: 'product', productId: MY_PRODUCT, tab: 'overview' }),
      setMode: (m) => patch({ marketMode: m }),
      toggleAutoTone: () => patch((s) => ({ autoTone: !s.autoTone })),
      openSite: () => patch({ siteOpen: true }),
      closeSite: () => patch({ siteOpen: false }),
      setFeedFilter: (k) => patch({ feedFilter: k }),
      setStudioState: (k) => patch({ studioState: k }),
      setTemplate: (k) => patch({ template: k, published: false }),
      setFocus: (id) => patch({ focusId: id }),
      openFocusProduct: () =>
        patch((s) => ({ view: 'product', productId: s.focusId ?? s.productId, tab: 'overview' })),
      setChTarget: (id) => patch({ chTargetId: id, chBidStep: null }),
      setChBid: (step) => patch({ chBidStep: step }),
      publish: () => patch({ published: true }),
      openProduct: (id) => patch({ view: 'product', productId: id, tab: 'overview' }),
      setTab: (k) => patch({ tab: k }),
      upvote: () => patch((s) => ({ upvotes: s.upvotes + 1 })),
      moveCard: (id) =>
        patch((s) => ({
          moves: s.moves + 1,
          cards: s.cards.map((c) => (c.id === id ? { ...c, col: (c.col + 1) % 3 } : c)),
        })),
      takeThrone,
      setShellWidth: (w) => setState((s) => (s.vw === w ? s : { ...s, vw: w })),
      toggleRail: () => patch((s) => ({ railOpen: !s.railOpen })),
      closeRail: () => patch({ railOpen: false }),
    }),
    [patch, takeThrone],
  );

  return <Ctx.Provider value={{ state, actions }}>{children}</Ctx.Provider>;
}

export function useOutrivl() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOutrivl must be used inside <OutrivlProvider>');
  return v;
}
