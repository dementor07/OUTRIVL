'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { Meter } from '@/components/ui/Meter';
import { useMarket } from '@/state/useMarket';
import { Desk } from '@/components/shell/Desk';

/**
 * Challenges — where a position is actually bought.
 *
 * The composer makes the two things that decide a challenge visible at once:
 * whether the bid clears the ask, and what the bid does to the daily cap. Both
 * update as you drag, so the decision is legible before it is committed.
 */
export function Challenges() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexDirection: d.shellDir, alignItems: 'stretch', minWidth: 0 }}>
      <div style={{ flex: '1 1 auto', minWidth: 0, padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
          {d.chStats.map((s) => (
            <span key={s.label} style={{ flex: '1 1 160px', minWidth: 0, background: C.ground, padding: '16px 18px' }}>
              <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>{s.label}</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '9px', marginTop: '10px' }}>
                <span style={mono({ w: 700, s: 24, c: s.color })}>{s.value}</span>
                <span style={mono({ w: 700, s: 10, c: C.grey })}>{s.note}</span>
              </span>
            </span>
          ))}
        </div>

        <div style={{ border: `1px solid ${C.line}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${C.line}` }}>
            <span style={mono({ w: 700, s: 10, c: C.bone, ls: 0.16 })}>OPEN CHALLENGES</span>
            <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.14 })}>SETTLES THE MOMENT A BID CLEARS THE ASK</span>
          </div>
          {d.chOpen.map((c) => (
            <Hoverable
              key={c.name}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', padding: '16px', borderBottom: `1px solid ${C.lineSoft}` }}
              hover={{ background: '#0B0B0D' }}
            >
              <span style={{ flex: '0 0 4px', alignSelf: 'stretch', minHeight: '52px', background: c.bar }} />
              <span style={{ flex: '0 0 42px', height: '42px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 14, c: c.hue }) }}>
                {c.initial}
              </span>
              <span style={{ flex: '1 1 190px', minWidth: 0 }}>
                <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>{c.direction}</span>
                <span style={{ display: 'block', marginTop: '7px', ...mono({ w: 500, s: 15, c: C.bone, ls: 0.05 }) }}>{c.name}</span>
                <span style={{ display: 'block', marginTop: '6px', ...text({ s: 11.5, c: C.grey }) }}>{c.market}</span>
              </span>
              <span style={{ flex: '0 0 100px' }}>
                <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>BID</span>
                <span style={{ display: 'block', marginTop: '6px', ...mono({ w: 700, s: 19, c: C.bone }) }}>{c.bid}</span>
              </span>
              <span style={{ flex: '0 0 100px' }}>
                <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>ASK</span>
                <span style={{ display: 'block', marginTop: '6px', ...mono({ w: 700, s: 19, c: C.acid }) }}>{c.ask}</span>
              </span>
              <span style={{ flex: '1 1 140px', minWidth: '120px' }}>
                <span style={{ display: 'block', marginBottom: '8px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>GAP TO CLEAR</span>
                <Meter segs={c.gapSegs} height={6} />
              </span>
              <span style={{ flex: '0 0 112px', textAlign: 'right' }}>
                <span style={{ display: 'inline-block', border: `1px solid ${c.stateBorder}`, padding: '4px 8px', ...mono({ w: 700, s: 9, c: c.stateColor, ls: 0.14 }) }}>
                  {c.state}
                </span>
                <span style={{ display: 'block', marginTop: '8px', ...mono({ s: 10.5, c: C.grey }) }}>{c.age}</span>
              </span>
            </Hoverable>
          ))}
        </div>

        <ChallengeHistory />
      </div>

      <Desk>
        <Composer />
        <DailyCap />
      </Desk>
    </div>
  );
}

function ChallengeHistory() {
  const { d } = useMarket();
  const cols = [
    { k: 'WHEN', flex: '0 0 88px', align: 'left' as const },
    { k: 'TARGET', flex: '1 1 150px', align: 'left' as const },
    { k: 'MARKET', flex: '0 0 120px', align: 'left' as const },
    { k: 'BID', flex: '0 0 84px', align: 'right' as const },
    { k: 'HELD FOR', flex: '0 0 100px', align: 'right' as const },
    { k: 'CP EARNED', flex: '0 0 96px', align: 'right' as const },
    { k: 'OUTCOME', flex: '0 0 104px', align: 'right' as const },
  ];
  return (
    <div style={{ border: `1px solid ${C.line}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${C.line}` }}>
        <span style={mono({ w: 700, s: 10, c: C.bone, ls: 0.16 })}>CHALLENGE HISTORY</span>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.14 })}>SEASON 04 · ALL MARKETS</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', padding: '0 14px', height: '34px', alignItems: 'center', background: '#0B0B0D', borderBottom: `1px solid ${C.line}`, minWidth: '760px' }}>
          {cols.map((c) => (
            <span key={c.k} style={{ flex: c.flex, textAlign: c.align, ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>{c.k}</span>
          ))}
        </div>
        {d.chHistory.map((h, i) => (
          <Hoverable
            key={i}
            style={{ display: 'flex', padding: '0 14px', height: '40px', alignItems: 'center', borderBottom: `1px solid ${C.lineSoft}`, minWidth: '760px' }}
            hover={{ background: '#0B0B0D' }}
          >
            <span style={{ flex: '0 0 88px', ...mono({ s: 10.5, c: C.grey }) }}>{h.when}</span>
            <span style={{ flex: '1 1 150px', ...mono({ w: 500, s: 11.5, c: C.bone, ls: 0.05 }) }}>{h.target}</span>
            <span style={{ flex: '0 0 120px', ...mono({ s: 10, c: C.ink, ls: 0.1 }) }}>{h.market}</span>
            <span style={{ flex: '0 0 84px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{h.bid}</span>
            <span style={{ flex: '0 0 100px', textAlign: 'right', ...mono({ s: 11.5, c: C.ink }) }}>{h.held}</span>
            <span style={{ flex: '0 0 96px', textAlign: 'right', ...mono({ w: 700, s: 11.5, c: C.violetLift }) }}>{h.cp}</span>
            <span style={{ flex: '0 0 104px', textAlign: 'right', ...mono({ w: 700, s: 10, c: h.color, ls: 0.13 }) }}>{h.outcome}</span>
          </Hoverable>
        ))}
      </div>
    </div>
  );
}

/** Glass: an unplaced bid is the most provisional thing in the product. */
function Composer() {
  const { d, actions } = useMarket();
  return (
    <div
      style={{
        background: 'rgba(18,18,22,0.6)', backdropFilter: 'blur(18px) saturate(150%)',
        WebkitBackdropFilter: 'blur(18px) saturate(150%)', border: '1px solid rgba(207,218,79,0.34)',
        boxShadow: 'inset 0 1px 0 rgba(207,218,79,0.16), 0 24px 60px rgba(0,0,0,0.65)', padding: '18px',
      }}
    >
      <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.acid, ls: 0.16 }) }}>COMPOSE A CHALLENGE</div>

      <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>TARGET</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(233,224,196,0.1)', marginBottom: '18px' }}>
        {d.chTargets.map((t) => (
          <Hoverable
            as="span"
            key={t.key}
            onClick={() => actions.setChTarget(t.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: t.bg, padding: '10px 11px', cursor: 'pointer' }}
            hover={{ background: 'rgba(207,218,79,0.1)' }}
          >
            <span style={{ flex: '0 0 22px', ...display({ s: 12, c: t.hue }) }}>{t.rank}</span>
            <span style={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...mono({ w: 500, s: 11.5, c: t.nameColor, ls: 0.05 }) }}>
              {t.name}
            </span>
            <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 11, c: C.acid }) }}>{t.ask}</span>
          </Hoverable>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 })}>YOUR BID</span>
        <span style={mono({ w: 700, s: 26, c: C.bone })}>{d.chBid}</span>
      </div>

      {/* The ladder is the input. The darker notch marks where the ask sits, so
          clearing it is a thing you can see rather than compute. */}
      <div
        role="slider"
        aria-label="Bid amount"
        aria-valuemin={0}
        aria-valuemax={19}
        aria-valuenow={d.chBidStep}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') actions.setChBid(Math.min(19, d.chBidStep + 1));
          if (e.key === 'ArrowLeft') actions.setChBid(Math.max(0, d.chBidStep - 1));
        }}
        style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}
      >
        {d.chBidSegs.map((b) => (
          <span
            key={b.key}
            onClick={() => actions.setChBid(b.key)}
            style={{ flex: '1 1 auto', height: '22px', background: b.fill, cursor: 'pointer' }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', ...mono({ s: 9, c: C.grey, ls: 0.1 }) }}>
        <span>{d.chFloor}</span><span>ASK {d.chAsk}</span><span>{d.chCeiling}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 11px', border: '1px dotted rgba(233,224,196,0.2)', marginBottom: '16px' }}>
        <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 })}>CLEARS THE ASK</span>
        <span style={mono({ w: 700, s: 10, c: d.chClearColor, ls: 0.14 })}>{d.chClear}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '18px' }}>
        {d.chTerms.map((tm) => (
          <span key={tm.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
            <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>{tm.k}</span>
            <span style={mono({ w: 700, s: 11.5, c: tm.c })}>{tm.v}</span>
          </span>
        ))}
      </div>

      <Hoverable
        onClick={actions.takeThrone}
        style={{ background: C.acid, color: C.ground, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', cursor: 'pointer', ...mono({ w: 700, s: 11, ls: 0.14 }) }}
        hover={{ background: C.bone }}
      >
        {d.chCta}
        <span>→</span>
      </Hoverable>

      {/* The load-bearing promise of the whole economy. */}
      <div style={{ marginTop: '12px', ...text({ s: 11, lh: 1.6, c: C.grey }) }}>
        Spend never touches Audience Score, Crown Points or prize eligibility. It buys the slot, not the standing.
      </div>
    </div>
  );
}

function DailyCap() {
  const { d } = useMarket();
  return (
    <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
      <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>DAILY CAP — {d.capClassLabel}</div>
      <div style={{ marginBottom: '12px' }}>
        <Meter segs={d.capSegs} height={8} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.15 })}>SPENT {d.spentToday}</span>
        <span style={mono({ w: 700, s: 11, c: C.acid })}>{d.capRemaining} LEFT</span>
      </div>
      <div style={{ marginTop: '12px', ...text({ s: 11, lh: 1.6, c: C.grey }) }}>
        The ceiling resets at 00:00 UTC. It exists so a treasury cannot simply outlast a market.
      </div>
    </div>
  );
}
