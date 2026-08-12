import { C } from '@/lib/tokens';

/**
 * A segmented meter.
 *
 * Used for every quantity in the system that has a ceiling — spend against a
 * cap, a bid against an ask, the prize pool against its hard maximum. Segments
 * rather than a continuous bar because the market's quantities are discrete and
 * the reader should be able to count them.
 */
export function Meter({
  segs,
  height = 5,
  gap = 2,
}: {
  segs: { fill: string; glow?: string }[];
  height?: number;
  gap?: number;
}) {
  return (
    <div style={{ display: 'flex', gap: `${gap}px` }}>
      {segs.map((s, i) => (
        <span
          key={i}
          style={{
            flex: '1 1 auto',
            height: `${height}px`,
            background: s.fill,
            boxShadow: s.glow ?? 'none',
            transition: 'background 220ms linear, box-shadow 220ms linear',
          }}
        />
      ))}
    </div>
  );
}

/** A row of bars — the small engagement histograms beside a metric. */
export function Bars({ bars, color = C.line, width = 3 }: { bars: { h: string }[]; color?: string; width?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '26px' }}>
      {bars.map((b, i) => (
        <span key={i} style={{ width: `${width}px`, height: b.h, background: color, display: 'block' }} />
      ))}
    </div>
  );
}

/** A sparkline. Seeded per product so a company's trace is stable everywhere. */
export function Spark({
  points,
  color = C.ink,
  width = 120,
  height = 32,
}: {
  points: string;
  color?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 120 32" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
