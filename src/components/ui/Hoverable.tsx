'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

/**
 * A hover-swappable element.
 *
 * The prototype expressed hover as a `style-hover` attribute. React has no
 * equivalent for inline styles, and the alternative — a stylesheet class per
 * one-off hover colour — would scatter this design's many single-use hovers
 * across a file nobody reads next to the markup. Tracking it in state keeps the
 * rule where the element is.
 */
/**
 * Merge a hover patch over a base style.
 *
 * React warns when a shorthand (`border`) and its longhand (`borderColor`) are
 * both present across renders, because the two can fight. Most hovers here only
 * want to recolour an existing 1px border, so the longhand is folded back into
 * the shorthand instead of being emitted alongside it.
 */
function merge(base?: CSSProperties, patch?: CSSProperties): CSSProperties {
  if (!patch) return base ?? {};
  const out = { ...base, ...patch };
  if (patch.borderColor && typeof base?.border === 'string') {
    out.border = String(base.border).replace(/(\S+)$/, String(patch.borderColor));
    delete out.borderColor;
  }
  return out;
}

export function Hoverable({
  as: Tag = 'div',
  style,
  hover,
  children,
  onClick,
  title,
  ariaLabel,
}: {
  as?: 'div' | 'span' | 'button' | 'li' | 'tr';
  style?: CSSProperties;
  hover?: CSSProperties;
  children?: ReactNode;
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
}) {
  const [on, setOn] = useState(false);
  const interactive = !!onClick;
  return (
    <Tag
      style={merge(style, on ? hover : undefined)}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      {...(interactive && Tag !== 'button'
        ? {
            role: 'button' as const,
            tabIndex: 0,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            },
          }
        : null)}
    >
      {children}
    </Tag>
  );
}
