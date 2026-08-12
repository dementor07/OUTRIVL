'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { Glass } from '@/components/ui/Glass';
import { useMarket } from '@/state/useMarket';

/**
 * The Floor — the same ladder rendered as a place.
 *
 * Footprint is rank: #1 physically occupies the room and the field compresses
 * around it, so standing is legible before a single number is read. The pulses
 * are aggregated real interactions, never invented bustle — a market that fakes
 * activity is worthless as a market.
 *
 * Deliberately not the beige cute-isometric treatment of the mechanic
 * reference: that plate is a mechanic inspiration only, and the brief rejects
 * copying its visual language.
 */
export function Floor() {
  const { d, actions } = useMarket();

  return (
    <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ border: `1px solid ${C.line}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '22px', padding: '11px 16px' }}>
        <span style={mono({ w: 500, s: 8.5, c: C.greyDeep, ls: 0.15 })}>
          THE SAME LADDER, RENDERED AS A PLACE — FOOTPRINT IS RANK
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'baseline' }}>
          <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>VISITORS</span>
          <span style={mono({ w: 700, s: 13, c: C.bone })}>{d.floorVisitors}</span>
        </span>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
          <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>WIDGETS RUNNING</span>
          <span style={mono({ w: 700, s: 13, c: C.violetLift })}>{d.floorRunning}</span>
        </span>
      </div>

      <div
        style={{
          position: 'relative', border: `1px solid ${C.line}`, overflow: 'hidden',
          backgroundImage:
            'linear-gradient(rgba(124,99,203,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,99,203,0.08) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 180px rgba(0,0,0,0.9)', zIndex: 2 }} />
        <div
          style={{
            position: 'absolute', top: '-160px', left: '14%', width: '520px', height: '520px',
            borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(207,218,79,0.13) 0%, rgba(207,218,79,0) 64%)',
            animation: 'om-halo 8s ease-in-out infinite',
          }}
        />

        <div style={{ position: 'relative', height: '640px', padding: '20px' }}>
          {d.floorPulse.map((fp, i) => (
            <span
              key={i}
              style={{
                position: 'absolute', left: fp.x, top: fp.y, width: '16px', height: '16px',
                borderRadius: '50%', border: '1px solid rgba(164,143,230,0.7)',
                animation: 'om-ring 2.8s ease-out infinite', animationDelay: fp.delay, pointerEvents: 'none',
              }}
            />
          ))}

          {d.floorBooths.map((b) => (
            <Hoverable
              key={b.id}
              onClick={() => actions.setFocus(b.id)}
              ariaLabel={`Focus ${b.name}, rank ${b.rank}`}
              style={{
                position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h,
                border: `1px solid ${b.border}`, background: 'rgba(11,11,15,0.66)',
                backdropFilter: 'blur(10px) saturate(140%)', WebkitBackdropFilter: 'blur(10px) saturate(140%)',
                boxShadow: b.shadow, padding: '12px', cursor: 'pointer', display: 'flex',
                flexDirection: 'column', zIndex: 1,
                transition: 'border-color 120ms linear, transform 120ms linear',
              }}
              hover={{ borderColor: C.violetLift, transform: 'translateY(-2px)' }}
            >
              <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: b.glow }} />
              <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ lineHeight: 1, fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: b.rankSize, color: b.hue }}>
                  {b.rank}
                </span>
                {b.present && (
                  <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.up, display: 'block', animation: 'om-blink 1.9s steps(1,end) infinite' }} />
                    <span style={mono({ w: 700, s: 7.5, c: C.up, ls: 0.13 })}>FOUNDER ONLINE</span>
                  </span>
                )}
              </span>
              <span style={{ position: 'relative', marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: b.nameSize, color: C.bone, letterSpacing: '0.05em' }}>
                {b.name}
              </span>
              {b.showMeta && (
                <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                  <span style={mono({ w: 500, s: 8, c: C.grey, ls: 0.13 })}>{b.metric}</span>
                  <span style={mono({ w: 500, s: 8, c: C.violetLift, ls: 0.13 })}>{b.state}</span>
                </span>
              )}
            </Hoverable>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderTop: `1px solid ${C.line}`, background: C.ground }}>
          <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>
            FOOTPRINT = RANK · PULSES ARE AGGREGATED REAL INTERACTIONS, NEVER FAKE BUSTLE
          </span>
          <span style={{ display: 'flex', gap: '18px' }}>
            {[
              { c: C.bone, l: 'THRONE' },
              { c: C.violet, l: 'CONTENDER' },
              { c: C.up, l: 'FOUNDER PRESENT' },
            ].map((k) => (
              <span key={k.l} style={{ display: 'flex', gap: '7px', alignItems: 'center', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.13 }) }}>
                <span style={{ width: '8px', height: '8px', background: k.c, display: 'block' }} />
                {k.l}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'stretch' }}>
        <FocusedBooth />
        <OfficeHours />
      </div>
    </div>
  );
}

/** The booth you're standing in front of. Glass, because it's ephemeral. */
function FocusedBooth() {
  const { d, actions } = useMarket();
  return (
    <Glass style={{ flex: '1 1 420px', minWidth: 0, padding: '20px' }} border="rgba(233,224,196,0.14)">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ width: '44px', height: '44px', border: '1px solid rgba(233,224,196,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 16, c: C.bone }) }}>
          {d.focusInitial}
        </span>
        <span>
          <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>FOCUSED BOOTH — {d.focusRank}</span>
          <span style={{ display: 'block', marginTop: '7px', ...display({ s: 21, c: C.bone }) }}>{d.focusName}</span>
        </span>
        {d.focusPresent && (
          <span style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.up, display: 'block', animation: 'om-blink 1.8s steps(1,end) infinite' }} />
              <span style={mono({ w: 700, s: 9, c: C.up, ls: 0.14 })}>FOUNDER ONLINE</span>
            </span>
            <span style={text({ s: 11, c: C.ink })}>{d.focusPresenceStatus}</span>
          </span>
        )}
      </div>

      <div style={{ marginBottom: '18px', maxWidth: '56ch', ...text({ s: 13.5, lh: 1.7, c: C.ink }) }}>{d.focusPitch}</div>

      <div style={{ display: 'flex', gap: '1px', background: 'rgba(233,224,196,0.12)', border: '1px solid rgba(233,224,196,0.12)', marginBottom: '18px' }}>
        {d.focusStats.map((fs) => (
          <span key={fs.k} style={{ flex: '1 1 0', background: 'rgba(6,6,8,0.6)', padding: '12px' }}>
            <span style={{ display: 'block', ...mono({ w: 500, s: 8, c: C.grey, ls: 0.15 }) }}>{fs.k}</span>
            <span style={{ display: 'block', marginTop: '7px', ...mono({ w: 700, s: 17, c: fs.c }) }}>{fs.v}</span>
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <Hoverable
          as="span"
          onClick={actions.goStudioPreview}
          style={{ display: 'flex', alignItems: 'center', gap: '11px', background: C.violet, color: C.ground, padding: '12px 16px', cursor: 'pointer', ...mono({ w: 700, s: 10, ls: 0.14 }) }}
          hover={{ background: C.violetLift }}
        >
          ACTIVATE WIDGET ⚡
        </Hoverable>
        <Hoverable
          as="span"
          onClick={actions.openSite}
          style={{ display: 'flex', alignItems: 'center', gap: '11px', border: `1px solid ${C.line}`, color: C.bone, padding: '12px 16px', cursor: 'pointer', ...mono({ w: 500, s: 10, ls: 0.14 }) }}
          hover={{ borderColor: C.bone }}
        >
          OPEN LIVE SITE ↗
        </Hoverable>
        <Hoverable
          as="span"
          onClick={actions.openFocusProduct}
          style={{ display: 'flex', alignItems: 'center', gap: '11px', border: `1px solid ${C.line}`, color: C.bone, padding: '12px 16px', cursor: 'pointer', ...mono({ w: 500, s: 10, ls: 0.14 }) }}
          hover={{ borderColor: C.bone }}
        >
          OPEN PRODUCT PAGE →
        </Hoverable>
        {d.focusPresent && (
          <Hoverable
            as="span"
            style={{ display: 'flex', alignItems: 'center', gap: '11px', border: '1px solid #2A4A2A', color: C.up, padding: '12px 16px', cursor: 'pointer', ...mono({ w: 500, s: 10, ls: 0.14 }) }}
            hover={{ borderColor: C.up }}
          >
            ASK A QUESTION
          </Hoverable>
        )}
      </div>
    </Glass>
  );
}

/** Scheduled founder windows. Flat — this is a published record, not live state. */
function OfficeHours() {
  const { d } = useMarket();
  return (
    <div style={{ flex: '1 1 300px', minWidth: 0, border: `1px solid ${C.line}`, padding: '20px' }}>
      <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>OFFICE HOURS TODAY</div>
      {d.officeHours.map((o) => (
        <div key={o.name} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.lineSoft}` }}>
          <span style={{ flex: '0 0 62px', ...mono({ w: 700, s: 11, c: o.timeColor }) }}>{o.time}</span>
          <span style={{ flex: '1 1 auto', minWidth: 0 }}>
            <span style={{ display: 'block', ...mono({ w: 500, s: 11.5, c: C.bone, ls: 0.04 }) }}>{o.name}</span>
            <span style={{ display: 'block', marginTop: '4px', ...text({ s: 10.5, c: C.grey }) }}>{o.topic}</span>
          </span>
          <span style={{ flex: '0 0 auto', border: `1px solid ${o.stateBorder}`, padding: '3px 7px', ...mono({ w: 700, s: 8.5, c: o.stateColor, ls: 0.13 }) }}>
            {o.state}
          </span>
        </div>
      ))}
      <div style={{ marginTop: '14px', ...text({ s: 11.5, lh: 1.65, c: C.grey }) }}>
        Presence is opt-in and rate-limited. A team can be present without exposing which person is active.
      </div>
    </div>
  );
}
