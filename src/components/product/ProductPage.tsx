'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { useMarket } from '@/state/useMarket';
import { Desk } from '@/components/shell/Desk';
import { DiscussionTab, PerformanceTab, TeamTab, UpdatesTab } from './TabPanels';

/**
 * The product page — the permanent, canonical record for one company.
 *
 * Same visual system as the Board without becoming a conventional SaaS detail
 * page: the product's own widget runs here at PRODUCT_PAGE size in the
 * advertiser's brand, the market history is present, and the external CTA is
 * unmissable.
 */
export function ProductPage() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexDirection: d.shellDir, alignItems: 'stretch', minWidth: 0 }}>
      <div style={{ flex: '1 1 auto', minWidth: 0, padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Masthead />
        <Tabs />
        {/* The masthead and the widget stay put across tabs — they are the
            product's identity, not one tab's content. Only the body swaps. */}
        {d.tab === 'overview' && (
          <>
            <AboutAndShots />
            <ActivityRow />
            <StatesAndShare />
          </>
        )}
        {d.tab === 'performance' && <PerformanceTab />}
        {d.tab === 'discussion' && <DiscussionTab />}
        {d.tab === 'updates' && <UpdatesTab />}
        {d.tab === 'team' && <TeamTab />}
        <FooterLinks />
      </div>
      <ProductDesk />
    </div>
  );
}

