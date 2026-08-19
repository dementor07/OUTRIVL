'use client';

import { useEffect, useRef } from 'react';
import { C, FONT, SHELL } from '@/lib/tokens';
import { display, mono } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { Rail } from './Rail';
import { Topbar } from './Topbar';
import { useMarket } from '@/state/useMarket';

/**
 * The app shell.
 *
 * Available width is observed off the shell's own outer box rather than the
 * viewport, so the breakpoints stay correct when the app is embedded. Measuring
 * the *outer* box specifically matters: an earlier version measured the canvas
 * and added the rail's width back on, which would oscillate once the rail
 * became something that could hide — hiding it widened the canvas, which
 * widened the measurement, which showed it again.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const { d, actions } = useMarket();
  const outer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => actions.setShellWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [actions]);

  // Escape closes the drawer, as with any overlay.
  useEffect(() => {
    if (!d.railOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') actions.closeRail();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [d.railOpen, actions]);

  return (
    <div
      ref={outer}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '100vh',
        background: C.ground,
        fontFamily: FONT.mono,
      }}
    >
      {d.mobile ? <MobileRail /> : <Rail />}
      <main style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {d.mobile && <MobileBar />}
        <Topbar />
        {children}
      </main>
    </div>
  );
}

/**
 * The rail as a drawer.
 *
 * Same component, same content — only the containment changes. Nav items
 * already close the drawer on selection, so the destination is never left
 * behind an overlay.
 */
function MobileRail() {
  const { d, actions } = useMarket();
  if (!d.railOpen) return null;
  return (
    <div
      onClick={actions.closeRail}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(3,3,4,0.72)', backdropFilter: 'blur(6px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Navigation"
        style={{ width: `${SHELL.rail}px`, maxWidth: '86vw', height: '100%', background: C.ground, boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
      >
        <Rail />
      </div>
    </div>
  );
}

/** The persistent header that replaces the rail below the mobile breakpoint. */
function MobileBar() {
  const { actions } = useMarket();
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '0 14px', height: '52px',
        borderBottom: `1px solid ${C.line}`, position: 'sticky', top: 0, zIndex: 6, background: C.ground,
      }}
    >
      <Hoverable
        onClick={actions.toggleRail}
        ariaLabel="Open navigation"
        style={{
          width: '32px', height: '32px', flex: '0 0 auto', border: `1px solid ${C.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          ...mono({ s: 14, c: C.bone }),
        }}
        hover={{ borderColor: C.acid, color: C.acid }}
      >
        ≡
      </Hoverable>
      <span
        onClick={actions.goThrone}
        style={{ display: 'flex', gap: '9px', alignItems: 'center', cursor: 'pointer' }}
      >
        <span style={{ width: '22px', height: '22px', border: `1px solid ${C.acid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 11, c: C.acid }) }}>
          ✳
        </span>
        <span style={display({ s: 15, c: C.bone, ls: 0.03 })}>OUTRIVL</span>
      </span>
      <span style={{ marginLeft: 'auto', display: 'flex', gap: '7px', alignItems: 'center', ...mono({ w: 700, s: 8.5, c: C.acid, ls: 0.14 }) }}>
        <span style={{ width: '5px', height: '5px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
        LIVE
      </span>
    </div>
  );
}
