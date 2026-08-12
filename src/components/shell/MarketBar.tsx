'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';
import type { ClassKey, MarketMode } from '@/lib/types';

/**
 * The economy switch and the view toggle.
 *
 * ECONOMY selects which of the three markets you are looking at — each has its
 * own throne, its own standings and its own cap. VIEW selects how you look at
 * that one market: Board, Floor or Ladder. Keeping both on one bar is what
 * makes the hierarchy self-explanatory; they were separate destinations once
 * and it read as three unrelated products.
 */
export function MarketBar() {
  const { d, actions } = useMarket();

  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div style={{ border: `1px solid ${C.line}` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', borderBottom: `1px solid ${C.line}` }}>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 14px', height: '48px', borderRight: `1px solid ${C.line}`, ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>
            ECONOMY
          </span>
          {d.classes.map((cl) => (
            <Hoverable
              as="span"
              key={cl.key}
              onClick={() => actions.setClass(cl.key as ClassKey)}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px',
                padding: '0 18px', height: '48px', borderRight: `1px solid ${C.lineSoft}`,
                cursor: 'pointer', background: cl.bg, borderBottom: `2px solid ${cl.bar}`,
              }}
              hover={{ background: '#0B0B0D' }}
            >
              <span style={{ display: 'flex', gap: '9px', alignItems: 'baseline', ...mono({ w: 700, s: 11, c: cl.color, ls: 0.14 }) }}>
                {cl.label}
                <span style={mono({ w: 500, s: 9, c: C.grey })}>{cl.count}</span>
              </span>
              <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.13 })}>{cl.cap}</span>
            </Hoverable>
          ))}
          <span style={{ display: d.marketNoteDisplay, alignItems: 'center', gap: '22px', marginLeft: 'auto', padding: '0 18px', height: '48px' }}>
            <span style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 })}>SPENT TODAY</span>
              <span style={mono({ w: 700, s: 13, c: C.bone })}>{d.spentToday}</span>
            </span>
            <span style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 })}>REMAINING</span>
              <span style={mono({ w: 700, s: 13, c: C.acid })}>{d.capRemaining}</span>
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
          <span style={{ marginRight: '2px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>VIEW</span>
          {d.marketModes.map((m) => (
            <Hoverable
              as="span"
              key={m.key}
              onClick={() => actions.setMode(m.key as MarketMode)}
              style={{
                display: 'flex', flexDirection: 'column', gap: '3px', padding: '7px 13px',
                border: `1px solid ${m.border}`, background: m.bg, cursor: 'pointer',
              }}
              hover={{ borderColor: C.ink }}
            >
              <span style={mono({ w: 700, s: 10, c: m.color, ls: 0.14 })}>{m.label}</span>
              <span style={mono({ w: 500, s: 8, c: m.noteColor, ls: 0.13 })}>{m.note}</span>
            </Hoverable>
          ))}
          <span style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Shown only when you are spectating an economy you don't compete in. */}
            {d.offMarket && <span style={text({ s: 10, c: C.grey })}>{d.offMarketNote}</span>}
            <Hoverable
              as="span"
              onClick={actions.goMine}
              style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '7px 11px', border: `1px solid ${C.line}`, cursor: 'pointer' }}
              hover={{ borderColor: C.acid }}
            >
              <span style={{ width: '18px', height: '18px', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 7, c: C.acid }) }}>
                {d.myInitial}
              </span>
              <span style={mono({ w: 500, s: 9, c: C.ink, ls: 0.13 })}>YOUR POSITION</span>
              <span style={mono({ w: 700, s: 11, c: C.bone })}>{d.myRank}</span>
            </Hoverable>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Category chips. A filter within the class — it never forks the economy. */
export function CategoryFilter() {
  const { d, actions } = useMarket();
  return (
    <div style={{ border: `1px solid ${C.line}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '9px 14px' }}>
      <span style={{ marginRight: '4px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>FILTER</span>
      {d.cats.map((ct) => (
        <Hoverable
          as="span"
          key={ct.key}
          onClick={() => actions.setCat(ct.key)}
          style={{ padding: '4px 10px', border: `1px solid ${ct.border}`, cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: ct.color, ls: 0.12 }) }}
          hover={{ borderColor: C.ink }}
        >
          {ct.label}
        </Hoverable>
      ))}
      <span style={{ marginLeft: 'auto', ...mono({ w: 500, s: 8.5, c: C.greyDeep, ls: 0.15 }) }}>
        CATEGORY IS A FILTER — THE THRONE IS ALWAYS THE ECONOMY&apos;S
      </span>
    </div>
  );
}
