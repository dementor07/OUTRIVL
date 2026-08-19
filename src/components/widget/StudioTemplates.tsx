'use client';

import type { Brand } from '@/lib/types';
import { C } from '@/lib/tokens';
import { mono } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';

/**
 * The non-kanban widget templates.
 *
 * Each is a genuinely different interaction, not a relabelled task board —
 * that is the whole claim the Studio makes. All three render in the
 * advertiser's palette, type and corner radius, and all three obey the render
 * state's column count so they compress the same way the board does.
 */

interface Props {
  b: Brand;
  cardBg: string;
  cols: number;
  laneH: string;
}

/** A working keypad. The advertiser's brand, OUTRIVL's interaction budget. */
export function CalculatorTemplate({ b, cardBg, laneH }: Props) {
  const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'];
  return (
    <div style={{ minHeight: laneH, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{
          border: `1px solid ${b.line}`, borderRadius: b.radius, background: cardBg,
          padding: '14px 16px', textAlign: 'right',
          fontFamily: b.font, fontWeight: 600, fontSize: '26px', color: b.ink,
        }}
      >
        1,284
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '6px' }}>
        {keys.map((k) => {
          const op = ['÷', '×', '−', '+', '='].includes(k);
          return (
            <Hoverable
              key={k}
              style={{
                borderRadius: b.radius, border: `1px solid ${b.line}`,
                background: op ? b.accent : cardBg,
                padding: '10px 0', textAlign: 'center', cursor: 'pointer',
                fontFamily: b.font, fontWeight: 600, fontSize: '13px',
                color: op ? b.bg : b.ink,
                transition: 'transform 90ms linear',
              }}
              hover={{ transform: 'translateY(-1px)' }}
            >
              {k}
            </Hoverable>
          );
        })}
      </div>
    </div>
  );
}

/** A before/after wipe. One drag, one point made. */
export function BeforeAfterTemplate({ b, cardBg, laneH }: Props) {
  return (
    <div style={{ minHeight: laneH, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{
          position: 'relative', flex: '1 1 auto', minHeight: '120px', overflow: 'hidden',
          borderRadius: b.radius, border: `1px solid ${b.line}`, background: cardBg,
        }}
      >
        {/* "Before" — the dithered, unresolved half. */}
        <span
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(233,224,196,0.10) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
        {/* "After" — the advertiser's own surface, revealed to the wipe line. */}
        <span
          style={{
            position: 'absolute', inset: 0, width: '58%', overflow: 'hidden',
            background: `linear-gradient(120deg, ${b.accent}22, transparent 70%)`,
            borderRight: `2px solid ${b.accent}`,
          }}
        />
        <span style={{ position: 'absolute', left: '12px', bottom: '10px', fontFamily: b.font, fontWeight: 600, fontSize: '10px', color: b.ink, letterSpacing: '0.08em' }}>
          AFTER
        </span>
        <span style={{ position: 'absolute', right: '12px', bottom: '10px', fontFamily: b.font, fontSize: '10px', color: b.dim, letterSpacing: '0.08em' }}>
          BEFORE
        </span>
        {/* The handle. */}
        <span
          style={{
            position: 'absolute', left: '58%', top: '50%', width: '22px', height: '22px',
            marginLeft: '-11px', marginTop: '-11px', borderRadius: '50%',
            background: b.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: b.font, fontWeight: 700, fontSize: '10px', color: b.bg, cursor: 'ew-resize',
          }}
        >
          ↔
        </span>
      </div>
      <div style={{ fontFamily: b.font, fontSize: '11px', color: b.dim }}>Drag to compare.</div>
    </div>
  );
}

/**
 * A signed SDK build.
 *
 * Deliberately shows its own containment: the advertiser's code runs in a
 * signed sandbox with declared capabilities and a hard resource budget, never
 * as arbitrary JavaScript in the host page.
 */
export function SdkTemplate({ b, cardBg, laneH }: Props) {
  const caps = [
    { k: 'dom', v: 'shadow-root', ok: true },
    { k: 'network', v: 'none', ok: true },
    { k: 'storage', v: 'none', ok: true },
    { k: 'timers', v: 'raf only', ok: true },
    { k: 'budget', v: '112KB / 150KB', ok: true },
  ];
  return (
    <div style={{ minHeight: laneH, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px', alignItems: 'center' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.accent, display: 'block' }} />
        <span style={{ fontFamily: b.font, fontWeight: 600, fontSize: '11.5px', color: b.ink }}>
          signed-runtime@2
        </span>
        <span style={{ marginLeft: 'auto', border: `1px solid ${b.line}`, borderRadius: b.radius, padding: '3px 7px', fontFamily: b.font, fontSize: '9.5px', color: b.dim }}>
          sha256:4f2a…c19b
        </span>
      </div>
      <div style={{ flex: '1 1 auto', borderRadius: b.radius, border: `1px solid ${b.line}`, background: cardBg, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {caps.map((c) => (
          <span key={c.k} style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
            <span style={{ flex: '0 0 68px', fontFamily: b.font, fontSize: '10.5px', color: b.dim }}>{c.k}</span>
            <span style={{ flex: '1 1 auto', fontFamily: b.font, fontWeight: 600, fontSize: '11px', color: b.ink }}>{c.v}</span>
            <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 9, c: C.up }) }}>{c.ok ? '✓' : '!'}</span>
          </span>
        ))}
      </div>
      <div style={{ fontFamily: b.font, fontSize: '10.5px', lineHeight: 1.5, color: b.dim }}>
        Runs inside a signed sandbox. No advertiser JavaScript reaches the host page.
      </div>
    </div>
  );
}
