'use client';

import { C } from '@/lib/tokens';
import { display, mono } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';

/**
 * The Ladder — the full record.
 *
 * Same economy, same order, read as a table: Crown Points and CP-per-dollar
 * sit alongside rank so the efficiency argument is visible in one glance, and
 * the widget state column makes explicit what canvas each rank has earned.
 */
export function Ladder() {
  const { d, actions } = useMarket();

  const cols = [
    { k: '#', flex: '0 0 50px', align: 'left' as const },
    { k: 'PRODUCT', flex: '1 1 170px', align: 'left' as const },
    { k: 'CATEGORY', flex: '0 0 140px', align: 'left' as const },
    { k: 'AUDIENCE', flex: '0 0 90px', align: 'right' as const },
    { k: 'ENGAGEMENT', flex: '0 0 100px', align: 'right' as const },
    { k: 'CROWN PTS', flex: '0 0 104px', align: 'right' as const },
    { k: 'CP / $', flex: '0 0 86px', align: 'right' as const },
    { k: 'WIDGET STATE', flex: '0 0 110px', align: 'right' as const },
    { k: 'TOP BID', flex: '0 0 90px', align: 'right' as const },
    { k: 'TREND', flex: '0 0 64px', align: 'right' as const },
  ];

  return (
    <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* The podium is glass: the top three are the live contest. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'stretch' }}>
        {d.podium.map((p) => (
          <Hoverable
            key={p.id}
            onClick={() => actions.openProduct(p.id)}
            style={{
              flex: p.flex, minWidth: '230px', position: 'relative', overflow: 'hidden',
              border: `1px solid ${p.border}`, background: p.bg,
              backdropFilter: 'blur(14px) saturate(150%)', WebkitBackdropFilter: 'blur(14px) saturate(150%)',
              boxShadow: p.shadow, padding: '22px', cursor: 'pointer', minHeight: '210px',
              display: 'flex', flexDirection: 'column',
            }}
            hover={{ borderColor: C.bone }}
          >
            <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: p.glow }} />
            <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ lineHeight: 1, fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: p.rankSize, color: p.hue }}>
                {p.rank}
              </span>
              <span style={{ border: `1px solid ${p.badgeBorder}`, padding: '3px 7px', whiteSpace: 'nowrap', ...mono({ w: 700, s: 8.5, c: p.badgeColor, ls: 0.14 }) }}>
                {p.badge}
              </span>
            </span>
            <span style={{ position: 'relative', marginTop: 'auto', display: 'block', fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: p.nameSize, color: C.bone }}>
              {p.name}
            </span>
            <span style={{ position: 'relative', display: 'block', marginTop: '9px', ...mono({ w: 500, s: 9, c: C.violetLift, ls: 0.15 }) }}>
              {p.category}
            </span>
            <span style={{ position: 'relative', display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '14px', borderTop: '1px dotted rgba(233,224,196,0.18)' }}>
              {p.stats.map((s) => (
                <span key={s.k}>
                  <span style={{ display: 'block', ...mono({ w: 500, s: 8, c: C.grey, ls: 0.15 }) }}>{s.k}</span>
                  <span style={{ display: 'block', marginTop: '5px', ...mono({ w: 700, s: 15, c: C.bone }) }}>{s.v}</span>
                </span>
              ))}
            </span>
          </Hoverable>
        ))}
      </div>

      <div style={{ border: `1px solid ${C.line}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${C.line}` }}>
          <span style={mono({ w: 700, s: 10, c: C.bone, ls: 0.16 })}>FULL LADDER — {d.ladderClass}</span>
          <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.14 })}>RANKS 04+ CARRY NO HUE BY DESIGN</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', padding: '0 14px', height: '34px', alignItems: 'center', background: '#0B0B0D', borderBottom: `1px solid ${C.line}`, minWidth: '1000px' }}>
            {cols.map((c) => (
              <span key={c.k} style={{ flex: c.flex, textAlign: c.align, ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>
                {c.k}
              </span>
            ))}
          </div>
          {d.ladderRows.map((r) => (
            <Hoverable
              key={r.id}
              onClick={() => actions.openProduct(r.id)}
              style={{ display: 'flex', padding: '0 14px', height: '44px', alignItems: 'center', borderBottom: `1px solid ${C.lineSoft}`, cursor: 'pointer', minWidth: '1000px' }}
              hover={{ background: '#0B0B0D' }}
            >
              <span style={{ flex: '0 0 50px', ...display({ s: 13, c: r.hue }) }}>{r.rank}</span>
              <span style={{ flex: '1 1 170px', display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span style={{ width: '24px', height: '24px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', ...display({ s: 8, c: r.hue }) }}>
                  {r.initial}
                </span>
                <span style={mono({ w: 500, s: 12, c: C.bone, ls: 0.05 })}>{r.name}</span>
                {r.present && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.up, flex: '0 0 auto' }} title="Founder present" />}
              </span>
              <span style={{ flex: '0 0 140px', ...mono({ s: 10, c: C.grey, ls: 0.1 }) }}>{r.category}</span>
              <span style={{ flex: '0 0 90px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{r.aud}</span>
              <span style={{ flex: '0 0 100px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{r.eng}</span>
              <span style={{ flex: '0 0 104px', textAlign: 'right', ...mono({ w: 700, s: 11.5, c: C.bone }) }}>{r.cp}</span>
              <span style={{ flex: '0 0 86px', textAlign: 'right', ...mono({ w: 700, s: 11.5, c: C.violetLift }) }}>{r.eff}</span>
              <span style={{ flex: '0 0 110px', textAlign: 'right', ...mono({ w: 500, s: 9, c: r.stateColor, ls: 0.12 }) }}>{r.widgetState}</span>
              <span style={{ flex: '0 0 90px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{r.bid}</span>
              <span style={{ flex: '0 0 64px', display: 'flex', justifyContent: 'flex-end' }}>
                <svg viewBox="0 0 120 32" style={{ width: '54px', height: '18px' }} aria-hidden>
                  <polyline points={r.spark} fill="none" stroke={r.trendColor} strokeWidth="3" />
                </svg>
              </span>
            </Hoverable>
          ))}
        </div>
      </div>
    </div>
  );
}
