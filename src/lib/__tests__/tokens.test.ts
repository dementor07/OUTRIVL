import { describe, expect, it } from 'vitest';
import { C, RANK_HUE, SHELL } from '../tokens';
import { BRANDS } from '../brands';

/**
 * Exact guards on the design tokens.
 *
 * The visual suite catches what a reader would see; this catches the values
 * themselves in milliseconds, and pins the ones the design constitution treats
 * as meaning rather than taste.
 */
describe('palette', () => {
  it('pins the semantic accents', () => {
    expect(C.acid).toBe('#CFDA4F');
    expect(C.bone).toBe('#E9E0C4');
    expect(C.violet).toBe('#7C63CB');
    expect(C.ground).toBe('#050505');
  });

  it('keeps rank hue semantic — king, challenger, then field grey', () => {
    // Not a decorative ladder: 03 and below deliberately carry no hue.
    expect(RANK_HUE[0]).toBe(C.bone);
    expect(RANK_HUE[1]).toBe(C.violet);
    expect(RANK_HUE[2]).toBe(C.grey);
    expect(RANK_HUE[3]).toBe(C.grey);
  });

  it('never uses pure black as the page ground', () => {
    expect(C.ground).not.toBe('#000000');
  });
});

describe('shell metrics', () => {
  it('derives the slab breakpoint rather than hardcoding a round number', () => {
    // 768 slab need + 600 shell chrome + 12 safety.
    expect(SHELL.slabBreakpoint).toBe(1380);
  });

  it('drops the rail before the slab breakpoint, never after', () => {
    expect(SHELL.mobileBreakpoint).toBeLessThan(SHELL.slabBreakpoint);
  });
});

describe('advertiser brands', () => {
  it('gives every brand a full palette', () => {
    for (const [id, b] of Object.entries(BRANDS)) {
      for (const k of ['bg', 'ink', 'dim', 'accent', 'line', 'font', 'radius', 'label'] as const) {
        expect(b[k], `${id}.${k}`).toBeTruthy();
      }
    }
  });

  it('never lets an advertiser default to the OUTRIVL accent', () => {
    // A widget rendering in acid would read as OUTRIVL's ad, not theirs.
    const acid = Object.entries(BRANDS).filter(([, b]) => b.accent.toUpperCase() === C.acid);
    expect(acid).toEqual([]);
  });
});
