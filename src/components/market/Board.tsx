'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';
import { CategoryFilter } from '@/components/shell/MarketBar';
import { ThroneSlab } from './ThroneSlab';
import {
  ChallengePanel, Desk, HighestChallenger, MarketInsightsPanel, StandingsPanel,
} from '@/components/shell/Desk';

/**
 * The Board — the trading view.
 *
 * Three density tiers, and the cliff between them is the design: the throne
 * gets ~530px of canvas, a contender 78px, a ledger line 38px. Reading down the
 * page should feel like rank collapsing.
 */
export function Board() {
  const { d } = useMarket();

  return (
    <div style={{ display: 'flex', flexDirection: d.shellDir, alignItems: 'stretch', minWidth: 0 }}>
      <div style={{ flex: '1 1 auto', minWidth: 0, padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <CategoryFilter />
        <ThroneSlab />
        <LiveTape />
        <div style={{ border: `1px solid ${C.line}` }}>
          <ContenderRows />
          <Ledger />
          <ViewFullRankings />
        </div>
      </div>

      <Desk>
        <ChallengePanel />
        <HighestChallenger />
        <StandingsPanel />
        <MarketInsightsPanel />
      </Desk>
    </div>
  );
}

/** The market's running tape. Calm, continuous, never demanding attention. */
function LiveTape() {
  const { d, actions } = useMarket();
  // Doubled so the marquee's -50% translate loops seamlessly.
  const items = [...d.feed, ...d.feed];
  return (
    <div style={{ border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', height: '40px', overflow: 'hidden' }}>
      <span style={{ flex: '0 0 auto', border: `1px solid ${C.acid}`, padding: '4px 8px', margin: '0 16px', ...mono({ w: 700, s: 9.5, c: C.acid, ls: 0.14 }) }}>
        LIVE FEED
      </span>
      <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
        <span style={{ display: 'flex', gap: '34px', whiteSpace: 'nowrap', animation: 'om-marquee 34s linear infinite', ...mono({ s: 11.5, c: C.ink }) }}>
          {items.map((f, i) => (
            <span key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: f.color }}>{f.who}</span>
              <span>{f.what}</span>
            </span>
          ))}
        </span>
      </span>
      <Hoverable
        as="span"
        onClick={actions.goFeed}
        style={{ flex: '0 0 auto', display: 'flex', gap: '9px', alignItems: 'center', padding: '0 16px', borderLeft: `1px solid ${C.line}`, height: '100%', cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.bone, ls: 0.14 }) }}
        hover={{ color: C.acid }}
      >
        VIEW ALL ACTIVITY →
      </Hoverable>
    </div>
  );
}

/**
 * Ranks 02–04.
 *
 * Each row is one intact 78px line carrying all seven fields; below the
 * reference width it scrolls inside its own container rather than wrapping,
 * because a wrapped contender row destroys the tier cliff the page depends on.
 * The 24px of top padding cancelled by a negative margin gives the RISE
 * transform room to render inside the clip box.
 */
