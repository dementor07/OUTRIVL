'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';

const HEAD = { ...mono({ w: 700, s: 10, c: C.violet, ls: 0.16 }) };

/**
 * Performance.
 *
 * Reads the product's own figures rather than a second invented set, so this
 * tab can never disagree with the desk beside it. The efficiency number is
 * present and unflattering on purpose.
 */
export function PerformanceTab() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
        {d.perfMetrics.map((m) => (
          <div key={m.k} style={{ background: C.ground, padding: '16px 18px' }}>
            <div style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 })}>{m.k}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '9px', marginTop: '10px' }}>
              <span style={mono({ w: 700, s: 24, c: C.bone })}>{m.v}</span>
              <span style={mono({ w: 700, s: 10, c: m.c })}>{m.d}</span>
            </div>
            <div style={{ marginTop: '8px', ...mono({ w: 500, s: 8, c: C.greyDeep, ls: 0.14 }) }}>{m.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ flex: '1 1 380px', minWidth: 0 }}>
          <div style={{ marginBottom: '14px', ...HEAD }}>WIDGET STARTS BY RENDER STATE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
            {d.perfStates.map((s) => (
              <span key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: C.ground, padding: '11px 13px' }}>
                <span style={{ flex: '0 0 104px', ...mono({ w: 700, s: 9, c: s.hue, ls: 0.13 }) }}>{s.key}</span>
                <span style={{ flex: '1 1 auto', minWidth: 0, height: '8px', background: '#0D0D10' }}>
                  <span style={{ display: 'block', height: '8px', width: s.w, background: s.hue }} />
                </span>
                <span style={{ flex: '0 0 62px', textAlign: 'right', ...mono({ s: 10.5, c: C.grey }) }}>{s.starts}</span>
                <span style={{ flex: '0 0 44px', textAlign: 'right', ...mono({ w: 700, s: 11.5, c: C.bone }) }}>{s.rate}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          <div style={{ marginBottom: '14px', ...HEAD }}>RANK HISTORY — 30 DAYS</div>
          <div
            style={{
              border: `1px solid ${C.line}`, height: '186px', padding: '8px',
              backgroundImage:
                'linear-gradient(rgba(124,99,203,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,99,203,0.12) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <svg viewBox="0 0 240 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} aria-hidden>
              <polyline points={d.rankSeries} fill="none" stroke={C.violetLift} strokeWidth="2" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.12 }) }}>
            <span>MAY 5</span><span>MAY 19</span><span>JUN 2</span>
          </div>
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '14px', ...HEAD }}>REIGN HISTORY</div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', padding: '0 14px', height: '32px', alignItems: 'center', background: '#0B0B0D', borderBottom: `1px solid ${C.line}`, minWidth: '680px' }}>
            {[['WHEN', '0 0 130px', 'left'], ['HELD FOR', '0 0 110px', 'left'], ['CROWN PTS', '0 0 100px', 'right'], ['PEAK', '0 0 70px', 'right'], ['OUTCOME', '1 1 200px', 'right']].map(([k, f, a]) => (
              <span key={k} style={{ flex: f as string, textAlign: a as 'left' | 'right', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>{k}</span>
            ))}
          </div>
          {d.perfReigns.map((r) => (
            <div key={r.when} style={{ display: 'flex', padding: '0 14px', height: '40px', alignItems: 'center', borderBottom: `1px solid ${C.lineSoft}`, minWidth: '680px' }}>
              <span style={{ flex: '0 0 130px', ...mono({ s: 10.5, c: C.grey }) }}>{r.when}</span>
              <span style={{ flex: '0 0 110px', ...mono({ s: 11.5, c: C.ink }) }}>{r.held}</span>
              <span style={{ flex: '0 0 100px', textAlign: 'right', ...mono({ w: 700, s: 11.5, c: C.violetLift }) }}>{r.cp}</span>
              <span style={{ flex: '0 0 70px', textAlign: 'right', ...display({ s: 11, c: C.bone }) }}>{r.peak}</span>
              <span style={{ flex: '1 1 200px', textAlign: 'right', ...mono({ w: 700, s: 9.5, c: r.color, ls: 0.13 }) }}>{r.outcome}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Discussion — a real thread with replies, not three floating quotes. */
export function DiscussionTab() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span style={HEAD}>DISCUSSION</span>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.14 })}>128 COMMENTS · RATE-LIMITED, NO ANONYMOUS POSTS</span>
      </div>

      <div style={{ border: `1px solid ${C.line}`, padding: '14px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <span style={{ width: '30px', height: '30px', flex: '0 0 auto', border: `1px solid ${C.acid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono({ w: 700, s: 10, c: C.acid }) }}>
          OD
        </span>
        <span style={{ flex: '1 1 240px', minWidth: 0, padding: '10px 12px', border: `1px solid ${C.lineSoft}`, background: C.panel, ...text({ s: 12.5, c: C.grey }) }}>
          Ask the team something…
        </span>
        <Hoverable
          as="span"
          style={{ padding: '10px 16px', border: `1px solid ${C.line}`, cursor: 'pointer', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.14 }) }}
          hover={{ borderColor: C.acid, color: C.acid }}
        >
          POST
        </Hoverable>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {d.discussion.map((cm) => (
          <div key={cm.who} style={{ display: 'flex', gap: '12px' }}>
            <span style={{ flex: '0 0 32px', height: '32px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 9, c: C.ink }) }}>
              {cm.initial}
            </span>
            <span style={{ flex: '1 1 auto', minWidth: 0 }}>
              <span style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={mono({ w: 500, s: 11.5, c: C.bone })}>{cm.who}</span>
                <span style={mono({ s: 10, c: C.grey })}>{cm.when}</span>
                <span style={{ marginLeft: 'auto', ...mono({ w: 700, s: 11, c: C.up }) }}>{cm.score} ▲</span>
              </span>
              <span style={{ display: 'block', marginTop: '6px', ...text({ s: 13, lh: 1.6, c: C.ink }) }}>{cm.body}</span>

              {cm.replies.map((r) => (
                <span key={r.who + r.when} style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingLeft: '14px', borderLeft: `1px solid ${C.lineSoft}` }}>
                  <span style={{ flex: '0 0 26px', height: '26px', border: `1px solid ${r.team ? 'rgba(124,194,107,0.4)' : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 8, c: r.team ? C.up : C.ink }) }}>
                    {r.initial}
                  </span>
                  <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <span style={{ display: 'flex', gap: '9px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <span style={mono({ w: 500, s: 11, c: C.bone })}>{r.who}</span>
                      {r.team && (
                        <span style={{ border: '1px solid rgba(124,194,107,0.4)', padding: '2px 5px', ...mono({ w: 700, s: 7.5, c: C.up, ls: 0.13 }) }}>TEAM</span>
                      )}
                      <span style={mono({ s: 9.5, c: C.grey })}>{r.when}</span>
                    </span>
                    <span style={{ display: 'block', marginTop: '5px', ...text({ s: 12.5, lh: 1.6, c: C.ink }) }}>{r.body}</span>
                  </span>
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Updates — product and market changes on one timeline. */
export function UpdatesTab() {
  const { d } = useMarket();
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'baseline', marginBottom: '20px' }}>
        <span style={HEAD}>UPDATES</span>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.14 })}>PRODUCT AND MARKET EVENTS, NEWEST FIRST</span>
      </div>
      {d.updates.map((u) => (
        <div key={u.v + u.when} style={{ display: 'flex', gap: '16px', alignItems: 'stretch', paddingBottom: '4px' }}>
          <span style={{ flex: '0 0 74px', paddingTop: '16px', ...mono({ s: 10, c: C.grey, ls: 0.1 }) }}>{u.when}</span>
          <span style={{ flex: '0 0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: '9px', height: '9px', marginTop: '18px', background: u.tagColor, display: 'block' }} />
            <span style={{ flex: '1 1 auto', width: '1px', background: C.lineDeep, marginTop: '6px' }} />
          </span>
          <span style={{ flex: '1 1 auto', minWidth: 0, marginBottom: '14px', border: `1px solid ${C.lineSoft}`, background: C.panel, padding: '14px 16px' }}>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'baseline' }}>
              <span style={{ border: `1px solid ${u.tagColor}`, padding: '2px 6px', ...mono({ w: 700, s: 8, c: u.tagColor, ls: 0.14 }) }}>{u.tag}</span>
              <span style={mono({ w: 500, s: 13, c: C.bone, ls: 0.04 })}>{u.title}</span>
              <span style={{ marginLeft: 'auto', ...mono({ w: 700, s: 10, c: C.grey }) }}>{u.v}</span>
            </span>
            <span style={{ display: 'block', marginTop: '9px', maxWidth: '72ch', ...text({ s: 12.5, lh: 1.65, c: C.ink }) }}>{u.body}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Team — who is behind the product, and who is reachable. */
export function TeamTab() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
      <div style={{ flex: '1 1 340px', minWidth: 0 }}>
        <div style={{ marginBottom: '16px', ...HEAD }}>THE TEAM</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
          {d.teamMembers.map((m) => (
            <span key={m.i} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: C.ground, padding: '13px 14px' }}>
              <span style={{ position: 'relative', flex: '0 0 34px', height: '34px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 10, c: C.ink }) }}>
                {m.i}
                {m.on && <span style={{ position: 'absolute', right: '-3px', bottom: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: C.up, border: `2px solid ${C.ground}` }} />}
              </span>
              <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                <span style={{ display: 'block', ...mono({ w: 500, s: 12, c: C.bone, ls: 0.04 }) }}>{m.n}</span>
                <span style={{ display: 'block', marginTop: '4px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>{m.r}</span>
              </span>
              {m.on && <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 8, c: C.up, ls: 0.13 }) }}>ONLINE</span>}
            </span>
          ))}
        </div>
        <div style={{ marginTop: '14px', ...text({ s: 11.5, lh: 1.65, c: C.grey }) }}>
          Presence is opt-in. A team can be reachable without exposing which individual is answering.
        </div>
      </div>

      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
        <div style={{ marginBottom: '16px', ...HEAD }}>OPPORTUNITIES</div>
        {d.opportunities.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
            {d.opportunities.map((o) => (
              <span key={o.label} style={{ border: `1px solid ${o.border}`, padding: '7px 10px', ...mono({ w: 700, s: 9, c: o.color, ls: 0.13 }) }}>
                {o.label}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: '18px', ...text({ s: 12.5, lh: 1.65, c: C.grey }) }}>
            No open roles or partnerships declared right now.
          </div>
        )}
        <div style={{ border: `1px solid ${C.line}`, padding: '16px' }}>
          <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>OFFICE HOURS</div>
          <div style={{ marginBottom: '12px', ...mono({ w: 700, s: 12, c: d.founderStateColor, ls: 0.12 }) }}>{d.founderHours}</div>
          <div style={text({ s: 12, lh: 1.65, c: C.ink })}>&ldquo;{d.founderStatus}&rdquo;</div>
        </div>
      </div>
    </div>
  );
}
