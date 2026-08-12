'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { Meter } from '@/components/ui/Meter';
import { useMarket } from '@/state/useMarket';
import { Desk } from '@/components/shell/Desk';
import type { WidgetState } from '@/lib/types';

/**
 * Widget Studio — where a listing is authored.
 *
 * The point of the simulator is that there is *one* spec and six canvases.
 * Switching state re-renders the same widget at a different size rather than
 * showing six separate designs, which is what makes the "listings are software"
 * claim checkable instead of rhetorical.
 */
export function Studio() {
  const { d, actions } = useMarket();
  const b = d.brandThrone;
  const sc = d.sc;

  return (
    <div style={{ display: 'flex', flexDirection: d.shellDir, alignItems: 'stretch', minWidth: 0 }}>
      <div style={{ flex: '1 1 auto', minWidth: 0, padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', border: `1px solid ${C.line}`, padding: '11px 14px' }}>
          <span style={{ marginRight: '6px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>RENDER STATE</span>
          {d.studioStates.map((s) => (
            <Hoverable
              as="span"
              key={s.key}
              onClick={() => actions.setStudioState(s.key as WidgetState)}
              style={{ padding: '6px 11px', border: `1px solid ${s.border}`, background: s.bg, cursor: 'pointer', ...mono({ w: 700, s: 9.5, c: s.color, ls: 0.13 }) }}
              hover={{ borderColor: C.ink }}
            >
              {s.key}
            </Hoverable>
          ))}
          <span style={{ marginLeft: 'auto', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>{d.studioSize}</span>
        </div>

        <div
          style={{
            position: 'relative', border: `1px solid ${C.line}`, padding: '34px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', minHeight: '470px',
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(233,224,196,0.03) 0px, rgba(233,224,196,0.03) 1px, transparent 1px, transparent 3px), radial-gradient(rgba(233,224,196,0.05) 1px, transparent 1px)',
            backgroundSize: 'auto, 4px 4px',
          }}
        >
          <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 110px rgba(0,0,0,0.8)' }} />
          <span style={{ position: 'absolute', top: '12px', left: '14px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>
            SIMULATOR — SAME BUDGETS AS PRODUCTION
          </span>

          <div style={{ position: 'relative', width: sc.w, maxWidth: '100%', background: b.bg, border: `1px solid ${b.line}`, boxShadow: '0 30px 70px rgba(0,0,0,0.75)', padding: sc.pad }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: sc.gap }}>
              <span style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: 0 }}>
                <span style={{ width: sc.mark, height: sc.mark, flex: '0 0 auto', borderRadius: b.radius, background: b.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: sc.markFont, color: b.bg }}>
                  {b.label.charAt(0)}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: b.font, fontWeight: 600, fontSize: sc.title, color: b.ink, letterSpacing: '-0.01em' }}>{b.label}</span>
                  {sc.showSub && (
                    <span style={{ display: 'block', marginTop: '5px', fontFamily: b.font, fontSize: '10.5px', color: b.dim }}>{d.studioSub}</span>
                  )}
                </span>
              </span>
              <span style={{ whiteSpace: 'nowrap', ...mono({ w: 500, s: 8.5, c: b.accent, ls: 0.14 }) }}>{d.studioStateLabel}</span>
            </div>

            {sc.lanes && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sc.cols},minmax(0,1fr))`, gap: '10px' }}>
                {d.studioLanes.map((lane) => (
                  <div key={lane.key} style={{ minHeight: sc.laneH }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', paddingBottom: '8px', marginBottom: '9px', borderBottom: `1px solid ${b.line}` }}>
                      <span style={{ fontFamily: b.font, fontWeight: 600, fontSize: '9.5px', color: b.accent, letterSpacing: '0.08em' }}>{lane.name}</span>
                      <span style={{ fontFamily: b.font, fontSize: '9px', color: b.dim }}>{lane.count}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {lane.items.map((c) => (
                        <Hoverable
                          key={c.id}
                          onClick={() => actions.moveCard(c.id)}
                          style={{ border: `1px solid ${b.line}`, borderRadius: b.radius, background: d.brandThroneCard, padding: '8px 9px', cursor: 'pointer', fontFamily: b.font, fontSize: '11px', lineHeight: 1.4, color: b.ink, transition: 'transform 90ms linear' }}
                          hover={{ transform: 'translateX(2px)' }}
                        >
                          {c.label}
                        </Hoverable>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* At ROW and CARD size there is no room for lanes, so the widget
                degrades to an abstract of itself rather than a cropped board. */}
            {sc.strip && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {d.studioStrip.map((sb, i) => (
                  <span key={i} style={{ height: sb.h, width: sb.w, background: sb.c, display: 'block', borderRadius: b.radius }} />
                ))}
              </div>
            )}

            {sc.foot && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'space-between', marginTop: '13px', paddingTop: '11px', borderTop: `1px solid ${b.line}` }}>
                {[
                  { k: 'STARTS', v: '184.2K', c: C.bone },
                  { k: 'INTERACTION', v: '31%', c: C.bone },
                  { k: 'MOVES', v: d.throneMoves, c: C.acid },
                ].map((m) => (
                  <span key={m.k} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={mono({ w: 500, s: 8, c: C.grey, ls: 0.15 })}>{m.k}</span>
                    <span style={mono({ w: 700, s: 12, c: m.c })}>{m.v}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 340px', minWidth: 0, border: `1px solid ${C.line}`, padding: '18px' }}>
            <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>WIDGETSPEC</div>
            <pre style={{ border: `1px solid ${C.lineSoft}`, background: C.panel, padding: '14px', margin: 0, overflowX: 'auto', ...mono({ s: 11.5, lh: 1.85, c: C.ink }) }}>
              {d.specLines.map((sl, i) => (
                <div key={i} style={{ whiteSpace: 'pre', color: sl.color }}>{sl.text}</div>
              ))}
            </pre>
          </div>
          <div style={{ flex: '1 1 300px', minWidth: 0, border: `1px solid ${C.line}`, padding: '18px' }}>
            <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>VERSION HISTORY</div>
            {d.versions.map((v) => (
              <div key={v.label} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.lineSoft}` }}>
                <span style={{ flex: '0 0 3px', alignSelf: 'stretch', minHeight: '30px', background: v.bar }} />
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span style={{ display: 'block', ...mono({ w: 500, s: 11.5, c: C.bone }) }}>{v.label}</span>
                  <span style={{ display: 'block', marginTop: '4px', ...text({ s: 10.5, c: C.grey }) }}>{v.note}</span>
                </span>
                <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 8.5, c: v.stateColor, ls: 0.13 }) }}>{v.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Desk>
        <BrandExpression />
        <Validation />
        <Fallback />
      </Desk>
    </div>
  );
}

