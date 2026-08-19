'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { useMarket } from '@/state/useMarket';
import { ThroneCanvas } from '@/components/widget/ThroneCanvas';

/**
 * The throne slab.
 *
 * Rank is layout: #1 gets a canvas an order of magnitude larger than anything
 * below it, and the size difference — not a badge — is what says who is
 * winning. The numeral, the identity stack and the advertiser's live widget sit
 * in one row; below 1090px the widget drops full-width, and below 1380px the
 * desk drops beneath the canvas to give the slab the room it needs.
 */
export function ThroneSlab() {
  const { d } = useMarket();

  return (
    <div style={{ border: `1px solid ${C.line}`, position: 'relative', overflow: 'hidden' }}>
      {/* Dethronement phase 1: the flash. */}
      <div style={{ position: 'absolute', inset: 0, border: `2px solid ${C.acid}`, opacity: d.flashOp, pointerEvents: 'none', zIndex: 3 }} />
      {/* Phase 2: the sweep travelling down the slab. */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: C.acid, opacity: 0.5, top: d.sweepTop, zIndex: 3, pointerEvents: 'none' }} />

      <div
        style={{
          position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '26px 30px', padding: '26px 28px',
          // Scanline plus ordered dither: texture, not wallpaper. The slab reads
          // as a lit surface rather than a void.
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(233,224,196,0.035) 0px, rgba(233,224,196,0.035) 1px, transparent 1px, transparent 3px), radial-gradient(rgba(233,224,196,0.05) 1px, transparent 1px)',
          backgroundSize: 'auto, 4px 4px',
        }}
      >
        {/* The one vignette on the screen, and it sits behind the numeral. */}
        <div style={{ position: 'absolute', zIndex: 0, inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 96px rgba(0,0,0,0.7)' }} />

        <div style={{ position: 'relative', zIndex: 1, flex: '0 0 auto', ...display({ s: 128, c: C.bone, lh: 0.86 }) }}>01</div>

        <div style={{ flex: '1 1 240px', minWidth: '240px', position: 'relative', zIndex: 1, minHeight: '452px' }}>
          {/* Phase 3: the incumbent dithers out. */}
          <div style={{ position: 'absolute', inset: 0, opacity: d.outOp }}>
            <ThroneIdentity
              initial={d.throneInitial}
              name={d.throneName}
              category={d.throneCategory}
              tagline={d.throneTagline}
              reign={d.reign}
              record={d.reignRecord}
              nameSize={d.throneNameSize}
            />
          </div>
          {/* Phase 4: the challenger dithers in and underlines itself. */}
          <div style={{ position: 'absolute', inset: 0, opacity: d.inOp }}>
            <span style={{ display: 'inline-block', background: C.acid, padding: '4px 8px', marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.ground, ls: 0.16 }) }}>
              THE THRONE
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
              <span style={{ width: '52px', height: '52px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 18, c: C.bone }) }}>
                {d.incomingInitial}
              </span>
              <span style={{ whiteSpace: 'nowrap', ...display({ s: d.incomingNameSize, lh: 0.98, c: C.bone, ls: -0.01 }) }}>
                {d.incomingName}
              </span>
            </div>
            <div style={{ marginBottom: '14px', ...mono({ w: 500, s: 10.5, c: C.violet, ls: 0.16 }) }}>{d.incomingCategory}</div>
            <div style={{ height: '2px', background: C.acid, width: d.underline }} />
          </div>
        </div>

        <ThroneCanvas />
      </div>

      <MetricStrip />
    </div>
  );
}

