'use client';

import { C } from '@/lib/tokens';
import { mono, text } from '@/components/ui/type';
import { useMarket } from '@/state/useMarket';

/**
 * Insights — what the spend actually bought.
 *
 * The funnel is deliberately unflattering: it runs from a million floor
 * impressions down to a few thousand external clicks, and the number
 * advertisers are billed against is the *meaningful interaction*, not the
 * impression. A market that reports only the top of its funnel is selling
 * reach it cannot prove.
 */
export function Insights() {
  const { d } = useMarket();

  return (
    <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
        {d.kpis.map((k) => (
          <div key={k.label} style={{ background: C.ground, padding: '18px' }}>
            <div style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 })}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '12px' }}>
              <span style={mono({ w: 700, s: 28, c: C.bone })}>{k.value}</span>
              <span style={mono({ w: 700, s: 10.5, c: k.color })}>{k.delta}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '26px', marginTop: '14px' }}>
              {k.bars.map((b, i) => (
                <span key={i} style={{ flex: '1 1 auto', background: k.barColor, height: b.h }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 460px', minWidth: 0, border: `1px solid ${C.line}`, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '18px' }}>
            <span style={mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 })}>ATTENTION FUNNEL — 30 DAYS</span>
            <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 })}>FIRST-PARTY EVENTS ONLY</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {d.funnel.map((f) => (
              <div key={f.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
                  <span style={mono({ w: 500, s: 10, c: C.ink, ls: 0.12 })}>{f.label}</span>
                  <span style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                    <span style={mono({ w: 700, s: 13, c: C.bone })}>{f.value}</span>
                    <span style={{ width: '44px', textAlign: 'right', ...mono({ w: 500, s: 10, c: C.grey }) }}>{f.pct}</span>
                  </span>
                </div>
                <div style={{ height: '16px', background: '#0D0D10' }}>
                  <span style={{ display: 'block', height: '16px', width: f.w, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dotted #2A2A2A', ...text({ s: 11.5, lh: 1.65, c: C.grey }) }}>
            Meaningful interaction is the metric advertisers are charged against. Raw impressions are reported
            but never billed as engagement.
          </div>
        </div>

        <div style={{ flex: '1 1 340px', minWidth: 0, border: `1px solid ${C.line}`, padding: '20px' }}>
          <div style={{ marginBottom: '18px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>CPM AGAINST AUDIENCE SCORE</div>
          <div
            style={{
              position: 'relative', border: `1px solid ${C.line}`, height: '250px',
              backgroundImage:
                'linear-gradient(rgba(124,99,203,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,99,203,0.12) 1px, transparent 1px)',
              backgroundSize: '25px 25px',
            }}
          >
            {d.scatter.map((s) => (
              <span
                key={s.name}
                title={s.name}
                style={{
                  position: 'absolute', left: s.x, bottom: s.y, width: s.d, height: s.d,
                  marginLeft: '-6px', marginBottom: '-6px', border: `1px solid ${s.color}`, background: s.fill,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '9px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.12 }) }}>
            <span>CPM $20</span><span>CPM $80</span><span>CPM $140</span>
          </div>
          <div style={{ marginTop: '14px', ...text({ s: 11.5, lh: 1.65, c: C.grey }) }}>
            Bubble size is Crown Points per dollar. Big and low means a cheap reign converting well; small and
            high means a bought throne.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 380px', minWidth: 0, border: `1px solid ${C.line}`, padding: '20px' }}>
          <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>WIDGET PERFORMANCE BY STATE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
            {d.statePerf.map((s) => (
              <span key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: C.ground, padding: '12px 14px' }}>
                <span style={{ flex: '0 0 108px', ...mono({ w: 700, s: 9.5, c: s.hue, ls: 0.13 }) }}>{s.key}</span>
                <span style={{ flex: '1 1 auto', minWidth: 0, height: '8px', background: '#0D0D10' }}>
                  <span style={{ display: 'block', height: '8px', width: s.w, background: s.hue }} />
                </span>
                <span style={{ flex: '0 0 58px', textAlign: 'right', ...mono({ w: 700, s: 12, c: C.bone }) }}>{s.rate}</span>
                <span style={{ flex: '0 0 72px', textAlign: 'right', ...mono({ s: 10.5, c: C.grey }) }}>{s.starts}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 380px', minWidth: 0, border: `1px solid ${C.line}`, padding: '20px' }}>
          <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>SPEND EFFICIENCY LEADERS</div>
          {d.efficiencyLeaders.map((e) => (
            <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: `1px solid ${C.lineSoft}` }}>
              <span style={{ flex: '0 0 22px', ...mono({ w: 700, s: 11, c: C.grey }) }}>{e.rank}</span>
              <span style={{ flex: '1 1 auto', minWidth: 0, ...mono({ w: 500, s: 11.5, c: C.bone, ls: 0.05 }) }}>{e.name}</span>
              <span style={{ flex: '0 0 76px', textAlign: 'right', ...mono({ s: 11, c: C.ink }) }}>{e.spend}</span>
              <span style={{ flex: '0 0 68px', textAlign: 'right', ...mono({ w: 700, s: 13, c: e.color }) }}>{e.eff}</span>
            </div>
          ))}
          <div style={{ marginTop: '14px', ...text({ s: 11.5, lh: 1.65, c: C.grey }) }}>
            Crown Points per dollar spent. Published because a market that hides efficiency rewards the biggest
            balance sheet.
          </div>
        </div>
      </div>
    </div>
  );
}
