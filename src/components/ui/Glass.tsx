import type { CSSProperties, ReactNode } from 'react';
import { GLASS } from '@/lib/tokens';

/**
 * The glass layer.
 *
 * Glass means *live and changeable* — the prize pool as it fills, a founder
 * who is present right now, the booth you are focused on, a bid you have not
 * placed yet, an event as it happens. Flat panels are the *settled record*.
 *
 * Applied as a rule rather than as decoration: one recipe, tint the border not
 * the fill, never on table rows, never nested, at most a few per viewport.
 */
export function Glass({
  style,
  border,
  glow,
  children,
}: {
  style?: CSSProperties;
  /** Tint the border to signal what kind of live thing this is. */
  border?: string;
  /** An optional single radial lift, painted behind the content. */
  glow?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        background: GLASS.bg,
        backdropFilter: GLASS.blur,
        WebkitBackdropFilter: GLASS.blur,
        border: `1px solid ${border ?? GLASS.border}`,
        boxShadow: GLASS.shadow,
        ...style,
      }}
    >
      {glow && glow !== 'none' && (
        <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: glow }} />
      )}
      {children}
    </div>
  );
}