function ContenderRows() {
  const { d, actions } = useMarket();

  if (d.noContenders) {
    return (
      <div
        style={{
          padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: '12px',
          backgroundImage: 'radial-gradient(rgba(233,224,196,0.07) 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      >
        <span style={mono({ w: 700, s: 10, c: C.ink, ls: 0.16 })}>NO CONTENDERS IN THIS MARKET</span>
        <span style={{ maxWidth: '60ch', ...text({ s: 12.5, lh: 1.7, c: C.grey }) }}>{d.emptyRule}</span>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden', paddingTop: '24px', marginTop: '-24px' }}>
      {d.contenders.map((c) => (
        <Hoverable
          key={c.id}
          onClick={() => actions.openProduct(c.id)}
          style={{
            display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: '18px', padding: '0 16px',
            minHeight: '78px', minWidth: '830px', borderBottom: `1px solid ${C.lineSoft}`,
            cursor: 'pointer', transform: `translateY(${c.shift})`,
          }}
          hover={{ background: '#0B0B0D' }}
        >
          <span style={{ flex: '0 0 68px', ...display({ s: 40, c: c.hue }) }}>{c.rank}</span>
          <span style={{ width: '40px', height: '40px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', ...display({ s: 14, c: c.hue }) }}>
            {c.initial}
          </span>
          <span style={{ flex: '1 1 180px', minWidth: 0 }}>
            <span style={{ display: 'block', ...mono({ w: 500, s: 17, c: C.bone, ls: 0.06 }) }}>{c.name}</span>
            <span style={{ display: 'block', marginTop: '5px', ...mono({ w: 500, s: 9.5, c: C.grey, ls: 0.16 }) }}>{c.category}</span>
          </span>
          <span style={{ flex: '0 0 150px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>
              <span style={{ display: 'block', ...mono({ w: 700, s: 20, c: C.bone }) }}>
                {c.audience}
                <span style={mono({ s: 11, c: C.grey })}> /10</span>
              </span>
              <span style={{ display: 'block', marginTop: '4px', ...mono({ w: 700, s: 10, c: c.audColor }) }}>{c.audDelta}</span>
            </span>
            <svg viewBox="0 0 120 32" style={{ width: '78px', height: '26px' }} aria-hidden>
              <polyline points={c.spark} fill="none" stroke={C.violetLift} strokeWidth="2" />
            </svg>
          </span>
          <span style={{ flex: '0 0 160px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>
              <span style={{ display: 'block', ...mono({ w: 700, s: 20, c: C.bone }) }}>{c.engagement}</span>
              <span style={{ display: 'block', marginTop: '4px', ...mono({ w: 700, s: 10, c: c.engColor }) }}>{c.engDelta}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '26px' }}>
              {c.bars.map((b, i) => (
                <span key={i} style={{ width: '3px', background: c.hue, height: b.h }} />
              ))}
            </span>
          </span>
          <span style={{ flex: '0 0 110px', textAlign: 'right' }}>
            <span style={{ display: 'block', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>TOP BID</span>
            <span style={{ display: 'block', marginTop: '4px', ...mono({ w: 700, s: 20, c: C.bone }) }}>{c.bid}</span>
            <span style={{ display: 'block', marginTop: '4px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>EST. CPM</span>
          </span>
        </Hoverable>
      ))}
    </div>
  );
}

/**
 * Rank 05 and below — the dense market rows.
 *
 * Header and data cells carry identical flex floors so they shrink at the same
 * rate, and the scroller's floor matches the cells' real sum (854 + 24 padding)
 * so nothing overprints below the reference width.
 */
function Ledger() {
  const { d, actions } = useMarket();
  if (!d.hasLedger) return null;

  const cols = [
    { k: '#', flex: '0 0 46px', align: 'left' as const },
    { k: 'PRODUCT', flex: '1 1 160px', align: 'left' as const, min: 130 },
    { k: 'CATEGORY', flex: '0 0 150px', align: 'left' as const },
    { k: 'AUDIENCE', flex: '0 0 84px', align: 'right' as const },
    { k: 'ENGAGEMENT', flex: '0 0 100px', align: 'right' as const },
    { k: '24H', flex: '0 0 92px', align: 'right' as const },
    { k: 'REIGN', flex: '0 0 100px', align: 'right' as const },
    { k: 'TOP BID', flex: '0 0 92px', align: 'right' as const },
    { k: 'TREND', flex: '0 0 60px', align: 'right' as const },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', padding: '0 12px', height: '38px', alignItems: 'center', background: '#0B0B0D', borderBottom: `1px solid ${C.line}`, minWidth: '878px' }}>
        {cols.map((c) => (
          <span
            key={c.k}
            style={{ flex: c.flex, ...(c.min ? { minWidth: `${c.min}px` } : null), textAlign: c.align, ...mono({ w: 500, s: 9, c: C.grey, ls: 0.14 }) }}
          >
            {c.k}
          </span>
        ))}
      </div>
      {d.ledger.map((l) => (
        <Hoverable
          key={l.id}
          onClick={() => actions.openProduct(l.id)}
          style={{ display: 'flex', padding: '0 12px', height: '38px', alignItems: 'center', borderBottom: `1px solid ${C.lineSoft}`, cursor: 'pointer', minWidth: '878px' }}
          hover={{ background: '#0B0B0D' }}
        >
          <span style={{ flex: '0 0 46px', ...mono({ s: 11, c: C.grey }) }}>{l.rank}</span>
          <span style={{ flex: '1 1 160px', minWidth: '130px', display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <span style={{ width: '20px', height: '20px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', ...display({ s: 8, c: C.ink }) }}>
              {l.initial}
            </span>
            <span style={mono({ w: 500, s: 11.5, c: C.bone, ls: 0.06 })}>{l.name}</span>
          </span>
          <span style={{ flex: '0 0 150px', ...mono({ s: 10.5, c: C.grey, ls: 0.1 }) }}>{l.category}</span>
          <span style={{ flex: '0 0 84px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{l.audience}</span>
          <span style={{ flex: '0 0 100px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{l.engagement}</span>
          <span style={{ flex: '0 0 92px', textAlign: 'right', ...mono({ w: 700, s: 11, c: l.color }) }}>{l.change}</span>
          <span style={{ flex: '0 0 100px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{l.reign}</span>
          <span style={{ flex: '0 0 92px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{l.bid}</span>
          <span style={{ flex: '0 0 60px', display: 'flex', justifyContent: 'flex-end' }}>
            <svg viewBox="0 0 120 32" style={{ width: '52px', height: '18px' }} aria-hidden>
              <polyline points={l.spark} fill="none" stroke={l.color} strokeWidth="3" />
            </svg>
          </span>
        </Hoverable>
      ))}
    </div>
  );
}

function ViewFullRankings() {
  const { actions } = useMarket();
  return (
    <Hoverable
      onClick={actions.goLadder}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '46px', cursor: 'pointer', ...mono({ w: 500, s: 10, c: C.ink, ls: 0.16 }) }}
      hover={{ color: C.acid }}
    >
      VIEW FULL RANKINGS ↓
    </Hoverable>
  );
}
