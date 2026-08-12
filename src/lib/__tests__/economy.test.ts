import { describe, expect, it } from 'vitest';
import {
  CLASSES, applyCatFilter, askFactors, askFor, classOrderFor,
  efficiency, standingsFor, widgetStateForRank,
} from '../economy';
import { DB } from '../products';

const ORDER = Object.keys(DB);

describe('the three economies', () => {
  it('keeps every product in exactly one class', () => {
    const counts = CLASSES.map((c) => classOrderFor(ORDER, c.key).length);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(ORDER.length);
  });

  it('never lets one class see another class product', () => {
    for (const c of CLASSES) {
      for (const id of classOrderFor(ORDER, c.key)) {
        expect(DB[id].klass).toBe(c.key);
      }
    }
  });
});

describe('category filtering', () => {
  const indie = classOrderFor(ORDER, 'indie');

  it('pins the class throne regardless of the filter', () => {
    const throne = indie[0];
    for (const cat of ['all', 'Design', 'Developer Tools', 'Productivity']) {
      expect(applyCatFilter(indie, cat)[0]).toBe(throne);
    }
  });

  it('narrows the field without forking the economy', () => {
    const filtered = applyCatFilter(indie, 'Design');
    // Throne is always present, plus only Design products behind it.
    expect(filtered.slice(1).every((id) => DB[id].cat === 'Design')).toBe(true);
    expect(filtered.length).toBeLessThanOrEqual(indie.length);
  });

  it('survives a filter that matches nothing but the throne', () => {
    expect(applyCatFilter(indie, 'Nonexistent')).toEqual([indie[0]]);
  });

  it('returns nothing for an empty class rather than throwing', () => {
    expect(applyCatFilter([], 'all')).toEqual([]);
  });
});

describe('attack price', () => {
  it('escalates 18% per takeover', () => {
    expect(askFactors(0, 0).escalation).toBeCloseTo(1);
    expect(askFactors(1, 0).escalation).toBeCloseTo(1.18);
    expect(askFactors(3, 0).escalation).toBeCloseTo(1.54);
  });

  it('decays through a quiet reign but never below 70%', () => {
    expect(askFactors(0, 0).decay).toBeCloseTo(1);
    expect(askFactors(0, 60 * 10).decay).toBeCloseTo(0.92);
    // A very long quiet reign floors out rather than reaching zero.
    expect(askFactors(0, 60 * 600).decay).toBe(0.7);
  });

  it('marks the throne vulnerable once decay passes 10%', () => {
    expect(askFactors(0, 60 * 5).vulnerable).toBe(false);
    expect(askFactors(0, 60 * 20).vulnerable).toBe(true);
  });

  it('never quotes an ask below a dollar', () => {
    const { escalation, decay } = askFactors(0, 60 * 600);
    for (const id of ORDER) expect(askFor(id, escalation, decay)).toBeGreaterThanOrEqual(1);
  });
});

describe('king versus champion', () => {
  it('ranks the season by Crown Points, not by who holds the throne', () => {
    const indie = classOrderFor(ORDER, 'indie');
    const standings = standingsFor(indie);
    const cps = standings.map((id) => DB[id].cp);
    expect(cps).toEqual([...cps].sort((a, b) => b - a));
  });

  it('produces a class where the two genuinely differ', () => {
    // This is the case the whole Crown Points model exists to make visible.
    const indie = classOrderFor(ORDER, 'indie');
    expect(standingsFor(indie)[0]).not.toBe(indie[0]);
  });

  it('lets a capped Indie product out-earn an uncapped Open one per dollar', () => {
    const bestIndie = Math.max(...classOrderFor(ORDER, 'indie').map((id) => efficiency(DB[id])));
    const bestOpen = Math.max(...classOrderFor(ORDER, 'open').map((id) => efficiency(DB[id])));
    expect(bestIndie).toBeGreaterThan(bestOpen);
  });
});

describe('rank is layout', () => {
  it('assigns progressively smaller canvases down the ladder', () => {
    expect(widgetStateForRank(0)).toBe('THRONE');
    expect(widgetStateForRank(1)).toBe('FEATURE');
    expect(widgetStateForRank(3)).toBe('CARD');
    expect(widgetStateForRank(9)).toBe('ROW');
  });
});
