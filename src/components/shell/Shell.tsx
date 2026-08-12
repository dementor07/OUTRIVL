'use client';

import { useEffect, useRef } from 'react';
import { C, FONT, SHELL } from '@/lib/tokens';
import { Rail } from './Rail';
import { Topbar } from './Topbar';
import { useMarket } from '@/state/useMarket';

/**
 * The app shell.
 *
 * Available width is observed off the shell itself rather than read from the
 * viewport: the breakpoint is a property of how much room the layout actually
 * has, so measuring the window would give the wrong answer whenever the app is
 * embedded or the rail is present.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const { actions } = useMarket();
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = main.current;
    if (!el) return;
    const measure = () => actions.setShellWidth(el.clientWidth + SHELL.rail);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [actions]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '100vh',
        background: C.ground,
        fontFamily: FONT.mono,
      }}
    >
      <Rail />
      <main ref={main} style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        {children}
      </main>
    </div>
  );
}
