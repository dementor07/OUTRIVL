'use client';

import { C } from '@/lib/tokens';
import { display, mono, text } from '@/components/ui/type';
import { Hoverable } from '@/components/ui/Hoverable';
import { hms, pad } from '@/lib/format';
import {
  BOOTHS, ECONOMIES, FAQ, FLOOR_FACTS, FLOOR_PULSE, HERO_LADDER, HERO_STATS,
  LANDING_BRANDS, NAV_LINKS, PLANS, POOL_TIERS, RENDER_STATES, STEPS, TAPE,
  WIDGET_FACTS, landingBrand,
} from '@/lib/landing';
import { mix } from '@/lib/brands';
import { useLanding } from '@/state/useLanding';

const WRAP = { maxWidth: '1240px', margin: '0 auto', padding: '80px 28px' } as const;

/** Section reveal wrapper. Fails open — see `useLanding`. */
function Reveal({
  id, rvKey, o, y, children, style,
}: {
  id?: string; rvKey: string; o: number; y: string;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      data-rv={rvKey}
      style={{
        borderBottom: `1px solid ${C.line}`,
        opacity: o,
        transform: `translateY(${y})`,
        transition: 'opacity 600ms ease, transform 600ms cubic-bezier(.16,1,.3,1)',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function SectionHead({ eyebrow, eyebrowColor, title, blurb, maxCh = 38 }: {
  eyebrow: string; eyebrowColor: string; title: React.ReactNode; blurb: string; maxCh?: number;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 40px', alignItems: 'flex-end', marginBottom: '40px' }}>
      <span style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <span style={mono({ w: 700, s: 9, c: eyebrowColor, ls: 0.18 })}>{eyebrow}</span>
        <h2 style={{ margin: 0, ...display({ s: 40, lh: 1, c: C.bone, ls: -0.01 }) }}>{title}</h2>
      </span>
      <p style={{ margin: '0 0 4px auto', maxWidth: `${maxCh}ch`, textWrap: 'pretty', ...text({ s: 14.5, lh: 1.7, c: C.ink }) }}>
        {blurb}
      </p>
    </div>
  );
}

export function Landing() {
  const { s, actions, rv, rvY } = useLanding();
  const W = landingBrand(s.brand, s.tone);
  const raw = LANDING_BRANDS[s.brand];

  // Scrubber: eased so the swap lands with weight rather than sliding linearly.
  const T = s.scrub;
  const ease = T < 0.5 ? 2 * T * T : 1 - Math.pow(-2 * T + 2, 2) / 2;
  const flipped = T > 0.52;
  const incF = 62 - ease * 34;
  const chF = 38 + ease * 34;

  // Hero parallax is clamped to roughly the hero's own height. Past that the
  // layers are off-screen, and an unclamped transform would keep drifting them
  // hundreds of pixels for no visible benefit.
  const hy = Math.min(s.sy, 820);

  const yr = s.cycle === 'yr';
  const filled = Math.round(48 * 0.63 * s.poolFill);

  // Simulator: a just-taken throne is expensive, a long quiet reign is cheap.
  const simMin = s.sim * 14;
  const simAsk = Math.round(48 * Math.max(0.68, 1.34 - s.sim * 0.028));
  const escalating = s.sim < 8;

  const lanes = [0, 1, 2].map((k) => ({
    key: k,
    name: raw.lanes[k],
    items: s.cards.filter((c) => c.col === k).map((c) => ({ id: c.id, label: raw.labels[Number(c.id.slice(1)) - 1] })),
    count: s.cards.filter((c) => c.col === k).length,
  }));

  return (
    <div style={{ background: C.ground, fontFamily: "'JetBrains Mono', monospace", overflowX: 'hidden' }}>
      {/* ---- Nav ---------------------------------------------------------- */}
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6,6,8,0.74)',
          backdropFilter: 'blur(20px) saturate(150%)', WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          borderBottom: `1px solid ${s.sy > 12 ? 'rgba(233,224,196,0.16)' : 'rgba(233,224,196,0.06)'}`,
          transition: 'border-color 200ms linear',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 28px', height: '64px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#top" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ width: '26px', height: '26px', border: `1px solid ${C.acid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...display({ s: 13, c: C.acid }) }}>✳</span>
            <span style={display({ s: 19, c: C.bone, ls: 0.03 })}>OUTRIVL</span>
          </a>
          <span style={{ display: 'flex', gap: '9px', alignItems: 'center', padding: '5px 9px', border: '1px solid rgba(207,218,79,0.35)', background: 'rgba(207,218,79,0.06)' }}>
            <span style={{ width: '5px', height: '5px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
            <span style={mono({ w: 700, s: 8.5, c: C.acid, ls: 0.16 })}>SEASON 04 LIVE</span>
          </span>
          <nav style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'nowrap', gap: '20px', alignItems: 'center' }}>
            {NAV_LINKS.map((l) => (
              <Hoverable as="span" key={l.href} style={{ whiteSpace: 'nowrap' }}>
                <a href={l.href} style={{ ...mono({ w: 500, s: 10, c: C.ink, ls: 0.15 }) }}>{l.label}</a>
              </Hoverable>
            ))}
            <a
              href="/app"
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '10px', background: C.acid, color: C.ground, padding: '10px 15px', ...mono({ w: 700, s: 10, ls: 0.14 }) }}
            >
              ENTER THE BOARD <span>→</span>
            </a>
          </nav>
        </div>
      </header>

      {/* ---- Hero --------------------------------------------------------- */}
      <section id="top" onMouseMove={actions.onHeroMove} style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${C.line}` }}>
        <div style={{ position: 'absolute', inset: '-20% 0', pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(124,99,203,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(124,99,203,0.07) 1px, transparent 1px)', backgroundSize: '52px 52px', transform: `translateY(${(hy * 0.16).toFixed(1)}px)` }} />
        <div style={{ position: 'absolute', top: '-260px', left: '-120px', width: '760px', height: '760px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(124,99,203,0.24) 0%, rgba(124,99,203,0) 62%)', animation: 'om-halo 7s ease-in-out infinite', transform: `translateY(${(hy * -0.14).toFixed(1)}px)` }} />
        <div style={{ position: 'absolute', bottom: '-300px', right: '-160px', width: '820px', height: '820px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(207,218,79,0.13) 0%, rgba(207,218,79,0) 64%)', animation: 'om-halo 9s ease-in-out infinite', transform: `translateY(${(hy * 0.1).toFixed(1)}px)` }} />
        {/* Cursor-follow glow. */}
        <div style={{ position: 'absolute', width: '520px', height: '520px', borderRadius: '50%', pointerEvents: 'none', left: `${(s.mx * 100).toFixed(1)}%`, top: `${(s.my * 100).toFixed(1)}%`, margin: '-260px 0 0 -260px', background: 'radial-gradient(circle, rgba(207,218,79,0.10) 0%, rgba(207,218,79,0) 62%)', transition: 'left 220ms linear, top 220ms linear' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 240px rgba(0,0,0,0.9)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '110px', pointerEvents: 'none', background: 'linear-gradient(rgba(207,218,79,0.05), transparent)', animation: 'om-scan 10s linear infinite' }} />

        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto', padding: '80px 28px 0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '52px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 560px', minWidth: 0, transform: `translateY(${(hy * 0.05).toFixed(1)}px)` }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '26px' }}>
                <span style={{ background: C.acid, padding: '5px 9px', ...mono({ w: 700, s: 9, c: C.ground, ls: 0.17 }) }}>ATTENTION MARKET</span>
                <span style={{ border: '1px solid rgba(124,99,203,0.5)', padding: '5px 9px', ...mono({ w: 500, s: 9, c: C.violetLift, ls: 0.17 }) }}>THE AD IS THE PRODUCT</span>
              </div>
              <h1 style={{ margin: '0 0 24px', textWrap: 'balance', ...display({ s: 84, lh: 0.9, c: C.bone, ls: -0.02 }) }}>
                COMPETE<br />FOR<br />ATTENTION
              </h1>
              <p style={{ margin: '0 0 30px', maxWidth: '50ch', textWrap: 'pretty', ...text({ s: 17.5, lh: 1.7, c: C.ink }) }}>
                One product holds the top of every market. Everyone else is bidding to take it. The prize
                isn&apos;t a banner — it&apos;s the largest interactive canvas on the internet, where people use your
                product instead of scrolling past a picture of it.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '34px' }}>
                <a href="/app" style={{ display: 'flex', alignItems: 'center', gap: '14px', background: C.acid, color: C.ground, padding: '16px 22px', ...mono({ w: 700, s: 11, ls: 0.15 }) }}>
                  TAKE THE THRONE <span>→</span>
                </a>
                <a href="#takeover" style={{ display: 'flex', alignItems: 'center', gap: '14px', border: `1px solid ${C.line}`, color: C.bone, padding: '16px 22px', ...mono({ w: 500, s: 11, ls: 0.15 }) }}>
                  WATCH A DETHRONEMENT
                </a>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px dotted #2A2A2A', paddingTop: '20px' }}>
                {HERO_STATS.map((st) => (
                  <span key={st.label} style={{ flex: '1 1 132px', minWidth: 0, paddingRight: '18px' }}>
                    <span style={{ display: 'block', ...mono({ w: 700, s: 26, c: C.bone }) }}>{st.value}</span>
                    <span style={{ display: 'block', marginTop: '6px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>{st.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Live market pane. Glass — this is the changing half of the hero. */}
            <div style={{ flex: '1 1 420px', minWidth: 0, transform: `translateY(${(hy * -0.07).toFixed(1)}px)` }}>
              <div style={{ background: 'rgba(18,18,22,0.55)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(233,224,196,0.14)', boxShadow: 'inset 0 1px 0 rgba(233,224,196,0.13), 0 30px 70px rgba(0,0,0,0.65)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'center', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.16 }) }}>
                    <span style={{ width: '5px', height: '5px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
                    LIVE — INDIE MARKET
                  </span>
                  <span suppressHydrationWarning style={mono({ s: 9.5, c: C.grey })}>{hms(s.clock % 86400)} UTC</span>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <span style={{ width: '54px', height: '54px', flex: '0 0 auto', border: '1px solid rgba(233,224,196,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(233,224,196,0.05)', ...display({ s: 20, c: C.bone }) }}>S</span>
                  <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <span style={{ display: 'block', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.17 }) }}>HOLDING THE THRONE</span>
                    <span style={{ display: 'block', marginTop: '7px', ...display({ s: 27, c: C.bone }) }}>SUPERLIST</span>
                    <span style={{ display: 'block', marginTop: '8px', ...mono({ w: 500, s: 9.5, c: C.violetLift, ls: 0.15 }) }}>PRODUCTIVITY • SAAS</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1px', background: 'rgba(233,224,196,0.12)', border: '1px solid rgba(233,224,196,0.12)', marginBottom: '16px' }}>
                  {[
                    { k: 'REIGN', v: hms(s.reign), c: C.bone, live: true },
                    { k: 'ASK', v: '$52', c: C.acid, live: false },
                    { k: 'STATE', v: 'VULNERABLE', c: C.down, live: false, small: true },
                  ].map((m) => (
                    <span key={m.k} style={{ flex: '1 1 0', background: 'rgba(8,8,10,0.6)', padding: '12px' }}>
                      <span style={{ display: 'block', ...mono({ w: 500, s: 8, c: C.grey, ls: 0.15 }) }}>{m.k}</span>
                      <span suppressHydrationWarning style={{ display: 'block', marginTop: m.small ? '11px' : '7px', ...mono({ w: 700, s: m.small ? 12 : 19, c: m.c, ls: m.small ? 0.12 : undefined }) }}>
                        {m.v}
                      </span>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(233,224,196,0.08)' }}>
                  {HERO_LADDER.map((r) => (
                    <span key={r.rank} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(8,8,10,0.55)', padding: '9px 11px' }}>
                      <span style={{ flex: '0 0 26px', ...display({ s: 13, c: r.hue }) }}>{r.rank}</span>
                      <span style={{ flex: '1 1 auto', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...mono({ w: 500, s: 11.5, c: C.bone, ls: 0.05 }) }}>{r.name}</span>
                      <span style={{ flex: '0 0 auto', ...mono({ s: 10, c: C.grey }) }}>{r.aud}</span>
                      <span style={{ flex: '0 0 42px', textAlign: 'right', ...mono({ w: 700, s: 11, c: C.bone }) }}>{r.bid}</span>
                    </span>
                  ))}
                </div>
                <a href="/app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px dotted rgba(233,224,196,0.16)', ...mono({ w: 500, s: 9.5, c: C.bone, ls: 0.15 }) }}>
                  OPEN THE FULL BOARD <span>→</span>
                </a>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '56px', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, height: '44px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <span style={{ flex: '0 0 auto', paddingRight: '20px', borderRight: `1px solid ${C.line}`, marginRight: '20px', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.15 }) }}>MARKET TAPE</span>
            <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden' }}>
              <span style={{ display: 'flex', gap: '36px', whiteSpace: 'nowrap', animation: 'om-marquee 42s linear infinite', ...mono({ s: 11.5, c: C.ink }) }}>
                {[...TAPE, ...TAPE].map((t, i) => (
                  <span key={i} style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
                    <span style={{ color: t.color }}>{t.who}</span>
                    <span>{t.what}</span>
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ---- 01 The mechanic ---------------------------------------------- */}
      <Reveal id="mechanic" rvKey="m1" o={rv('m1')} y={rvY('m1')}>
        <div style={WRAP}>
          <SectionHead
            eyebrow="/ 01 — THE MECHANIC"
            eyebrowColor={C.acid}
            title={<>ONE SLOT.<br />EVERYONE WANTS IT.</>}
            blurb="There is no auction house and no impression roulette. There is a price to take the top, and it moves with the market."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
            {STEPS.map((st) => (
              <Hoverable key={st.n} style={{ background: C.ground, padding: '26px 22px', minHeight: '246px', display: 'flex', flexDirection: 'column', transition: 'background 160ms linear' }} hover={{ background: '#0B0B0D' }}>
                <span style={{ lineHeight: 1, marginBottom: '20px', ...display({ s: 46, c: st.hue }) }}>{st.n}</span>
                <span style={{ marginBottom: '12px', ...mono({ w: 500, s: 13, c: C.bone, ls: 0.1 }) }}>{st.title}</span>
                <span style={{ textWrap: 'pretty', ...text({ s: 13.5, lh: 1.7, c: C.ink }) }}>{st.body}</span>
                <span style={{ marginTop: 'auto', paddingTop: '18px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>{st.foot}</span>
              </Hoverable>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ---- 02 The takeover ---------------------------------------------- */}
      <Reveal id="takeover" rvKey="m2" o={rv('m2')} y={rvY('m2')} style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, rgba(233,224,196,0.03) 0px, rgba(233,224,196,0.03) 1px, transparent 1px, transparent 3px)' }} />
        <div style={{ position: 'relative', ...WRAP }}>
          <SectionHead
            eyebrow="/ 02 — THE TAKEOVER"
            eyebrowColor={C.violetLift}
            title={<>DRAG IT<br />YOURSELF</>}
            blurb="The most important second in the product. The incumbent compresses, the challenger expands into the #1 footprint, and the tape records it. Scrub the track to run it at your own pace."
          />

          <div style={{ border: `1px solid ${C.line}`, padding: '26px', background: '#070708' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'stretch', minHeight: '250px', marginBottom: '26px' }}>
              <ScrubPane
                flex={`${incF.toFixed(1)} 1 0%`}
                opacity={(1 - ease * 0.42).toFixed(2)}
                rank={flipped ? '02' : '01'}
                rankSize={flipped ? '30px' : '46px'}
                nameSize={flipped ? '20px' : '30px'}
                hue={flipped ? C.violet : C.bone}
                badge={flipped ? 'OUTRIVLED' : 'HOLDING'}
                border={flipped ? 'rgba(124,99,203,0.3)' : 'rgba(233,224,196,0.3)'}
                bg={flipped ? 'rgba(10,10,12,0.6)' : 'rgba(20,20,16,0.55)'}
                glow={flipped ? 'none' : 'radial-gradient(circle at 24% 16%, rgba(207,218,79,0.14), transparent 62%)'}
                name="SUPERLIST"
                note={flipped ? 'Reign ended at 03:04:17. 4,820 Crown Points banked on the way out.' : 'Reigning 03:04:17. The ask has decayed 12% through a quiet hold.'}
              />
              <ScrubPane
                flex={`${chF.toFixed(1)} 1 0%`}
                rank={flipped ? '01' : '02'}
                rankSize={flipped ? '46px' : '30px'}
                nameSize={flipped ? '30px' : '20px'}
                hue={flipped ? C.bone : C.violet}
                badge={flipped ? 'THE THRONE' : 'CHALLENGER'}
                border={flipped ? 'rgba(233,224,196,0.3)' : 'rgba(124,99,203,0.3)'}
                bg={flipped ? 'rgba(20,20,16,0.55)' : 'rgba(14,12,22,0.55)'}
                glow={flipped ? 'radial-gradient(circle at 24% 16%, rgba(207,218,79,0.14), transparent 62%)' : 'radial-gradient(circle at 30% 20%, rgba(124,99,203,0.13), transparent 66%)'}
                name="DUB"
                note={flipped ? 'Widget expanded into the #1 canvas. Guaranteed minimum starts now running.' : 'Bid $41 against an ask of $41. Clears on settlement.'}
              />
            </div>

            <div
              onMouseDown={actions.scrubDown}
              role="slider"
              aria-label="Dethronement progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(T * 100)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') actions.setScrub(T + 0.05);
                if (e.key === 'ArrowLeft') actions.setScrub(T - 0.05);
              }}
              style={{ position: 'relative', height: '38px', border: `1px solid ${C.line}`, background: '#0B0B0D', cursor: 'ew-resize', userSelect: 'none' }}
            >
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(T * 100).toFixed(1)}%`, background: 'rgba(207,218,79,0.10)' }} />
              <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: C.line }} />
              {[0, 25, 50, 75, 100].map((x) => (
                <span key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: '1px', background: x === 50 ? C.fillOlive : '#1A1A1A' }} />
              ))}
              <span style={{ position: 'absolute', top: '-1px', bottom: '-1px', left: `${(T * 100).toFixed(1)}%`, width: '3px', marginLeft: '-1px', background: C.acid, boxShadow: '0 0 14px rgba(207,218,79,0.8)' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', marginTop: '12px' }}>
              {[
                { t: 'BID PLACED', at: 0.02 }, { t: 'ASK CLEARED', at: 0.26 },
                { t: 'SETTLEMENT', at: 0.52 }, { t: 'CANVAS SWAP', at: 0.74 },
                { t: 'TAPE RECORDS IT', at: 0.96 },
              ].map((sl) => (
                <span key={sl.t} style={mono({ w: 500, s: 8.5, c: T > sl.at ? (sl.at === 0.52 ? C.acid : C.bone) : C.greyDeep, ls: 0.14 })}>
                  {sl.t}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', alignItems: 'center', marginTop: '22px', paddingTop: '18px', borderTop: '1px dotted #2A2A2A' }}>
              <span style={text({ s: 12.5, c: C.grey })}>
                {T < 0.02
                  ? 'Drag the track. Nothing here is a video — it is the same motion the product runs on settlement.'
                  : flipped
                    ? 'Dub holds the throne. Superlist keeps its Crown Points; only the canvas changed hands.'
                    : 'Superlist still holds. The bid is in but the ask has not settled.'}
              </span>
              <span style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
                {[{ k: 'CLEARING BID', v: '$41', c: C.bone }, { k: 'NEXT ASK', v: '$48', c: C.acid }].map((m) => (
                  <span key={m.k} style={{ display: 'flex', gap: '9px', alignItems: 'baseline' }}>
                    <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>{m.k}</span>
                    <span style={mono({ w: 700, s: 13, c: m.c })}>{m.v}</span>
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---- 03 The canvas ------------------------------------------------ */}
      <Reveal id="widget" rvKey="m3" o={rv('m3')} y={rvY('m3')} style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-180px', right: '-140px', width: '640px', height: '640px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(124,99,203,0.18) 0%, rgba(124,99,203,0) 64%)' }} />
        <div style={{ position: 'relative', ...WRAP }}>
          <SectionHead
            eyebrow="/ 03 — THE CANVAS"
            eyebrowColor={C.violetLift}
            title={<>THE AD IS<br />THE PRODUCT</>}
            blurb="Winning the throne boots your real product inside the page — in your brand, not ours. OUTRIVL owns the frame and the telemetry. You own everything inside it."
            maxCh={40}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ marginRight: '4px', ...mono({ w: 500, s: 9, c: C.grey, ls: 0.16 }) }}>ADVERTISER</span>
            {Object.keys(LANDING_BRANDS).map((k) => {
              const on = k === s.brand;
              const b = LANDING_BRANDS[k];
              return (
                <Hoverable
                  as="span"
                  key={k}
                  onClick={() => actions.setBrand(k)}
                  style={{ display: 'flex', gap: '9px', alignItems: 'center', padding: '7px 12px', border: `1px solid ${on ? C.acid : C.line}`, background: on ? C.active : 'transparent', cursor: 'pointer' }}
                  hover={{ borderColor: C.ink }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: b.radius, background: b.accent, display: 'block' }} />
                  <span style={mono({ w: 500, s: 10, c: on ? C.acid : C.ink, ls: 0.12 })}>{b.label.toUpperCase()}</span>
                </Hoverable>
              );
            })}
            <Hoverable
              as="span"
              onClick={actions.toggleTone}
              style={{ marginLeft: 'auto', display: 'flex', gap: '9px', alignItems: 'center', padding: '7px 12px', border: `1px solid ${s.tone ? C.acid : C.line}`, cursor: 'pointer' }}
              hover={{ borderColor: C.ink }}
            >
              <span style={{ width: '7px', height: '7px', background: s.tone ? C.acid : '#2A2A2A', display: 'block' }} />
              <span style={mono({ w: 500, s: 9.5, c: s.tone ? C.acid : C.grey, ls: 0.13 })}>AUTO-TONE {s.tone ? 'ON' : 'OFF'}</span>
            </Hoverable>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '22px', alignItems: 'stretch' }}>
            <div style={{ flex: '1 1 560px', minWidth: 0, border: `1px solid ${C.line}` }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${C.line}`, background: '#0B0B0D' }}>
                <span style={{ display: 'flex', gap: '7px', alignItems: 'center', ...mono({ w: 700, s: 8.5, c: C.acid, ls: 0.16 }) }}>
                  <span style={{ width: '5px', height: '5px', background: C.acid, display: 'block', animation: 'om-blink 1.6s steps(1,end) infinite' }} />
                  THRONE CANVAS
                </span>
                <span style={mono({ w: 500, s: 8, c: C.greyDeep, ls: 0.14 })}>OUTRIVL FRAME · ADVERTISER CONTENTS</span>
              </div>
              <div style={{ background: W.bg, padding: '20px', transition: 'background 200ms linear' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: W.radius, background: W.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono({ w: 700, s: 13, c: W.bg }) }}>
                    {W.label.charAt(0)}
                  </span>
                  <span style={{ fontFamily: W.font, fontWeight: 600, fontSize: '17px', color: W.ink, letterSpacing: '-0.01em' }}>{W.label}</span>
                  <span style={{ fontFamily: W.font, fontSize: '12px', color: W.dim }}>{W.tagline}</span>
                  <Hoverable as="span" style={{ marginLeft: 'auto', padding: '8px 15px', borderRadius: W.radius, background: W.accent, cursor: 'pointer', fontFamily: W.font, fontWeight: 600, fontSize: '11.5px', color: W.bg }} hover={{ filter: 'brightness(1.1)' }}>
                    {W.cta}
                  </Hoverable>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '12px' }}>
                  {lanes.map((lane) => (
                    <div key={lane.key} style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', paddingBottom: '9px', marginBottom: '11px', borderBottom: `1px solid ${W.line}` }}>
                        <span style={{ fontFamily: W.font, fontWeight: 600, fontSize: '10px', color: W.accent, letterSpacing: '0.08em' }}>{lane.name}</span>
                        <span style={{ fontFamily: W.font, fontSize: '10px', color: W.dim }}>{lane.count}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '186px' }}>
                        {lane.items.map((c) => (
                          <Hoverable
                            key={c.id}
                            onClick={() => actions.moveCard(c.id)}
                            style={{ border: `1px solid ${W.line}`, borderRadius: W.radius, background: mix(W.bg, W.ink, 0.06), padding: '10px 11px', cursor: 'pointer', fontFamily: W.font, fontSize: '11.5px', lineHeight: 1.45, color: W.ink, transition: 'transform 90ms linear' }}
                            hover={{ transform: 'translateX(3px)' }}
                          >
                            {c.label}
                          </Hoverable>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'space-between', padding: '12px 14px', borderTop: `1px solid ${C.line}` }}>
                {[
                  { k: 'WIDGET STARTS', v: '184.2K', c: C.bone },
                  { k: 'INTERACTION RATE', v: '31%', c: C.bone },
                  { k: 'YOUR MOVES', v: pad(s.moves), c: C.acid },
                ].map((m) => (
                  <span key={m.k} style={{ display: 'flex', gap: '9px', alignItems: 'baseline' }}>
                    <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>{m.k}</span>
                    <span style={mono({ w: 700, s: 13, c: m.c })}>{m.v}</span>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
                <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>WHY IT ISN&apos;T ALL GREY</div>
                <div style={text({ s: 13, lh: 1.7, c: C.ink })}>
                  If every widget looked like OUTRIVL, the ad would stop being the product. So the kit
                  constrains <strong style={{ color: C.bone, fontWeight: 700 }}>structure</strong> — layout
                  slots, interaction verbs, resource budgets — and never colour or type. Switch advertisers
                  above and watch the whole surface change.
                </div>
              </div>
              <div style={{ border: `1px solid ${C.line}`, padding: '18px' }}>
                <div style={{ marginBottom: '14px', ...mono({ w: 700, s: 9.5, c: C.bone, ls: 0.16 }) }}>AUTO-TONE, OPTIONAL</div>
                <div style={text({ s: 13, lh: 1.7, c: C.ink })}>
                  A crowded board of loud brands can get noisy. Auto-tone pulls an advertiser&apos;s palette
                  toward the board without flattening it — their call, per placement, never forced.
                </div>
              </div>
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
                {WIDGET_FACTS.map((w) => (
                  <span key={w.k} style={{ flex: '1 1 auto', display: 'flex', gap: '14px', alignItems: 'baseline', background: C.ground, padding: '14px 16px' }}>
                    <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 10.5, c: C.acid }) }}>{w.k}</span>
                    <span style={{ flex: '1 1 auto', ...text({ s: 12, lh: 1.55, c: C.ink }) }}>{w.v}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '52px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'baseline', marginBottom: '20px' }}>
              <span style={mono({ w: 700, s: 9, c: C.grey, ls: 0.18 })}>ONE WIDGET, SIX STATES</span>
              <span style={text({ s: 12.5, c: C.grey })}>The same approved spec re-renders for whatever canvas it lands in.</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1px', background: C.line, border: `1px solid ${C.line}` }}>
              {RENDER_STATES.map((st) => (
                <Hoverable key={st.key} style={{ background: C.ground, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '168px', transition: 'background 160ms linear' }} hover={{ background: '#0B0B0D' }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <span style={mono({ w: 700, s: 9.5, c: st.hue, ls: 0.14 })}>{st.key}</span>
                    <span style={mono({ s: 8.5, c: C.grey })}>{st.size}</span>
                  </span>
                  <span style={{ flex: '1 1 auto', border: `1px solid ${C.lineDeep}`, backgroundImage: 'radial-gradient(rgba(233,224,196,0.07) 1px, transparent 1px)', backgroundSize: '4px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
                      {st.bars.map((bar, i) => (
                        <span key={i} style={{ height: bar.h, width: bar.w, background: bar.c }} />
                      ))}
                    </span>
                  </span>
                  <span style={text({ s: 10.5, lh: 1.5, c: C.grey })}>{st.note}</span>
                </Hoverable>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---- 04 The economies --------------------------------------------- */}
      <Reveal rvKey="m4" o={rv('m4')} y={rvY('m4')}>
        <div style={WRAP}>
          <SectionHead
            eyebrow="/ 04 — THE ECONOMIES"
            eyebrowColor={C.acid}
            title={<>THREE MARKETS.<br />THREE THRONES.</>}
            blurb="A solo maker never bids against a Series C budget. Each class is a sealed economy with its own throne, its own ceiling and its own champion."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px', marginBottom: '44px' }}>
            {ECONOMIES.map((e) => (
              <Hoverable key={e.name} style={{ border: `1px solid ${e.border}`, background: e.bg, padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '330px', transition: 'border-color 160ms linear' }} hover={{ borderColor: C.ink }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                  <span style={mono({ w: 700, s: 15, c: e.hue, ls: 0.16 })}>{e.name}</span>
                  <span style={mono({ w: 500, s: 9, c: C.grey, ls: 0.14 })}>{e.count} RANKED</span>
                </span>
                <span style={mono({ w: 700, s: 34, c: C.bone })}>{e.cap}</span>
                <span style={{ marginTop: '8px', marginBottom: '22px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>DAILY SPEND CEILING</span>
                <span style={{ marginBottom: '22px', textWrap: 'pretty', ...text({ s: 13.5, lh: 1.7, c: C.ink }) }}>{e.body}</span>
                <span style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '18px', borderTop: '1px dotted #2A2A2A' }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>CURRENT KING</span>
                    <span style={mono({ w: 500, s: 11.5, c: C.bone, ls: 0.05 })}>{e.king}</span>
                  </span>
                  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>ASK RIGHT NOW</span>
                    <span style={mono({ w: 700, s: 12, c: C.acid })}>{e.ask}</span>
                  </span>
                </span>
              </Hoverable>
            ))}
          </div>

          {/* Ask-price simulator. */}
          <div style={{ border: `1px solid ${C.line}`, padding: '26px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end', marginBottom: '24px' }}>
              <span>
                <span style={{ display: 'block', marginBottom: '10px', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.17 }) }}>ASK PRICE SIMULATOR</span>
                <span style={{ display: 'block', maxWidth: '52ch', ...text({ s: 13.5, lh: 1.7, c: C.ink }) }}>
                  Escalation raises the ask with every takeover. Decay lowers it through a quiet reign. Drag
                  the reign length and watch what an idle king costs.
                </span>
              </span>
              <span style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span style={{ display: 'block', lineHeight: 1, ...mono({ w: 700, s: 46, c: C.acid }) }}>${simAsk}</span>
                <span style={{ display: 'block', marginTop: '9px', ...mono({ w: 700, s: 9.5, c: escalating ? C.down : C.up, ls: 0.15 }) }}>
                  {escalating ? '▲ ESCALATED AFTER A TAKEOVER' : '▼ DECAYING THROUGH A QUIET REIGN'}
                </span>
              </span>
            </div>
            <div
              role="slider"
              aria-label="Reign length"
              aria-valuemin={0}
              aria-valuemax={27}
              aria-valuenow={s.sim}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') actions.setSim(Math.min(27, s.sim + 1));
                if (e.key === 'ArrowLeft') actions.setSim(Math.max(0, s.sim - 1));
              }}
              style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}
            >
              {Array.from({ length: 28 }, (_, k) => (
                <span
                  key={k}
                  onClick={() => actions.setSim(k)}
                  onMouseEnter={(e) => { if (e.buttons === 1) actions.setSim(k); }}
                  style={{ flex: '1 1 auto', height: '34px', background: k === s.sim ? C.acid : k < s.sim ? 'rgba(207,218,79,0.16)' : C.fillIdle, cursor: 'pointer', transition: 'background 90ms linear' }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.14 }) }}>
              <span>JUST TAKEN — ESCALATED</span>
              <span>REIGN {pad(Math.floor(simMin / 60))}H {pad(simMin % 60)}M</span>
              <span>LONG QUIET REIGN — CHEAP</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---- 05 Prize pool ------------------------------------------------ */}
      <Reveal id="pool" rvKey="m5" o={rv('m5')} y={rvY('m5')} style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(207,218,79,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(207,218,79,0.05) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div style={{ position: 'relative', ...WRAP }}>
          <div style={{ background: 'rgba(16,16,12,0.55)', backdropFilter: 'blur(22px) saturate(160%)', WebkitBackdropFilter: 'blur(22px) saturate(160%)', border: '1px solid rgba(207,218,79,0.3)', boxShadow: 'inset 0 1px 0 rgba(207,218,79,0.18), 0 34px 80px rgba(0,0,0,0.7)', padding: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px', alignItems: 'flex-end', marginBottom: '30px' }}>
              <span>
                <span style={{ display: 'block', marginBottom: '14px', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.18 }) }}>/ 05 — LAUNCH IGNITION</span>
                <span style={{ display: 'block', ...display({ s: 34, c: C.bone }) }}>SEASON ZERO PRIZE POOL</span>
              </span>
              <span style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span style={{ display: 'block', lineHeight: 1, ...mono({ w: 700, s: 58, c: C.acid }) }}>$5,000</span>
                <span style={{ display: 'block', marginTop: '8px', ...mono({ w: 500, s: 8.5, c: C.grey, ls: 0.16 }) }}>UNLOCKED &amp; FUNDED · HARD CAP $25,000</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
              {Array.from({ length: 48 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    flex: '1 1 auto', height: '26px',
                    background: i < filled ? C.acid : i < 30 ? C.fillWarm : C.fillIdle,
                    boxShadow: i === filled - 1 ? '0 0 16px rgba(207,218,79,0.8)' : 'none',
                    transition: 'background 320ms linear',
                    transitionDelay: `${i * 12}ms`,
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', background: 'rgba(233,224,196,0.1)', border: '1px solid rgba(233,224,196,0.1)', marginBottom: '22px' }}>
              {POOL_TIERS.map((t) => (
                <span key={t.label} style={{ flex: '1 1 160px', background: 'rgba(6,6,8,0.6)', padding: '14px 15px' }}>
                  <span style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '9px' }}>
                    <span style={{ width: '7px', height: '7px', background: t.dot, display: 'block' }} />
                    <span style={mono({ w: 700, s: 8.5, c: t.labelColor, ls: 0.15 })}>{t.label}</span>
                  </span>
                  <span style={{ display: 'block', ...mono({ w: 700, s: 22, c: t.amountColor }) }}>{t.amount}</span>
                  <span style={{ display: 'block', marginTop: '7px', ...mono({ s: 10.5, c: C.grey }) }}>{t.status}</span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ maxWidth: '62ch', textWrap: 'pretty', ...text({ s: 12.5, lh: 1.7, c: C.ink }) }}>
                Tiers unlock from verified marketplace volume, never from your own spend. Paid attacks cannot
                improve promotional standing — the free evaluation path is the only route to the pool.
              </span>
              <span style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>TO NEXT TIER</span>
                <span style={mono({ w: 700, s: 20, c: C.bone })}>73%</span>
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---- 06 The Floor -------------------------------------------------- */}
      <Reveal rvKey="m6" o={rv('m6')} y={rvY('m6')}>
        <div style={WRAP}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '44px' }}>
            <div style={{ flex: '1 1 400px', minWidth: 0 }}>
              <span style={{ display: 'block', marginBottom: '22px', ...mono({ w: 700, s: 9, c: C.violetLift, ls: 0.18 }) }}>/ 06 — THE FLOOR</span>
              <h2 style={{ margin: '0 0 22px', ...display({ s: 40, lh: 1, c: C.bone }) }}>RANK BECOMES<br />FLOOR SPACE</h2>
              <p style={{ margin: '0 0 22px', maxWidth: '44ch', textWrap: 'pretty', ...text({ s: 15.5, lh: 1.75, c: C.ink }) }}>
                The Floor is the same ladder rendered as a place — not a separate product. #1 gets the landmark
                installation; the rest get proportionate booths. Hover one to wake it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FLOOR_FACTS.map((f) => (
                  <span key={f.g} style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                    <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 10, c: C.violetLift }) }}>{f.g}</span>
                    <span style={text({ s: 13, lh: 1.65, c: C.ink })}>{f.t}</span>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ flex: '1 1 480px', minWidth: 0 }}>
              <div style={{ position: 'relative', border: `1px solid ${C.line}`, minHeight: '390px', padding: '22px', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(124,99,203,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(124,99,203,0.09) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 120px rgba(0,0,0,0.85)' }} />
                {FLOOR_PULSE.map((fp, i) => (
                  <span key={i} style={{ position: 'absolute', left: fp.x, top: fp.y, width: '14px', height: '14px', borderRadius: '50%', border: '1px solid rgba(164,143,230,0.7)', animation: 'om-ring 2.8s ease-out infinite', animationDelay: fp.delay, pointerEvents: 'none' }} />
                ))}
                <span style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'stretch' }}>
                  {BOOTHS.map((b) => (
                    <Hoverable
                      as="span"
                      key={b.rank}
                      style={{ flex: b.flex, minWidth: b.minw, height: b.h, position: 'relative', border: `1px solid ${b.border}`, background: 'rgba(12,12,16,0.66)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '12px', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'border-color 140ms linear, transform 140ms linear' }}
                      hover={{ borderColor: C.violetLift, transform: 'translateY(-3px)' }}
                    >
                      <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: b.glow }} />
                      <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: b.rankSize, color: b.hue }}>{b.rank}</span>
                        <span style={mono({ w: 500, s: 8, c: C.grey, ls: 0.13 })}>{b.metric}</span>
                      </span>
                      <span style={{ position: 'relative', marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: b.nameSize, color: C.bone, letterSpacing: '0.05em' }}>{b.name}</span>
                      {b.present && (
                        <span style={{ position: 'relative', display: 'flex', gap: '7px', alignItems: 'center', marginTop: '8px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.up, display: 'block', animation: 'om-blink 1.8s steps(1,end) infinite' }} />
                          <span style={mono({ w: 700, s: 7.5, c: C.up, ls: 0.14 })}>FOUNDER ONLINE</span>
                        </span>
                      )}
                    </Hoverable>
                  ))}
                </span>
                <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px dotted #2A2A2A' }}>
                  <span style={mono({ w: 500, s: 8.5, c: C.grey, ls: 0.15 })}>FLOOR PLAN — INDIE HALL</span>
                  <span style={mono({ w: 500, s: 8.5, c: C.violetLift, ls: 0.15 })}>SIZE = RANK</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---- 07 Pricing ---------------------------------------------------- */}
      <Reveal id="pricing" rvKey="m7" o={rv('m7')} y={rvY('m7')}>
        <div style={WRAP}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 40px', alignItems: 'flex-end', marginBottom: '40px' }}>
            <span>
              <span style={{ display: 'block', marginBottom: '16px', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.18 }) }}>/ 07 — PRICING</span>
              <h2 style={{ margin: 0, ...display({ s: 40, lh: 1, c: C.bone }) }}>LISTING IS FREE.<br />WINNING ISN&apos;T.</h2>
            </span>
            <span style={{ marginLeft: 'auto', display: 'flex', border: `1px solid ${C.line}` }}>
              {([['mo', 'MONTHLY'], ['yr', 'YEARLY −20%']] as const).map(([k, label]) => (
                <span
                  key={k}
                  onClick={() => actions.setCycle(k)}
                  style={{ padding: '11px 16px', cursor: 'pointer', color: s.cycle === k ? C.ground : C.ink, background: s.cycle === k ? C.acid : 'transparent', ...mono({ w: 500, s: 9.5, ls: 0.14 }) }}
                >
                  {label}
                </span>
              ))}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '16px' }}>
            {PLANS.map((p) => (
              <Hoverable key={p.name} style={{ border: `1px solid ${p.border}`, background: p.bg, padding: '26px', display: 'flex', flexDirection: 'column', minHeight: '470px', transition: 'border-color 160ms linear' }} hover={{ borderColor: C.ink }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                  <span style={mono({ w: 700, s: 13, c: p.hue, ls: 0.16 })}>{p.name}</span>
                  {p.featured && (
                    <span style={{ background: C.acid, padding: '3px 7px', ...mono({ w: 700, s: 8, c: C.ground, ls: 0.14 }) }}>MOST TAKEN</span>
                  )}
                </span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={mono({ w: 700, s: 44, c: C.bone })}>{yr ? p.yearly : p.monthly}</span>
                  <span style={mono({ s: 11, c: C.grey })}>
                    {p.monthly === '$0' ? 'FOREVER' : yr ? '/ MO BILLED YEARLY' : '/ MONTH'}
                  </span>
                </span>
                <span style={{ marginTop: '14px', marginBottom: '22px', textWrap: 'pretty', ...text({ s: 13, lh: 1.65, c: C.ink }) }}>{p.body}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '24px' }}>
                  {p.feats.map((f) => (
                    <span key={f.label} style={{ display: 'flex', gap: '11px', alignItems: 'baseline' }}>
                      <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 9, c: f.on ? p.hue : C.greyDeepest }) }}>{f.on ? '✓' : '·'}</span>
                      <span style={text({ s: 12.5, lh: 1.55, c: f.on ? C.ink : C.greyDeepest })}>{f.label}</span>
                    </span>
                  ))}
                </span>
                <a href="/app" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: p.ctaBg, color: p.ctaColor, border: `1px solid ${p.ctaBorder}`, ...mono({ w: 700, s: 10, ls: 0.14 }) }}>
                  {p.cta} <span>→</span>
                </a>
              </Hoverable>
            ))}
          </div>
          <div style={{ marginTop: '16px', ...text({ s: 12, c: C.grey }) }}>
            Plans buy tooling, analytics and widget capacity. They never buy rank, Crown Points, Audience Score
            or prize eligibility.
          </div>
        </div>
      </Reveal>

      {/* ---- 08 FAQ -------------------------------------------------------- */}
      <Reveal rvKey="m8" o={rv('m8')} y={rvY('m8')}>
        <div style={WRAP}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '44px' }}>
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <span style={{ display: 'block', marginBottom: '16px', ...mono({ w: 700, s: 9, c: C.acid, ls: 0.18 }) }}>/ 08 — QUESTIONS</span>
              <h2 style={{ margin: '0 0 18px', ...display({ s: 34, lh: 1.05, c: C.bone }) }}>THE PARTS<br />PEOPLE ASK<br />ABOUT</h2>
              <p style={{ margin: 0, maxWidth: '34ch', ...text({ s: 13.5, lh: 1.7, c: C.grey }) }}>
                Full rules, scoring definitions and the promotional terms live on the public rules page.
              </p>
            </div>
            <div style={{ flex: '1 1 560px', minWidth: 0, borderTop: `1px solid ${C.line}` }}>
              {FAQ.map((q) => {
                const open = s.openFaq === q.key;
                return (
                  <div
                    key={q.key}
                    onClick={() => actions.toggleFaq(q.key)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={open}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); actions.toggleFaq(q.key); } }}
                    style={{ borderBottom: `1px solid ${C.line}`, padding: '22px 0', cursor: 'pointer' }}
                  >
                    <span style={{ display: 'flex', gap: '18px', alignItems: 'baseline' }}>
                      <span style={{ flex: '0 0 auto', ...mono({ w: 700, s: 11, c: open ? C.acid : C.grey }) }}>{open ? '—' : '+'}</span>
                      <span style={{ flex: '1 1 auto', ...mono({ w: 500, s: 14.5, c: C.bone, ls: 0.03 }) }}>{q.q}</span>
                    </span>
                    {open && (
                      <span style={{ display: 'block', margin: '14px 0 0 29px', maxWidth: '62ch', ...text({ s: 14, lh: 1.75, c: C.ink }) }}>{q.a}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---- Close --------------------------------------------------------- */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-340px', left: '50%', width: '900px', height: '900px', marginLeft: '-450px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(207,218,79,0.14) 0%, rgba(207,218,79,0) 62%)' }} />
        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto', padding: '96px 28px 40px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 22px', ...display({ s: 56, lh: 0.98, c: C.bone }) }}>THE THRONE IS<br />ALWAYS TAKEABLE</h2>
          <p style={{ margin: '0 auto 32px', maxWidth: '52ch', ...text({ s: 16, lh: 1.7, c: C.ink }) }}>
            Somebody is holding your market right now. The ask decays every minute they sit still.
          </p>
          <a href="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: C.acid, color: C.ground, padding: '18px 26px', ...mono({ w: 700, s: 11.5, ls: 0.16 }) }}>
            ENTER THE BOARD <span>→</span>
          </a>
        </div>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 28px 26px', overflow: 'hidden' }}>
          <div style={{ fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: 'clamp(60px,13.4vw,190px)', lineHeight: 0.82, color: '#111114', letterSpacing: '-0.02em', textAlign: 'center', whiteSpace: 'nowrap' }}>
            OUTRIVL
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.line}` }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 28px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
            <span style={mono({ s: 10, c: C.grey, ls: 0.12 })}>© 2026 OUTRIVL — COMPETE FOR ATTENTION</span>
            <span style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', gap: '22px' }}>
              {['RULES', 'STATUS', 'WIDGET SDK', 'PRESS'].map((l) => (
                <a key={l} href="#top" style={mono({ w: 500, s: 9.5, c: C.ink, ls: 0.14 })}>{l}</a>
              ))}
              <a href="/app" style={mono({ w: 500, s: 9.5, c: C.acid, ls: 0.14 })}>THE BOARD →</a>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/** One half of the dethronement scrubber. */
function ScrubPane({
  flex, opacity, rank, rankSize, nameSize, hue, badge, border, bg, glow, name, note,
}: {
  flex: string; opacity?: string; rank: string; rankSize: string; nameSize: string;
  hue: string; badge: string; border: string; bg: string; glow: string; name: string; note: string;
}) {
  return (
    <div style={{ flex, minWidth: 0, position: 'relative', overflow: 'hidden', border: `1px solid ${border}`, background: bg, padding: '20px', opacity, transition: 'flex 90ms linear, opacity 90ms linear' }}>
      <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: glow }} />
      <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{ lineHeight: 1, fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: rankSize, color: hue }}>{rank}</span>
        <span style={{ border: `1px solid ${border}`, padding: '3px 7px', whiteSpace: 'nowrap', ...mono({ w: 700, s: 8.5, c: hue, ls: 0.14 }) }}>{badge}</span>
      </span>
      <span style={{ position: 'relative', display: 'block', marginTop: '40px', fontFamily: "'Silkscreen', monospace", fontWeight: 700, fontSize: nameSize, color: C.bone }}>{name}</span>
      <span style={{ position: 'relative', display: 'block', marginTop: '12px', maxWidth: '34ch', ...text({ s: 12.5, lh: 1.6, c: C.ink }) }}>{note}</span>
    </div>
  );
}
