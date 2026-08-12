'use client';

import { C } from '@/lib/tokens';
import { mono } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';

/**
 * The throne canvas — the #1 position's full render state.
 *
 * This is an advertiser's own product miniature, not an ad slot. It carries
 * their colour, their type and their corner radius; OUTRIVL owns only the
 * chrome bar above it and the telemetry strip below. If every widget rendered
 * in OUTRIVL violet the listing would be ours rather than theirs, and the board
 * would stop looking like eighteen different companies.
 *
 * It is also genuinely interactive: clicking a card advances it, and the MOVES
 * counter is real. Listings here are software, not pictures of software.
 */
export function ThroneCanvas() {
  const { d, actions } = useMarket();
  const b = d.brandThrone;

  return (
    <div style={{ flex: '1 1 320px', minWidth: '320px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* OUTRIVL's frame. Deliberately thin. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', padding: '0 0 9px', borderBottom: `1px solid ${C.line}` }}>
        <span style={{ display: 'flex', gap: '7px', alignItems: 'center', ...mono({ w: 700, s: 8.5, c: C.acid, ls: 0.16 }) }}>
          <span style={{ width: '5px', height: '5px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
          THRONE CANVAS
        </span>
        <span style={mono({ w: 500, s: 8.5, c: C.greyDeep, ls: 0.14 })}>
          OUTRIVL OWNS THE FRAME · {d.throneName} OWNS THE CONTENTS
        </span>
        <Hoverable
          as="span"
          onClick={actions.toggleAutoTone}
          style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', padding: '4px 8px', border: `1px solid ${d.autoToneBorder}`, cursor: 'pointer' }}
          hover={{ borderColor: C.ink }}
          title="Pull the advertiser's palette toward the board. Opt-in, never forced."
        >
          <span style={{ width: '6px', height: '6px', background: d.autoToneDot, display: 'block' }} />
          <span style={mono({ w: 500, s: 8, c: d.autoToneColor, ls: 0.13 })}>AUTO-TONE {d.autoToneLabel}</span>
        </Hoverable>
      </div>

      {/* The advertiser's surface begins here. */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', background: b.bg, border: `1px solid ${b.line}`, padding: '14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
          <span
            style={{
              width: '22px', height: '22px', borderRadius: b.radius, background: b.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...mono({ w: 700, s: 10, c: b.bg }),
            }}
          >
            {b.label.charAt(0)}
          </span>
          <span style={{ fontFamily: b.font, fontWeight: 600, fontSize: '14px', color: b.ink, letterSpacing: '-0.01em' }}>{b.label}</span>
          <span style={{ fontFamily: b.font, fontSize: '11.5px', color: b.dim }}>{d.throneTagline}</span>
          <Hoverable
            as="span"
            onClick={actions.openSite}
            style={{
              marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 11px',
              borderRadius: b.radius, background: b.accent, cursor: 'pointer',
              fontFamily: b.font, fontWeight: 600, fontSize: '10px', color: b.bg,
            }}
            hover={{ filter: 'brightness(1.1)' }}
          >
            Open live site ↗
          </Hoverable>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '10px' }}>
          {d.throneLanes.map((lane) => (
            <div key={lane.key} style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'baseline', paddingBottom: '8px', marginBottom: '9px', borderBottom: `1px solid ${b.line}` }}>
                <span style={{ fontFamily: b.font, fontWeight: 600, fontSize: '9.5px', color: b.accent, letterSpacing: '0.09em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lane.name}
                </span>
                <span style={{ fontFamily: b.font, fontSize: '9.5px', color: b.dim }}>{lane.count}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {lane.items.map((card) => (
                  <Hoverable
                    key={card.id}
                    onClick={() => actions.moveCard(card.id)}
                    style={{
                      borderRadius: b.radius, border: `1px solid ${b.line}`, background: d.brandThroneCard,
                      padding: '9px 10px', cursor: 'pointer',
                      fontFamily: b.font, fontSize: '11px', lineHeight: 1.4, color: b.ink,
                      transition: 'transform 90ms linear, border-color 90ms linear',
                    }}
                    hover={{ transform: 'translateX(2px)', borderColor: b.accent }}
                  >
                    {card.label}
                  </Hoverable>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OUTRIVL's telemetry. The advertiser's surface does not report on itself. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '11px', borderTop: `1px solid ${C.line}` }}>
        {[
          { k: 'STARTS', v: '184.2K', c: C.bone },
          { k: 'INTERACTION RATE', v: '31%', c: C.bone },
          { k: 'MOVES', v: d.throneMoves, c: C.acid },
        ].map((m) => (
          <span key={m.k} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
            <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 })}>{m.k}</span>
            <span style={mono({ w: 700, s: 13, c: m.c })}>{m.v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
