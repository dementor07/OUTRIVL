'use client';

import { C, SHELL } from '@/lib/tokens';
import { display, mono } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { Meter } from '@/components/ui/Meter';
import { useMarket } from '@/state/useMarket';

/**
 * The rail.
 *
 * Split into THE MARKET and YOUR DESK so the public market and your own
 * position are legible at a glance — the earlier flat list of eight
 * destinations made the Board, the Floor and the Ladder read as three unrelated
 * systems when they are three views of one entity.
 */
export function Rail() {
  const { d, actions } = useMarket();

  return (
    <aside
      style={{
        flex: `0 0 ${SHELL.rail}px`,
        borderRight: `1px solid ${C.line}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 16px',
        gap: '20px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        onClick={actions.goThrone}
        style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}
      >
        <span
          style={{
            width: '26px', height: '26px', border: `1px solid ${C.acid}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...display({ s: 13, c: C.acid }),
          }}
        >
          ✳
        </span>
        <span>
          <span style={{ display: 'block', ...display({ s: 19, c: C.bone, ls: 0.03 }) }}>OUTRIVL</span>
          <span style={{ display: 'block', marginTop: '3px', ...mono({ w: 500, s: 8, c: C.ink, ls: 0.19 }) }}>
            COMPETE FOR ATTENTION
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', gap: '9px', alignItems: 'center', padding: '9px 10px', border: `1px solid ${C.line}` }}>
        <span style={{ width: '6px', height: '6px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
        <span>
          <span style={{ display: 'block', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>LIVE STATUS</span>
          <span style={{ display: 'block', marginTop: '3px', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.16 }) }}>MARKETS OPEN</span>
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {d.navGroups.map((g) => (
          <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ display: 'block', padding: '0 11px 8px', ...mono({ w: 700, s: 8, c: C.greyDeep, ls: 0.22 }) }}>
              {g.label}
            </span>
            {g.items.map((n) => (
              <Hoverable
                key={n.key}
                onClick={() => actions.goNav(n.key)}
                style={{
                  display: 'flex', gap: '11px', alignItems: 'center', padding: '10px 11px',
                  cursor: 'pointer', borderLeft: `2px solid ${n.bar}`, background: n.bg,
                }}
                hover={{ background: C.hover }}
              >
                <span style={{ flex: '0 0 16px', textAlign: 'center', ...display({ s: 13, c: n.glyphColor }) }}>{n.glyph}</span>
                <span style={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', ...mono({ w: 500, s: 11, c: n.titleColor, ls: 0.11 }) }}>
                  {n.title}
                </span>
                <span style={{ flex: '0 0 auto', ...mono({ w: 500, s: 9.5, c: C.grey }) }}>{n.count}</span>
              </Hoverable>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span
          style={{
            flex: '0 0 30px', height: '30px', border: `1px solid ${C.acid}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...mono({ w: 700, s: 10, c: C.acid }),
          }}
        >
          OD
        </span>
        <span style={{ flex: '1 1 auto', minWidth: 0 }}>
          <span style={{ display: 'block', whiteSpace: 'nowrap', ...mono({ w: 500, s: 10.5, c: C.bone, ls: 0.09 }) }}>VIKTOR ODDY</span>
          <span style={{ display: 'block', whiteSpace: 'nowrap', marginTop: '3px', ...mono({ s: 8.5, c: C.grey, ls: 0.13 }) }}>PRO PLAN</span>
        </span>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}>
          <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>PLAN STATUS</span>
          <span style={{ border: `1px solid ${C.acid}`, padding: '2px 6px', ...mono({ w: 700, s: 8.5, c: C.acid, ls: 0.14 }) }}>PRO</span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <Meter segs={d.planSegs} height={5} />
        </div>
        <div style={mono({ s: 9, c: C.grey, ls: 0.1 })}>7 / 10 CHALLENGES USED</div>
      </div>

      <Hoverable
        style={{
          border: `1px solid ${C.line}`, padding: '11px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
        }}
        hover={{ borderColor: C.acid }}
        onClick={() => actions.goNav('challenges')}
      >
        <span style={mono({ w: 500, s: 10, c: C.bone, ls: 0.12 })}>UPGRADE PLAN</span>
        <span style={mono({ s: 11, c: C.bone })}>→</span>
      </Hoverable>

      {/* Season state, not marketing filler: what is actually happening in the
          market this rail belongs to. */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
          <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>SEASON 04</span>
          <span style={mono({ w: 700, s: 9, c: C.acid, ls: 0.14 })}>2D 06H LEFT</span>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <Meter segs={d.seasonSegs} height={4} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
          <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>CHAMPION</span>
          <span style={mono({ w: 500, s: 10, c: C.bone, ls: 0.06 })}>{d.champion}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>CROWN POINTS</span>
          <span style={mono({ w: 700, s: 11, c: C.bone })}>{d.championCP}</span>
        </div>
        <div
          style={{
            display: 'flex', gap: '14px', marginTop: '18px', paddingTop: '14px',
            borderTop: `1px solid ${C.line}`, ...mono({ s: 12, c: C.grey }),
          }}
        >
          {['◍', '✕', '⌘'].map((g) => (
            <Hoverable as="span" key={g} style={{ cursor: 'pointer' }} hover={{ color: C.bone }}>
              {g}
            </Hoverable>
          ))}
        </div>
      </div>
    </aside>
  );
}
