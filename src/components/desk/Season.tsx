'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { useMarket } from '@/state/useMarket';

/**
 * Season — the prize pool and the season record.
 *
 * The pool is the clearest statement of how the economy is meant to be trusted:
 * tiers unlock from verified server-side volume, never from an advertiser's own
 * spend, and the cap is hard. Paying more cannot buy standing; it buys the slot.
 */
export function Season() {
  const { d } = useMarket();
  return (
    <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PrizePool />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'stretch' }}>
        <div style={{ flex: '1 1 460px', minWidth: 0, border: `1px solid ${C.line}`, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '18px' }}>
            <span style={mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 })}>SEASON 04 STANDINGS — {d.ladderClass}</span>
            <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 })}>THRONE TIME × AUDIENCE SCORE</span>
          </div>
          {d.seasonStandings.map((s) => (
            <div key={s.name} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.lineSoft}` }}>
              <span style={{ flex: '0 0 3px', alignSelf: 'stretch', minHeight: '36px', background: s.kingBar }} />
              <span style={{ flex: '0 0 26px', ...display({ s: 13, c: s.hue }) }}>{s.rank}</span>
              <span style={{ flex: '1 1 130px', minWidth: 0 }}>
                <span style={{ display: 'block', ...mono({ w: 500, s: 12, c: C.bone, ls: 0.05 }) }}>{s.name}</span>
                <span style={{ display: 'block', marginTop: '5px', ...mono({ s: 9.5, c: C.grey, ls: 0.1 }) }}>{s.badge}</span>
              </span>
              <span style={{ flex: '1 1 120px', minWidth: '80px' }}>
                <span style={{ display: 'block', height: '6px', background: '#0D0D10' }}>
                  <span style={{ display: 'block', height: '6px', width: s.w, background: s.barColor }} />
                </span>
              </span>
              <span style={{ flex: '0 0 90px', textAlign: 'right', ...mono({ w: 700, s: 14, c: C.bone }) }}>{s.cp}</span>
              <span style={{ flex: '0 0 70px', textAlign: 'right', ...mono({ w: 700, s: 11, c: C.violetLift }) }}>{s.eff} CP/$</span>
            </div>
          ))}
          <div style={{ marginTop: '16px', ...text({ s: 12, lh: 1.7, c: C.grey }) }}>
            The king holds the throne right now. The champion has banked the most Crown Points this season. They
            are frequently not the same product, and that is the point.
          </div>
        </div>

        <div style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ border: `1px solid ${C.line}`, padding: '20px' }}>
            <div style={{ marginBottom: '16px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>SEASON TIMELINE</div>
            {d.seasonTimeline.map((t) => (
              <div key={t.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '14px' }}>
                <span style={{ flex: '0 0 9px', display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                  <span style={{ width: '9px', height: '9px', background: t.dot, display: 'block' }} />
                  <span style={{ flex: '1 1 auto', width: '1px', background: C.lineDeep, marginTop: '5px' }} />
                </span>
                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span style={{ display: 'block', ...mono({ w: 500, s: 11, c: t.color, ls: 0.05 }) }}>{t.label}</span>
                  <span style={{ display: 'block', marginTop: '5px', ...text({ s: 10.5, c: C.grey }) }}>{t.when}</span>
                </span>
              </div>
            ))}
          </div>

          <div style={{ border: `1px solid ${C.line}`, padding: '20px' }}>
            <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>FOUNDING COHORT</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '14px' }}>
              {d.cohort.map((c) => (
                <span key={c} style={{ width: '30px', height: '30px', border: '1px solid #2A2340', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 9, c: C.violetLift }) }}>
                  {c}
                </span>
              ))}
            </div>
            <div style={text({ s: 11.5, lh: 1.65, c: C.grey })}>
              42 anchor products carry a factual SEASON ZERO badge. Founding grants are tooling access only —
              never rank, Crown Points or prize qualification.
            </div>
          </div>
        </div>
      </div>

      <ShareCards />
    </div>
  );
}

/** Glass, and the one animated meter in the app: the pool fills on arrival. */
function PrizePool() {
  const { d } = useMarket();
  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden', background: 'rgba(16,16,12,0.6)',
        backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid rgba(207,218,79,0.3)',
        boxShadow: 'inset 0 1px 0 rgba(207,218,79,0.18), 0 28px 70px rgba(0,0,0,0.7)', padding: '26px',
      }}
    >
      <span style={{ position: 'absolute', top: '-180px', right: '-80px', width: '520px', height: '520px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(207,218,79,0.16) 0%, rgba(207,218,79,0) 64%)', animation: 'om-halo 8s ease-in-out infinite' }} />

      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-end', marginBottom: '24px' }}>
        <span>
          <span style={{ display: 'block', marginBottom: '12px', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.18 }) }}>
            LAUNCH IGNITION — SEASON ZERO
          </span>
          <span style={{ display: 'block', ...display({ s: 30, c: C.bone }) }}>PROGRESSIVE PRIZE POOL</span>
        </span>
        <span style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <span style={{ display: 'block', lineHeight: 1, ...mono({ w: 700, s: 52, c: C.acid }) }}>{d.poolNow}</span>
          <span style={{ display: 'block', marginTop: '8px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 }) }}>
            UNLOCKED &amp; FUNDED · HARD CAP {d.poolCap}
          </span>
        </span>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: '2px', marginBottom: '14px' }}>
        {d.poolSegs.map((p, i) => (
          <span
            key={i}
            style={{
              flex: '1 1 auto', height: '24px', background: p.fill, boxShadow: p.glow,
              transition: 'background 420ms cubic-bezier(0.22,1,0.36,1), box-shadow 420ms linear',
              transitionDelay: `${i * 12}ms`,
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '1px', background: 'rgba(233,224,196,0.1)', border: '1px solid rgba(233,224,196,0.1)' }}>
        {d.poolTiers.map((t) => (
          <span key={t.label} style={{ flex: '1 1 160px', background: 'rgba(6,6,8,0.65)', padding: '14px' }}>
            <span style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '9px' }}>
              <span style={{ width: '7px', height: '7px', background: t.dot, display: 'block' }} />
              <span style={mono({ w: 700, s: 8.5, c: t.labelColor, ls: 0.14 })}>{t.label}</span>
            </span>
            <span style={{ display: 'block', ...mono({ w: 700, s: 21, c: t.amountColor }) }}>{t.amount}</span>
            <span style={{ display: 'block', marginTop: '6px', ...mono({ s: 10, c: C.grey }) }}>{t.status}</span>
          </span>
        ))}
      </div>

      <div style={{ position: 'relative', marginTop: '18px', maxWidth: '78ch', ...text({ s: 12, lh: 1.7, c: C.ink }) }}>
        Tiers unlock from verified server-side volume, never from your own spend. Paid attacks cannot improve
        promotional standing — the free evaluation path is the only qualification route, and the final pool is
        locked and snapshotted at event close.
      </div>
    </div>
  );
}

/**
 * Share cards.
 *
 * Auto-generated from real events and factual by construction — the third card
 * makes no ranking claim at all. Participant distribution is how the market
 * grows; a platform advertising itself is not the same thing.
 */
function ShareCards() {
  const { d } = useMarket();
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'baseline', marginBottom: '16px' }}>
        <span style={mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 })}>SHARE CARDS</span>
        <span style={text({ s: 12, c: C.grey })}>
          Auto-generated for every market event. Participant distribution beats the platform advertising itself.
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '16px' }}>
        {d.shareCards.map((sc) => (
          <div key={sc.tag} style={{ position: 'relative', overflow: 'hidden', border: `1px solid ${sc.border}`, background: sc.bg, minHeight: '250px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: sc.glow }} />
            <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(233,224,196,0.06) 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
            <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: sc.tagBg, padding: '4px 8px', ...mono({ w: 700, s: 9, c: sc.tagColor, ls: 0.16 }) }}>{sc.tag}</span>
              <span style={display({ s: 11, c: C.grey })}>OUTRIVL</span>
            </span>
            <span style={{ position: 'relative', marginTop: 'auto', display: 'block', fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: sc.headSize, lineHeight: 0.95, color: C.bone }}>
              {sc.head}
            </span>
            <span style={{ position: 'relative', display: 'block', marginTop: '14px', maxWidth: '34ch', ...text({ s: 12.5, lh: 1.6, c: C.ink }) }}>{sc.body}</span>
            <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '18px', paddingTop: '14px', borderTop: '1px dotted rgba(233,224,196,0.18)' }}>
              <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>{sc.foot}</span>
              <Hoverable as="span" style={{ cursor: 'pointer', whiteSpace: 'nowrap', ...mono({ w: 500, s: 8.5, c: C.bone, ls: 0.14 }) }} hover={{ color: C.acid }}>
                COPY ↗
              </Hoverable>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
