'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';
import { Desk } from '@/components/shell/Desk';

/**
 * The battle feed — the market's event tape.
 *
 * Major events (a throne changing hands, a pool unlocking, a founder arriving)
 * lift onto the glass layer and carry their metrics; routine chatter stays flat
 * on the timeline. The distinction is what lets the page be scanned instead of
 * read.
 */
export function BattleFeed() {
  const { d, actions } = useMarket();

  return (
    <div style={{ display: 'flex', flexDirection: d.shellDir, alignItems: 'stretch', minWidth: 0 }}>
      <div style={{ flex: '1 1 auto', minWidth: 0, padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', border: `1px solid ${C.line}`, padding: '10px 14px' }}>
          <span style={{ marginRight: '6px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>EVENTS</span>
          {d.feedFilters.map((f) => (
            <Hoverable
              as="span"
              key={f.key}
              onClick={() => actions.setFeedFilter(f.key)}
              style={{ padding: '5px 10px', border: `1px solid ${f.border}`, cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: f.color, ls: 0.12 }) }}
              hover={{ borderColor: C.ink }}
            >
              {f.label}
            </Hoverable>
          ))}
          <span style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.15 }) }}>
            <span style={{ width: '5px', height: '5px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
            {d.feedRate}
          </span>
        </div>

        {d.feedEvents.length === 0 && (
          <div
            style={{
              padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: '10px',
              border: `1px solid ${C.line}`,
              backgroundImage: 'radial-gradient(rgba(233,224,196,0.07) 1px, transparent 1px)',
              backgroundSize: '4px 4px',
            }}
          >
            <span style={mono({ w: 700, s: 10, c: C.ink, ls: 0.16 })}>NO EVENTS OF THIS KIND YET</span>
            <span style={{ maxWidth: '60ch', ...text({ s: 12.5, lh: 1.7, c: C.grey }) }}>
              The tape only records settled facts. Nothing of this kind has happened in the current window.
            </span>
          </div>
        )}

        {d.feedEvents.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'stretch', animation: 'om-rise 220ms ease-out' }}>
            <span style={{ flex: '0 0 76px', paddingTop: '16px', ...mono({ s: 10.5, c: C.grey, ls: 0.08 }) }}>{e.time}</span>
            <span style={{ flex: '0 0 34px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: '11px', height: '11px', marginTop: '16px', background: e.dot, display: 'block' }} />
              <span style={{ flex: '1 1 auto', width: '1px', background: C.lineDeep, marginTop: '6px' }} />
            </span>
            <span
              style={{
                flex: '1 1 auto', minWidth: 0, marginBottom: '12px', border: `1px solid ${e.border}`,
                background: e.bg, backdropFilter: e.blur, WebkitBackdropFilter: e.blur,
                boxShadow: e.shadow, padding: e.pad,
              }}
            >
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'baseline' }}>
                <span style={mono({ w: 700, s: 9, c: e.kindColor, ls: 0.16 })}>{e.kind}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, fontSize: e.titleSize, color: C.bone, letterSpacing: '0.04em' }}>
                  {e.title}
                </span>
                <span style={{ marginLeft: 'auto', ...mono({ s: 10, c: C.grey }) }}>{e.market}</span>
              </span>
              <span style={{ display: 'block', marginTop: '9px', maxWidth: '76ch', ...text({ s: 12.5, lh: 1.65, c: C.ink }) }}>{e.body}</span>
              {e.big && e.metrics.length > 0 && (
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', marginTop: '14px', paddingTop: '12px', borderTop: '1px dotted rgba(233,224,196,0.16)' }}>
                  {e.metrics.map((m) => (
                    <span key={m.k} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                      <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>{m.k}</span>
                      <span style={mono({ w: 700, s: 14, c: m.c })}>{m.v}</span>
                    </span>
                  ))}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <Desk>
        <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
          <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>LAST 24 HOURS</div>
          {d.feedCounters.map((c) => (
            <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', padding: '10px 0', borderBottom: `1px solid ${C.lineSoft}` }}>
              <span style={mono({ w: 500, s: 9.5, c: C.ink, ls: 0.1 })}>{c.label}</span>
              <span style={mono({ w: 700, s: 14, c: c.color })}>{c.value}</span>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
          <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>MOST CONTESTED</div>
          {d.contested.map((ct) => (
            <div key={ct.name} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
                <span style={mono({ w: 500, s: 11, c: C.bone, ls: 0.05 })}>{ct.name}</span>
                <span style={mono({ w: 700, s: 10.5, c: C.violetLift })}>{ct.count}</span>
              </div>
              <div style={{ height: '5px', background: C.fillIdle }}>
                <span style={{ display: 'block', height: '5px', width: ct.w, background: C.violet }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
          <div style={{ marginBottom: '12px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>FOUNDERS ONLINE</div>
          {d.presenceList.map((pr) => (
            <div key={pr.who} style={{ display: 'flex', gap: '11px', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.lineSoft}` }}>
              <span style={{ position: 'relative', flex: '0 0 30px', height: '30px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 9, c: C.ink }) }}>
                {pr.initial}
                <span style={{ position: 'absolute', right: '-3px', bottom: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: C.up, border: `2px solid ${C.ground}` }} />
              </span>
              <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                <span style={{ display: 'block', ...mono({ w: 500, s: 11, c: C.bone, ls: 0.04 }) }}>{pr.who}</span>
                <span style={{ display: 'block', marginTop: '4px', ...text({ s: 10.5, c: C.grey }) }}>{pr.status}</span>
              </span>
            </div>
          ))}
        </div>
      </Desk>
    </div>
  );
}
