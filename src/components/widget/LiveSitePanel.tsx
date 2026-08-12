'use client';

import { C } from '@/lib/tokens';
import { mono } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';

/**
 * The bounded live-site panel.
 *
 * The brief refuses arbitrary advertiser JavaScript in the page, so "visit the
 * product" cannot mean embedding their site and hoping. It opens in an isolated
 * frame with visible OUTRIVL chrome, no shared storage, and bounded telemetry —
 * the session counts as one meaningful interaction, and the external CTA is
 * tracked separately so the two can never be conflated.
 *
 * The contents here are a representative render of the advertiser's own site
 * in their own brand; in production this is the sandboxed frame.
 */
export function LiveSitePanel() {
  const { d, actions } = useMarket();
  if (!d.siteOpen) return null;
  const b = d.site;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${b.label} live site, isolated frame`}
      style={{
        position: 'fixed', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '32px', background: 'rgba(5,5,5,0.82)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={actions.closeSite}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(1040px, 100%)', maxHeight: '100%', display: 'flex', flexDirection: 'column',
          border: `1px solid ${C.line}`, background: C.ground, boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        }}
      >
        {/* OUTRIVL chrome. Always visible: the reader must never lose track of
            whose surface they are on. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${C.line}` }}>
          <span style={mono({ w: 700, s: 8.5, c: C.acid, ls: 0.16 })}>OUTRIVL FRAME</span>
          <span style={{ flex: '1 1 220px', minWidth: 0, padding: '5px 10px', border: `1px solid ${C.line}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...mono({ s: 10, c: C.ink }) }}>
            {d.siteUrl}
          </span>
          <span style={mono({ w: 500, s: 8, c: C.greyDeep, ls: 0.13 })}>
            ISOLATED FRAME · NO SHARED STORAGE · TELEMETRY BOUNDED
          </span>
          <Hoverable
            as="span"
            onClick={actions.closeSite}
            style={{ padding: '5px 10px', border: `1px solid ${C.line}`, cursor: 'pointer', ...mono({ w: 700, s: 9, c: C.ink, ls: 0.14 }) }}
            hover={{ borderColor: C.acid, color: C.acid }}
          >
            CLOSE ✕
          </Hoverable>
        </div>

        {/* The advertiser's surface, in their brand. */}
        <div style={{ flex: '1 1 auto', overflowY: 'auto', background: b.bg, padding: '30px 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
            <span style={{ width: '26px', height: '26px', borderRadius: b.radius, background: b.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.font, fontWeight: 700, fontSize: '12px', color: b.bg }}>
              {b.label.charAt(0)}
            </span>
            <span style={{ fontFamily: b.font, fontWeight: 600, fontSize: '16px', color: b.ink }}>{b.label}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: '18px' }}>
              {d.siteNav.map((l) => (
                <span key={l} style={{ fontFamily: b.font, fontSize: '12px', color: b.dim }}>{l}</span>
              ))}
            </span>
          </div>
          <div style={{ fontFamily: b.font, fontWeight: 600, fontSize: '34px', lineHeight: 1.15, color: b.ink, maxWidth: '18ch', marginBottom: '14px' }}>
            {b.label}
          </div>
          <div style={{ fontFamily: b.font, fontSize: '15px', lineHeight: 1.6, color: b.dim, maxWidth: '52ch', marginBottom: '24px' }}>
            {d.siteTagline}
          </div>
          <span style={{ display: 'inline-block', padding: '11px 18px', borderRadius: b.radius, background: b.accent, fontFamily: b.font, fontWeight: 600, fontSize: '13px', color: b.bg, marginBottom: '32px' }}>
            Get started
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {d.siteCells.map((c) => (
              <div key={c.t} style={{ border: `1px solid ${b.line}`, borderRadius: b.radius, background: d.siteCardBg, padding: '16px' }}>
                <div style={{ fontFamily: b.font, fontWeight: 600, fontSize: '13px', color: b.ink, marginBottom: '7px' }}>{c.t}</div>
                <div style={{ fontFamily: b.font, fontSize: '12px', lineHeight: 1.55, color: b.dim }}>{c.b}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', padding: '10px 14px', borderTop: `1px solid ${C.line}`, ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>
          <span>THIS SESSION COUNTS AS ONE MEANINGFUL INTERACTION</span>
          <span style={{ marginLeft: 'auto', color: C.violetLift }}>EXTERNAL CTA TRACKED SEPARATELY</span>
        </div>
      </div>
    </div>
  );
}