function Masthead() {
  const { d, actions } = useMarket();
  const b = d.brandProduct;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
      <div style={{ flex: '1 1 340px', minWidth: 0 }}>
        <div style={{ width: '78px', height: '78px', border: `1px solid ${C.line}`, marginBottom: '16px' }}>
          <ImageSlot slotId={`logo-${d.product.name}`} placeholder="Logo" fit="contain" />
        </div>
        <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 10.5, c: C.violet, ls: 0.16 }) }}>{d.pCategory}</div>
        <div style={{ marginBottom: '16px', ...display({ s: d.pNameSize, c: C.bone }) }}>{d.pName}</div>
        <div style={{ maxWidth: '44ch', marginBottom: '22px', ...text({ s: 16, lh: 1.65, c: C.ink }) }}>{d.pTagline}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Hoverable
            as="span"
            onClick={actions.openSite}
            style={{ background: C.acid, color: C.ground, display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 18px', cursor: 'pointer', ...mono({ w: 700, s: 11, ls: 0.14 }) }}
            hover={{ background: C.bone }}
          >
            VISIT WEBSITE <span>→</span>
          </Hoverable>
          <Hoverable
            as="span"
            onClick={actions.upvote}
            style={{ border: `1px solid ${C.line}`, color: C.bone, display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 18px', cursor: 'pointer', ...mono({ w: 500, s: 11, ls: 0.14 }) }}
            hover={{ borderColor: C.bone }}
          >
            ↑ UPVOTE {d.upvotes}
          </Hoverable>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px', ...mono({ s: 15, c: C.grey }) }}>
          <span>◍</span><span>⌘</span><span>▤</span>
        </div>
      </div>

      {/* The PRODUCT_PAGE render state, in the advertiser's own brand. */}
      <div style={{ flex: '1 1 460px', minWidth: 0, border: `1px solid ${C.line}` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', padding: '9px 12px', borderBottom: `1px solid ${C.line}` }}>
          <span style={mono({ w: 700, s: 8.5, c: C.violetLift, ls: 0.16 })}>PRODUCT_PAGE CANVAS</span>
          <span style={mono({ w: 500, s: 8, c: C.greyDeep, ls: 0.14 })}>ADVERTISER BRAND · OUTRIVL FRAME</span>
          <Hoverable
            as="span"
            onClick={actions.toggleAutoTone}
            style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', padding: '4px 8px', border: `1px solid ${d.autoToneBorder}`, cursor: 'pointer' }}
            hover={{ borderColor: C.ink }}
          >
            <span style={{ width: '6px', height: '6px', background: d.autoToneDot, display: 'block' }} />
            <span style={mono({ w: 500, s: 8, c: d.autoToneColor, ls: 0.13 })}>AUTO-TONE {d.autoToneLabel}</span>
          </Hoverable>
        </div>
        <div style={{ background: b.bg, padding: '18px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '11px', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ width: '26px', height: '26px', borderRadius: b.radius, background: b.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono({ w: 700, s: 12, c: b.bg }) }}>
              {d.pInitial}
            </span>
            <span style={{ fontFamily: b.font, fontWeight: 600, fontSize: '16px', color: b.ink, letterSpacing: '-0.01em' }}>{b.label}</span>
            <Hoverable
              as="span"
              onClick={actions.openSite}
              style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 14px', borderRadius: b.radius, background: b.accent, cursor: 'pointer', fontFamily: b.font, fontWeight: 600, fontSize: '11px', color: b.bg }}
              hover={{ filter: 'brightness(1.1)' }}
            >
              Open live site ↗
            </Hoverable>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '10px' }}>
            {d.productLanes.map((col) => (
              <div key={col.key} style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', paddingBottom: '9px', marginBottom: '10px', borderBottom: `1px solid ${b.line}` }}>
                  <span style={{ fontFamily: b.font, fontWeight: 600, fontSize: '11px', color: b.accent, letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {col.name}
                  </span>
                  <span style={{ fontFamily: b.font, fontSize: '10px', color: b.dim }}>{col.count}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '180px' }}>
                  {col.items.map((card) => (
                    <Hoverable
                      key={card.id}
                      onClick={() => actions.moveCard(card.id)}
                      style={{ border: `1px solid ${b.line}`, borderRadius: b.radius, background: d.brandProductCard, padding: '10px 11px', cursor: 'pointer', fontFamily: b.font, fontSize: '11.5px', lineHeight: 1.45, color: b.ink, transition: 'transform 90ms linear' }}
                      hover={{ transform: 'translate(-1px,-1px)' }}
                    >
                      {card.label}
                    </Hoverable>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderTop: `1px solid ${C.line}` }}>
          <span style={text({ s: 11, c: C.grey })}>Live preview — your changes aren&apos;t saved to their account.</span>
          <Hoverable as="span" onClick={actions.goStudio} style={{ cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.bone, ls: 0.14 }) }} hover={{ color: C.acid }}>
            INSPECT THE SPEC →
          </Hoverable>
        </div>
      </div>
    </div>
  );
}

function Tabs() {
  const { d, actions } = useMarket();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 26px', minWidth: 0, borderBottom: `1px solid ${C.line}` }}>
      {d.tabs.map((t) => (
        <Hoverable
          as="span"
          key={t.key}
          onClick={() => actions.setTab(t.key)}
          style={{ flex: '0 0 auto', whiteSpace: 'nowrap', padding: '14px 2px', borderBottom: `2px solid ${t.bar}`, marginBottom: '-1px', cursor: 'pointer', ...mono({ w: 500, s: 12, c: t.color, ls: 0.14 }) }}
          hover={{ color: C.bone }}
        >
          {t.label}
        </Hoverable>
      ))}
    </div>
  );
}

function AboutAndShots() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <div style={{ flex: '1 1 280px', minWidth: 0 }}>
        <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 10, c: C.violet, ls: 0.16 }) }}>ABOUT {d.pName}</div>
        <div style={{ marginBottom: '20px', ...text({ s: 14.5, lh: 1.75, c: C.ink }) }}>{d.pAbout}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {d.claims.map((cl) => (
            <div key={cl.title} style={{ display: 'flex', gap: '12px' }}>
              <span style={{ flex: '0 0 22px', height: '22px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 10, c: C.acid }) }}>
                {cl.glyph}
              </span>
              <span>
                <span style={{ display: 'block', ...mono({ w: 500, s: 12.5, c: C.bone }) }}>{cl.title}</span>
                <span style={{ display: 'block', marginTop: '5px', ...text({ s: 13, lh: 1.6, c: C.grey }) }}>{cl.body}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: '1 1 420px', minWidth: 0, borderLeft: `1px solid ${C.line}`, paddingLeft: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={mono({ w: 700, s: 10, c: C.violet, ls: 0.16 })}>SCREENSHOTS</span>
          <Hoverable as="span" style={{ cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.ink, ls: 0.14 }) }} hover={{ color: C.acid }}>
            VIEW ALL (8) →
          </Hoverable>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
          {[
            { id: 1, flex: '2 1 0', ph: 'Drop product screenshot' },
            { id: 2, flex: '1 1 0', ph: 'Screenshot' },
            { id: 3, flex: '1 1 0', ph: 'Screenshot' },
          ].map((s) => (
            <div key={s.id} style={{ flex: s.flex, minWidth: 0, border: `1px solid ${C.line}`, height: '210px' }}>
              <ImageSlot slotId={`shot-${d.product.name}-${s.id}`} placeholder={s.ph} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '14px' }}>
          {d.dots.map((dot, i) => (
            <span key={i} style={{ width: '7px', height: '7px', background: dot.fill }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityRow() {
  const { d } = useMarket();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', borderTop: `1px solid ${C.line}`, paddingTop: '20px' }}>
      <div style={{ flex: '1 1 260px', minWidth: 0 }}>
        <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 10, c: C.violet, ls: 0.16 }) }}>RECENT ACTIVITY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {d.activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', ...mono({ s: 11.5 }) }}>
              <span style={{ flex: '0 0 34px', color: C.grey }}>{a.t}</span>
              <span style={{ flex: '0 0 12px', color: a.color }}>{a.glyph}</span>
              <span style={{ color: C.ink }}>{a.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: '1 1 280px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={mono({ w: 700, s: 10, c: C.violet, ls: 0.16 })}>TOP COMMENTS</span>
          <Hoverable as="span" style={{ cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.ink, ls: 0.14 }) }} hover={{ color: C.acid }}>VIEW ALL →</Hoverable>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {d.comments.map((cm) => (
            <div key={cm.who} style={{ display: 'flex', gap: '11px' }}>
              <span style={{ flex: '0 0 30px', height: '30px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 9, c: C.ink }) }}>
                {cm.initial}
              </span>
              <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                <span style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
                  <span style={mono({ w: 500, s: 11.5, c: C.bone })}>{cm.who}</span>
                  <span style={mono({ s: 10, c: C.grey })}>{cm.when}</span>
                  <span style={{ marginLeft: 'auto', ...mono({ w: 700, s: 11, c: C.up }) }}>{cm.score} ▲</span>
                </span>
                <span style={{ display: 'block', marginTop: '5px', ...text({ s: 12.5, lh: 1.6, c: C.ink }) }}>{cm.body}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={mono({ w: 700, s: 10, c: C.violet, ls: 0.16 })}>RANK HISTORY</span>
          <span style={{ display: 'flex', gap: '10px', ...mono({ w: 500, s: 9.5, ls: 0.12 }) }}>
            {['7D', '30D', '90D', 'ALL'].map((r) => (
              <span key={r} style={{ cursor: 'pointer', color: r === '30D' ? C.bone : C.grey, borderBottom: r === '30D' ? `1px solid ${C.bone}` : 'none' }}>
                {r}
              </span>
            ))}
          </span>
        </div>
        <div
          style={{
            border: `1px solid ${C.line}`, height: '150px', padding: '8px',
            backgroundImage:
              'linear-gradient(rgba(124,99,203,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,99,203,0.12) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          <svg viewBox="0 0 240 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} aria-hidden>
            <polyline points={d.rankSeries} fill="none" stroke={C.violetLift} strokeWidth="2" />
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.12 }) }}>
          <span>MAY 5</span><span>MAY 19</span><span>JUN 2</span>
        </div>
      </div>
    </div>
  );
}

function StatesAndShare() {
  const { d, actions } = useMarket();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', borderTop: `1px solid ${C.line}`, paddingTop: '20px' }}>
      <div style={{ flex: '1 1 340px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
          <span style={mono({ w: 700, s: 10, c: C.violet, ls: 0.16 })}>APPROVED WIDGET — RENDER STATES</span>
          <Hoverable as="span" onClick={actions.goStudio} style={{ cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.ink, ls: 0.14 }) }} hover={{ color: C.acid }}>
            OPEN IN STUDIO →
          </Hoverable>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
          {d.pStates.map((s) => (
            <span key={s.key} style={{ flex: '1 1 128px', background: C.ground, padding: '12px 13px' }}>
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                <span style={mono({ w: 700, s: 9, c: s.hue, ls: 0.13 })}>{s.key}</span>
                <span style={mono({ w: 700, s: 8.5, c: s.statusColor })}>{s.status}</span>
              </span>
              <span style={{ display: 'block', marginTop: '8px', ...mono({ s: 10, c: C.grey }) }}>{s.size}</span>
            </span>
          ))}
        </div>
        <div style={{ marginTop: '14px', ...text({ s: 11.5, lh: 1.65, c: C.grey }) }}>
          One approved spec, six canvases. Version 4 is live; edits create a new immutable version.
        </div>
      </div>

      {/* The share card is glass: it is generated from a live event. */}
      <div style={{ flex: '1 1 320px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
          <span style={mono({ w: 700, s: 10, c: C.violet, ls: 0.16 })}>SHARE CARD</span>
          <Hoverable as="span" style={{ cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.ink, ls: 0.14 }) }} hover={{ color: C.acid }}>COPY LINK ↗</Hoverable>
        </div>
        <div
          style={{
            position: 'relative', overflow: 'hidden', border: '1px solid rgba(124,99,203,0.4)',
            background: 'rgba(14,12,22,0.6)', backdropFilter: 'blur(16px) saturate(150%)',
            WebkitBackdropFilter: 'blur(16px) saturate(150%)',
            boxShadow: 'inset 0 1px 0 rgba(164,143,230,0.18), 0 24px 60px rgba(0,0,0,0.6)',
            padding: '20px', minHeight: '206px', display: 'flex', flexDirection: 'column',
          }}
        >
          <span style={{ position: 'absolute', top: '-120px', right: '-60px', width: '340px', height: '340px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(124,99,203,0.28) 0%, rgba(124,99,203,0) 66%)' }} />
          <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(233,224,196,0.06) 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
          <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ background: C.acid, padding: '4px 8px', ...mono({ w: 700, s: 9, c: C.ground, ls: 0.16 }) }}>RANK {d.pRank}</span>
            <span style={display({ s: 11, c: C.grey })}>OUTRIVL</span>
          </span>
          <span style={{ position: 'relative', marginTop: 'auto', display: 'block', ...display({ s: 'clamp(22px, 6vw, 32px)', lh: 0.95, c: C.bone }) }}>{d.pName}</span>
          <span style={{ position: 'relative', display: 'block', marginTop: '12px', maxWidth: '36ch', ...text({ s: 12.5, lh: 1.6, c: C.ink }) }}>{d.shareLine}</span>
          <span style={{ position: 'relative', display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '13px', borderTop: '1px dotted rgba(233,224,196,0.18)' }}>
            {[
              { k: 'AUDIENCE', v: d.product.aud, c: C.bone },
              { k: 'STARTS', v: '184.2K', c: C.bone },
              { k: 'INTERACTION', v: '31%', c: C.acid },
            ].map((m) => (
              <span key={m.k}>
                <span style={{ display: 'block', ...mono({ w: 500, s: 8, c: C.grey, ls: 0.15 }) }}>{m.k}</span>
                <span style={{ display: 'block', marginTop: '5px', ...mono({ w: 700, s: 15, c: m.c }) }}>{m.v}</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

function FooterLinks() {
  const { actions } = useMarket();
  return (
    <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: '18px', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center' }}>
      <Hoverable as="span" style={{ cursor: 'pointer', ...mono({ w: 500, s: 10, c: C.bone, ls: 0.14 }) }} hover={{ color: C.acid }}>
        LEARN HOW IT WORKS →
      </Hoverable>
      <Hoverable as="span" onClick={actions.goFloor} style={{ cursor: 'pointer', ...mono({ w: 500, s: 10, c: C.ink, ls: 0.14 }) }} hover={{ color: C.acid }}>
        SEE THIS BOOTH ON THE FLOOR →
      </Hoverable>
    </div>
  );
}

function ProductDesk() {
  const { d, actions } = useMarket();
  return (
    <Desk>
      <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
        <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>CURRENT RANK</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '22px' }}>
          <span style={display({ s: 40, c: d.pHue })}>{d.pRank}</span>
          <span style={mono({ w: 700, s: 12, c: C.up })}>▲ 3</span>
          <span style={{ marginLeft: 'auto', ...mono({ s: 11, c: C.grey }) }}>Outrivals 84</span>
        </div>

        <div style={{ marginBottom: '8px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>HIGHEST RANK</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
          <span style={display({ s: 20, c: C.bone })}>#01</span>
          <span style={mono({ s: 11, c: C.grey })}>Achieved 2 days ago</span>
        </div>

        <div style={{ marginBottom: '8px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>TIME ON THE THRONE</div>
        <div style={{ marginBottom: '4px', ...mono({ w: 700, s: 26, c: C.bone }) }}>18H 42M</div>
        <div style={{ marginBottom: '20px', ...mono({ s: 11, c: C.grey }) }}>Total across all reigns</div>

        <div style={{ marginBottom: '8px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>AUDIENCE SCORE</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '18px' }}>
          <span style={mono({ w: 700, s: 26, c: C.bone })}>{d.product.aud}</span>
          <span style={mono({ s: 11, c: C.grey })}>/10</span>
          <span style={mono({ w: 700, s: 11, c: C.up })}>{d.product.audD}</span>
          <svg viewBox="0 0 120 32" style={{ marginLeft: 'auto', width: '110px', height: '32px' }} aria-hidden>
            <polyline points={d.throneSpark} fill="none" stroke={C.violetLift} strokeWidth="2" />
          </svg>
        </div>

        <div style={{ marginBottom: '8px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>ENGAGEMENT (30D)</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={mono({ w: 700, s: 26, c: C.bone })}>{d.product.eng}</span>
          <span style={mono({ w: 700, s: 11, c: C.up })}>{d.product.engD}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end', gap: '2px', height: '32px' }}>
            {d.engBars.map((b, i) => (
              <span key={i} style={{ width: '3px', background: C.violet, height: b.h }} />
            ))}
          </span>
        </div>
      </div>

      <Hoverable
        onClick={actions.takeThrone}
        style={{ border: `1px solid ${C.violet}`, color: C.violetLift, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', cursor: 'pointer', ...mono({ w: 700, s: 11, ls: 0.14 }) }}
        hover={{ borderColor: C.violetLift, color: C.bone }}
      >
        CHALLENGE {d.pName} ⚡
      </Hoverable>
      <Hoverable
        onClick={() => actions.goNav('challenges')}
        style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', ...mono({ w: 500, s: 9.5, c: C.ink, ls: 0.14 }) }}
        hover={{ color: C.acid }}
      >
        VIEW CHALLENGE HISTORY<span>→</span>
      </Hoverable>

      <FounderPresence />

      <div style={{ border: `1px solid ${C.line}`, padding: '18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <div style={{ marginBottom: '8px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>CATEGORY</div>
          <div style={mono({ s: 13, c: C.bone })}>{d.pCategorySoft}</div>
        </div>
        <div>
          <div style={{ marginBottom: '8px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>LAUNCHED</div>
          <div style={mono({ s: 13, c: C.bone })}>Mar 2019</div>
        </div>
        <div>
          <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>TEAM</div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {d.team.map((t) => (
              <span key={t} style={{ width: '28px', height: '28px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 8, c: C.ink }) }}>
                {t}
              </span>
            ))}
            <span style={{ marginLeft: '4px', ...mono({ s: 11, c: C.grey }) }}>+8</span>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '10px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>INTEGRATIONS</div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', ...mono({ s: 13, c: C.ink }) }}>
            {['◍', '⌗', '◈'].map((g) => (
              <span key={g} style={{ width: '28px', height: '28px', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{g}</span>
            ))}
            <span style={{ marginLeft: '4px', ...mono({ s: 11, c: C.grey }) }}>+12</span>
          </div>
        </div>
      </div>
    </Desk>
  );
}

/**
 * Founder presence.
 *
 * Glass, because presence is the most ephemeral thing on the page: someone is
 * either at the booth right now or they are not. Opt-in, rate-limited, and a
 * team can be present without exposing which individual is answering.
 */
function FounderPresence() {
  const { d } = useMarket();
  return (
    <div
      style={{
        background: 'rgba(18,20,18,0.6)', backdropFilter: 'blur(18px) saturate(150%)',
        WebkitBackdropFilter: 'blur(18px) saturate(150%)', border: '1px solid rgba(124,194,107,0.32)',
        boxShadow: 'inset 0 1px 0 rgba(124,194,107,0.16), 0 24px 60px rgba(0,0,0,0.6)', padding: '18px',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ position: 'relative', flex: '0 0 38px', height: '38px', border: '1px solid rgba(124,194,107,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 12, c: C.bone }) }}>
          {d.founderInitial}
          <span style={{ position: 'absolute', inset: '-1px', border: '1px solid rgba(124,194,107,0.6)', animation: 'om-ring 2.6s ease-out infinite', pointerEvents: 'none' }} />
        </span>
        <span style={{ flex: '1 1 auto', minWidth: 0 }}>
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.founderStateColor, display: 'block', animation: 'om-blink 1.8s steps(1,end) infinite' }} />
            <span style={mono({ w: 700, s: 9, c: d.founderStateColor, ls: 0.15 })}>{d.founderState}</span>
          </span>
          <span style={{ display: 'block', marginTop: '7px', ...mono({ w: 500, s: 12, c: C.bone, ls: 0.04 }) }}>{d.founderName}</span>
        </span>
      </div>
      <div style={{ marginBottom: '14px', ...text({ s: 12.5, lh: 1.6, c: C.ink }) }}>&ldquo;{d.founderStatus}&rdquo;</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 11px', border: '1px dotted rgba(124,194,107,0.28)', marginBottom: '14px' }}>
        <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>OFFICE HOURS</span>
        <span style={mono({ w: 700, s: 10, c: C.up, ls: 0.13 })}>{d.founderHours}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Hoverable
          as="span"
          style={{ flex: '1 1 auto', textAlign: 'center', border: '1px solid rgba(124,194,107,0.35)', color: C.up, padding: '11px 12px', cursor: 'pointer', ...mono({ w: 500, s: 9.5, ls: 0.13 }) }}
          hover={{ borderColor: C.up }}
        >
          ASK A QUESTION
        </Hoverable>
        <Hoverable
          as="span"
          style={{ flex: '1 1 auto', textAlign: 'center', border: `1px solid ${C.line}`, color: C.ink, padding: '11px 12px', cursor: 'pointer', ...mono({ w: 500, s: 9.5, ls: 0.13 }) }}
          hover={{ borderColor: C.bone, color: C.bone }}
        >
          NOTIFY ME
        </Hoverable>
      </div>
      {d.opportunities.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {d.opportunities.map((o) => (
            <span key={o.label} style={{ border: `1px solid ${o.border}`, padding: '4px 7px', ...mono({ w: 700, s: 8, c: o.color, ls: 0.13 }) }}>
              {o.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
