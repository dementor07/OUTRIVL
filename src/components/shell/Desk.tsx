'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';

/**
 * The desk column.
 *
 * This app belongs to an advertiser managing their own product, so the right
 * column is always "your position, your spend, your move" rather than generic
 * dashboard furniture.
 */
export function Desk({ children }: { children: React.ReactNode }) {
  const { d } = useMarket();
  return (
    <div
      style={{
        flex: d.deskFlex,
        borderLeft: d.deskBorderLeft,
        borderTop: d.deskBorderTop,
        padding: '20px 18px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {children}
    </div>
  );
}

/** The ask, its trend, and the button that settles it. */
export function ChallengePanel() {
  const { d, actions } = useMarket();
  return (
    <div style={{ border: `1px solid ${C.acid}`, padding: '18px' }}>
      <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.acid, ls: 0.16 }) }}>CHALLENGE THE THRONE</div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
        <span style={mono({ w: 700, s: 44, c: C.acid })}>{d.askPrice}</span>
        <span>
          <span style={{ display: 'block', borderBottom: `1px solid ${C.bone}`, ...mono({ w: 700, s: 14, c: C.bone }) }}>USD</span>
          <span style={{ display: 'block', marginTop: '5px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>EST. CPM</span>
        </span>
      </div>

      {/* Escalation and decay made visible: the price is a live thing, and
          knowing which way it is moving is the whole skill of timing a bid. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'baseline', marginBottom: '14px' }}>
        <span style={mono({ w: 700, s: 10, c: d.askTrendColor, ls: 0.14 })}>{d.askTrend}</span>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.13 })}>{d.askDelta}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '8px 10px', border: '1px dotted #2A2A2A' }}>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>THRONE STATE</span>
        <span style={mono({ w: 700, s: 10, c: d.vulnColor, ls: 0.14 })}>{d.vulnLabel}</span>
      </div>

      <div style={{ marginBottom: '18px', ...text({ s: 13.5, lh: 1.65, c: C.ink }) }}>{d.challengeCopy}</div>

      <Hoverable
        onClick={actions.takeThrone}
        style={{
          background: C.acid, color: C.ground, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '13px 16px', cursor: 'pointer',
          ...mono({ w: 700, s: 11, ls: 0.14 }),
        }}
        hover={{ background: C.bone }}
      >
        {d.ctaLabel}
        <span>→</span>
      </Hoverable>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '14px', paddingTop: '12px', borderTop: '1px dotted #2A2A2A' }}>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>GUARANTEED MINIMUM</span>
        <span style={mono({ w: 700, s: 12, c: C.bone })}>{d.guaranteeImps}</span>
      </div>
      <div style={{ marginTop: '7px', ...text({ s: 11, lh: 1.6, c: C.grey }) }}>
        If you are outrivled before this many widget starts, the balance carries to your next reign.
      </div>

      <Hoverable
        onClick={() => actions.goNav('challenges')}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.ink, ls: 0.14 }) }}
        hover={{ color: C.acid }}
      >
        VIEW CHALLENGE DETAILS
        <span>→</span>
      </Hoverable>
    </div>
  );
}

/** Who is closest to clearing the ask right now. */
export function HighestChallenger() {
  const { d } = useMarket();
  if (!d.hasChallenger) return null;
  return (
    <div style={{ border: `1px solid ${C.line}`, padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
      <span style={{ width: '40px', height: '40px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 14, c: C.violet }) }}>
        {d.topChallengerInitial}
      </span>
      <span style={{ flex: '1 1 auto', minWidth: 0 }}>
        <span style={{ display: 'block', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>HIGHEST CHALLENGER</span>
        <span style={{ display: 'block', marginTop: '6px', ...mono({ w: 500, s: 15, c: C.bone, ls: 0.06 }) }}>{d.topChallengerName}</span>
      </span>
      <span style={{ textAlign: 'right' }}>
        <span style={{ display: 'block', ...mono({ w: 700, s: 19, c: C.bone }) }}>{d.topChallengerBid}</span>
        <span style={{ display: 'block', marginTop: '5px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>EST. CPM</span>
      </span>
    </div>
  );
}

/**
 * Season standings on the desk.
 *
 * King and Champion are shown separately and, when they differ, the reason is
 * stated. That divergence is the argument for Crown Points existing at all.
 */
export function StandingsPanel() {
  const { d } = useMarket();
  return (
    <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <span style={mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 })}>SEASON STANDINGS</span>
        <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 })}>CROWN POINTS</span>
      </div>
      {d.standings.map((st) => (
        <div key={st.rank} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', padding: '9px 0', borderBottom: `1px solid ${C.lineSoft}` }}>
          <span style={{ flex: '0 0 3px', alignSelf: 'stretch', background: st.isKing }} />
          <span style={{ flex: '0 0 20px', ...mono({ w: 700, s: 11, c: C.grey }) }}>{st.rank}</span>
          <span style={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...mono({ w: 500, s: 11.5, c: st.color, ls: 0.05 }) }}>
            {st.name}
          </span>
          <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 12, c: C.bone }) }}>{st.cp}</span>
          <span style={{ flex: '0 0 46px', textAlign: 'right', ...mono({ w: 500, s: 9.5, c: C.violetLift }) }}>{st.eff}/$</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '14px' }}>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>KING NOW</span>
        <span style={mono({ w: 500, s: 11, c: C.acid, ls: 0.05 })}>{d.kingName}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.16 })}>SEASON LEADER</span>
        <span style={mono({ w: 500, s: 11, c: C.bone, ls: 0.05 })}>{d.championName}</span>
      </div>
      {d.championSplit && (
        <div style={{ marginTop: '12px', paddingTop: '11px', borderTop: '1px dotted #2A2A2A', ...text({ s: 11, lh: 1.6, c: C.grey }) }}>
          Holding the throne and winning the season are different races. The leader is ahead on crown points
          without owning inventory right now.
        </div>
      )}
    </div>
  );
}

/** Market-wide CPM history and counters. */
export function MarketInsightsPanel() {
  const { d } = useMarket();
  return (
    <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
      <div style={{ marginBottom: '18px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>MARKET INSIGHTS</div>
      <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>AVERAGE CPM (30D)</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
        <span style={mono({ w: 700, s: 30, c: C.bone })}>$48</span>
        <span style={mono({ w: 700, s: 11, c: C.up })}>▲ 12%</span>
      </div>
      <div
        style={{
          border: `1px solid ${C.line}`, height: '132px', padding: '8px',
          backgroundImage:
            'linear-gradient(rgba(124,99,203,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(124,99,203,0.14) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <svg viewBox="0 0 240 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} aria-hidden>
          <polyline points={d.cpmSeries} fill="none" stroke={C.violetLift} strokeWidth="2" />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.12 }) }}>
        <span>MAY 5</span><span>MAY 19</span><span>JUN 2</span>
      </div>
      <div style={{ display: 'flex', gap: '1px', background: C.line, border: `1px solid ${C.line}`, marginTop: '16px' }}>
        {[
          { k: 'ACTIVE BATTLES', v: String(d.activeBattles), delta: '▲ 15%' },
          { k: 'NEW PRODUCTS (7D)', v: '17', delta: '▲ 6%' },
        ].map((s) => (
          <span key={s.k} style={{ flex: '1 1 0', background: C.ground, padding: '12px' }}>
            <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>{s.k}</span>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginTop: '8px' }}>
              <span style={mono({ w: 700, s: 22, c: C.bone })}>{s.v}</span>
              <span style={mono({ w: 700, s: 10, c: C.up })}>{s.delta}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
