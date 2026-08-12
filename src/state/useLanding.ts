'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LANDING_CARDS } from '@/lib/landing';

export interface LandingState {
  clock: number;
  reign: number;
  cycle: 'mo' | 'yr';
  openFaq: string | null;
  moves: number;
  poolFill: number;
  /** Scroll offset, driving every parallax layer. */
  sy: number;
  /** Cursor position in the hero, 0–1, driving the follow glow. */
  mx: number;
  my: number;
  /** Dethronement scrubber position, 0–1. */
  scrub: number;
  /** Reign length in the ask-price simulator, 0–27. */
  sim: number;
  brand: string;
  tone: boolean;
  seen: Record<string, boolean>;
  measured: boolean;
  cards: { id: string; label: string; col: number }[];
}

const INITIAL: LandingState = {
  clock: 34883, reign: 6142, cycle: 'mo', openFaq: 'q1', moves: 0, poolFill: 0,
  sy: 0, mx: 0.5, my: 0.4, scrub: 0, sim: 6, brand: 'superlist', tone: false,
  seen: {}, measured: false, cards: LANDING_CARDS,
};

export function useLanding() {
  const [s, setS] = useState<LandingState>(INITIAL);
  const scrubbing = useRef<HTMLElement | null>(null);

  const patch = useCallback(
    (p: Partial<LandingState> | ((x: LandingState) => Partial<LandingState>)) =>
      setS((x) => ({ ...x, ...(typeof p === 'function' ? p(x) : p) })),
    [],
  );

  useEffect(() => {
    const tick = setInterval(() => setS((x) => ({ ...x, clock: x.clock + 1, reign: x.reign + 1 })), 1000);
    const fill = setTimeout(() => setS((x) => ({ ...x, poolFill: 1 })), 300);
    return () => {
      clearInterval(tick);
      clearTimeout(fill);
    };
  }, []);

  /**
   * Section reveal.
   *
   * Derived from live geometry on every scroll frame rather than a one-shot
   * IntersectionObserver snapshot, and it *fails open*: until geometry has
   * actually been measured every section renders at full opacity. A failure
   * here degrades to "no animation" rather than "no page", which is the
   * behaviour an earlier observer-based version got wrong.
   */
  const measure = useCallback(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-rv]');
    if (!nodes.length) return;
    const vh = window.innerHeight || 800;
    // Measured inside the updater so it always compares against current state
    // without keeping a mirror ref. Reading layout here is idempotent, so a
    // double invocation under StrictMode is harmless.
    setS((x) => {
      const add: Record<string, boolean> = {};
      let found = false;
      nodes.forEach((el) => {
        const k = el.dataset.rv!;
        if (x.seen[k]) return;
        if (el.getBoundingClientRect().top < vh * 0.94) {
          add[k] = true;
          found = true;
        }
      });
      if (!found && x.measured) return x;
      return { ...x, measured: true, seen: { ...x.seen, ...add } };
    });
  }, []);

  useEffect(() => {
    let pending = false;
    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        setS((x) => ({ ...x, sy: window.scrollY || 0 }));
        measure();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const t1 = setTimeout(measure, 80);
    const t2 = setTimeout(measure, 400);

    const onMove = (e: MouseEvent) => {
      if (!scrubbing.current) return;
      const r = scrubbing.current.getBoundingClientRect();
      setS((x) => ({ ...x, scrub: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) }));
    };
    const onUp = () => {
      scrubbing.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [measure]);

  const actions = {
    onHeroMove: (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      patch({ mx: (e.clientX - r.left) / r.width, my: (e.clientY - r.top) / r.height });
    },
    scrubDown: (e: React.MouseEvent<HTMLElement>) => {
      scrubbing.current = e.currentTarget;
      const r = e.currentTarget.getBoundingClientRect();
      patch({ scrub: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) });
    },
    setScrub: (v: number) => patch({ scrub: Math.min(1, Math.max(0, v)) }),
    setSim: (v: number) => patch({ sim: v }),
    setBrand: (k: string) => patch({ brand: k }),
    toggleTone: () => patch((x) => ({ tone: !x.tone })),
    setCycle: (c: 'mo' | 'yr') => patch({ cycle: c }),
    toggleFaq: (k: string) => patch((x) => ({ openFaq: x.openFaq === k ? null : k })),
    moveCard: (id: string) =>
      patch((x) => ({
        moves: x.moves + 1,
        cards: x.cards.map((c) => (c.id === id ? { ...c, col: (c.col + 1) % 3 } : c)),
      })),
  };

  /** Reveal opacity for a section key. Visible until proven otherwise. */
  const rv = (k: string) => (!s.measured || s.seen[k] ? 1 : 0);
  const rvY = (k: string) => (rv(k) ? '0px' : '26px');

  return { s, actions, rv, rvY };
}
