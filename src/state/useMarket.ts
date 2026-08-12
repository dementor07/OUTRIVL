'use client';

import { useMemo } from 'react';
import { useOutrivl } from './store';
import { derive, type Derived } from './derive';

/** The single read path for every surface: one state, one derivation. */
export function useMarket(): { d: Derived } & ReturnType<typeof useOutrivl> {
  const ctx = useOutrivl();
  const d = useMemo(() => derive(ctx.state), [ctx.state]);
  return { d, ...ctx };
}