function BrandExpression() {
  const { d, actions } = useMarket();
  const b = d.brandThrone;
  return (
    <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
      <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>BRAND EXPRESSION</div>
      <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ width: '26px', height: '26px', flex: '0 0 auto', borderRadius: b.radius, background: b.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono({ w: 700, s: 11, c: b.bg }) }}>
          {b.label.charAt(0)}
        </span>
        <span style={{ flex: '1 1 auto', minWidth: 0, ...mono({ w: 500, s: 11, c: C.bone, ls: 0.04 }) }}>{b.label} PALETTE</span>
      </div>
      <Hoverable
        onClick={actions.toggleAutoTone}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 12px', border: `1px solid ${d.autoToneBorder}`, cursor: 'pointer', marginBottom: '10px' }}
        hover={{ borderColor: C.ink }}
      >
        <span style={mono({ w: 500, s: 9.5, c: C.ink, ls: 0.13 })}>AUTO-TONE TO BOARD</span>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ width: '7px', height: '7px', background: d.autoToneDot, display: 'block' }} />
          <span style={mono({ w: 700, s: 9.5, c: d.autoToneColor, ls: 0.13 })}>{d.autoToneLabel}</span>
        </span>
      </Hoverable>
      <div style={{ marginBottom: '20px', ...text({ s: 11, lh: 1.6, c: C.grey }) }}>
        Off, the widget renders in the advertiser&apos;s own palette and type. On, OUTRIVL pulls it toward the
        board so a crowded market still reads as one screen. Structure is constrained either way; colour never
        is.
      </div>

      <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>TEMPLATE</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1A1A1A' }}>
        {d.templates.map((t) => (
          <Hoverable
            as="span"
            key={t.key}
            onClick={() => actions.setTemplate(t.key)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: t.bg, padding: '11px 12px', cursor: 'pointer' }}
            hover={{ background: C.hover }}
          >
            <span style={mono({ w: 500, s: 10.5, c: t.color, ls: 0.08 })}>{t.label}</span>
            <span style={mono({ s: 9, c: C.grey })}>{t.kind}</span>
          </Hoverable>
        ))}
      </div>
    </div>
  );
}

