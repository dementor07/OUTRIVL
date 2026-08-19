'use client';

import { C, SHELL } from '@/lib/tokens';
import { mono } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';

/** Breadcrumb, live indicator and the market's UTC clock. */
export function Topbar() {
  const { d } = useMarket();
  return (
    <header
      style={{
        display: 'flex', alignItems: 'center', gap: '20px', padding: '0 22px',
        height: `${SHELL.topbar}px`, borderBottom: `1px solid ${C.line}`, flexWrap: 'wrap',
        position: 'sticky', top: 0, background: C.ground, zIndex: 5,
      }}
    >
      <div style={mono({ w: 500, s: 11, c: C.grey, ls: 0.14 })}>{d.crumb}</div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* The mobile bar already carries the live indicator and the menu, so
            the topbar drops both rather than showing each of them twice. */}
        {!d.mobile && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', ...mono({ w: 700, s: 10, c: C.acid, ls: 0.16 }) }}>
            <span style={{ width: '5px', height: '5px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
            LIVE
          </span>
        )}
        {/* suppressHydrationWarning: the clock ticks in real time, so the
            server's first render is necessarily a moment behind the client's. */}
        <span data-testid="live-clock" suppressHydrationWarning style={mono({ s: 11, c: C.ink, ls: 0.08 })}>
          {d.utc}
        </span>
        <Hoverable as="span" style={{ position: 'relative', cursor: 'pointer', ...mono({ s: 13, c: C.ink }) }} hover={{ color: C.bone }}>
          ◔
          <span style={{ position: 'absolute', top: '-6px', right: '-9px', background: C.acid, color: C.ground, padding: '1px 4px', ...mono({ w: 700, s: 8 }) }}>
            3
          </span>
        </Hoverable>
        {!d.mobile && (
          <Hoverable as="span" style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: '18px', cursor: 'pointer', ...mono({ s: 13, c: C.ink }) }} hover={{ color: C.bone }}>
            ≡
          </Hoverable>
        )}
      </div>
    </header>
  );
}