function ThroneIdentity({
  initial, name, category, tagline, reign, record, nameSize,
}: {
  initial: string; name: string; category: string; tagline: string; reign: string;
  record: { label: string; value: string; sep: string }[]; nameSize: number;
}) {
  return (
    <>
      <span style={{ display: 'inline-block', background: C.acid, padding: '4px 8px', marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.ground, ls: 0.16 }) }}>
        THE THRONE
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <span style={{ width: '52px', height: '52px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 18, c: C.bone }) }}>
          {initial}
        </span>
        <span style={{ whiteSpace: 'nowrap', ...display({ s: nameSize, lh: 0.98, c: C.bone, ls: -0.01 }) }}>{name}</span>
      </div>
      <div style={{ marginBottom: '14px', ...mono({ w: 500, s: 10.5, c: C.violet, ls: 0.16 }) }}>{category}</div>
      <div style={{ maxWidth: '42ch', marginBottom: '18px', ...text({ s: 15, lh: 1.65, c: C.ink }) }}>{tagline}</div>

      <span style={{ display: 'inline-block', border: `1px solid ${C.line}`, padding: '4px 8px', marginBottom: '12px', ...mono({ w: 500, s: 9.5, c: C.ink, ls: 0.16 }) }}>
        REIGNING
      </span>
      <div data-testid="live-clock" suppressHydrationWarning style={mono({ w: 700, s: 40, c: C.bone, ls: 0.02 })}>{reign}</div>
      <div style={{ display: 'flex', gap: '34px', marginTop: '6px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.18 }) }}>
        <span>HRS</span><span>MINS</span><span>SECS</span>
      </div>

      {/* Fixed three-column grid so the record can never go ragged. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', marginTop: '20px', borderTop: '1px dotted #2A2A2A', paddingTop: '14px' }}>
        {record.map((rr) => (
          <span key={rr.label} style={{ minWidth: 0, paddingRight: '14px', borderRight: `1px dotted ${rr.sep}` }}>
            {/* Wraps rather than nowraps: at the identity column's real width
                three nowrapped labels overprint each other. */}
            <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, lh: 1.35, c: C.grey, ls: 0.14 }) }}>{rr.label}</span>
            <span style={{ display: 'block', marginTop: '6px', ...mono({ w: 700, s: 17, c: C.bone }) }}>{rr.value}</span>
          </span>
        ))}
      </div>
    </>
  );
}

/**
 * Audience Score and Engagement.
 *
 * The panel note is not decoration: Audience Score is deliberately the one
 * number spend cannot buy, and saying so on the slab is what stops the market
 * reading as pay-to-win.
 */
function MetricStrip() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px dotted #2A2A2A' }}>
      <div style={{ flex: '1 1 260px', minWidth: 0, padding: '18px 28px', borderRight: '1px dotted #2A2A2A' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'baseline', marginBottom: '10px' }}>
          <span style={mono({ w: 500, s: 9.5, c: C.grey, ls: 0.16 })}>AUDIENCE SCORE</span>
          <span style={{ border: '1px solid #2A2340', padding: '2px 5px', ...mono({ w: 500, s: 8, c: C.violetLift, ls: 0.13 }) }}>
            INDEPENDENT PANEL · SPEND CANNOT BUY IT
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <span style={mono({ w: 700, s: 34, c: C.bone })}>{d.throneAud}</span>
          <span style={mono({ s: 13, c: C.grey })}>/10</span>
          <span style={mono({ w: 700, s: 12, c: d.throneAudColor })}>{d.throneAudD}</span>
          <svg viewBox="0 0 120 32" style={{ marginLeft: 'auto', width: '150px', height: '34px' }} aria-hidden>
            <polyline points={d.throneSpark} fill="none" stroke={C.violetLift} strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div style={{ flex: '1 1 260px', minWidth: 0, padding: '18px 28px' }}>
        <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 9.5, c: C.grey, ls: 0.16 }) }}>ENGAGEMENT</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <span style={mono({ w: 700, s: 34, c: C.bone })}>{d.throneEng}</span>
          <span style={mono({ w: 700, s: 12, c: d.throneEngColor })}>{d.throneEngD}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end', gap: '2px', height: '34px' }}>
            {d.engBars.map((b, i) => (
              <span key={i} style={{ width: '4px', background: C.violet, height: b.h }} />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