/** Glass: validation is a live judgement on an unpublished draft. */
function Validation() {
  const { d, actions } = useMarket();
  return (
    <div
      style={{
        background: 'rgba(18,18,22,0.6)', backdropFilter: 'blur(18px) saturate(150%)',
        WebkitBackdropFilter: 'blur(18px) saturate(150%)', border: '1px solid rgba(233,224,196,0.14)',
        boxShadow: 'inset 0 1px 0 rgba(233,224,196,0.12), 0 24px 60px rgba(0,0,0,0.6)', padding: '18px',
      }}
    >
      <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>VALIDATION</div>
      {d.checks.map((c) => (
        <div key={c.label} style={{ display: 'flex', gap: '11px', alignItems: 'baseline', padding: '9px 0', borderBottom: '1px solid rgba(233,224,196,0.07)' }}>
          <span style={{ flex: '0 0 12px', ...mono({ w: 700, s: 10, c: c.color }) }}>{c.glyph}</span>
          <span style={{ flex: '1 1 auto', minWidth: 0, ...text({ s: 11.5, lh: 1.5, c: C.ink }) }}>{c.label}</span>
          <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 9, c: c.color }) }}>{c.value}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px', paddingTop: '14px', borderTop: '1px dotted rgba(233,224,196,0.16)' }}>
        <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>RUNTIME BUDGET</span>
        <span style={mono({ w: 700, s: 12, c: C.up })}>{d.budgetUse}</span>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Meter segs={d.budgetSegs} height={6} />
      </div>
      <Hoverable
        onClick={actions.publish}
        style={{ background: C.acid, color: C.ground, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', marginTop: '18px', cursor: 'pointer', ...mono({ w: 700, s: 11, ls: 0.14 }) }}
        hover={{ background: C.bone }}
      >
        {d.publishLabel}
        <span>→</span>
      </Hoverable>
      <div style={{ marginTop: '12px', ...text({ s: 11, lh: 1.6, c: C.grey }) }}>
        Approved versions are immutable. Any edit produces a new version and can be A/B tested against the live
        one.
      </div>
    </div>
  );
}

/**
 * The fallback.
 *
 * Every widget must degrade to something static — for reduced-motion, weak
 * devices, or a policy block. Showing it in the authoring tool makes it a
 * design decision rather than an accident.
 */
function Fallback() {
  const { d } = useMarket();
  return (
    <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
      <div style={{ marginBottom: '12px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>FALLBACK REPRESENTATION</div>
      <div style={{ border: `1px solid ${C.lineSoft}`, padding: '14px', display: 'flex', gap: '12px', alignItems: 'center', background: C.panel }}>
        <span style={{ width: '38px', height: '38px', flex: '0 0 auto', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 13, c: C.ink }) }}>
          {d.studioInitial}
        </span>
        <span>
          <span style={{ display: 'block', ...mono({ w: 500, s: 11.5, c: C.bone }) }}>{d.studioName}</span>
          <span style={{ display: 'block', marginTop: '4px', ...text({ s: 10.5, c: C.grey }) }}>
            Static card served on reduced-motion, weak devices or policy block.
          </span>
        </span>
      </div>
    </div>
  );
}
