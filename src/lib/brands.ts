import type { Brand } from './types';
import { C } from './tokens';

/**
 * Advertiser brand palettes.
 *
 * Every listing renders in its owner's colour, type and corner radius — that is
 * the point of the market. If every widget looked like OUTRIVL, the ad would be
 * OUTRIVL's rather than the advertiser's, and the board would read as one
 * dashboard instead of eighteen companies competing on the same shelf.
 */
export const BRANDS: Record<string, Brand> = {
  sundial:   { bg: '#1B1206', ink: '#FFF3DE', dim: '#B79A6E', accent: '#F5A524', line: 'rgba(245,165,36,0.28)', font: "'Archivo', sans-serif", radius: '10px', label: 'Sundial' },
  superlist: { bg: '#07160F', ink: '#E8FBF1', dim: '#7BAF95', accent: '#35D98A', line: 'rgba(53,217,138,0.26)', font: "'Archivo', sans-serif", radius: '12px', label: 'Superlist' },
  dub:       { bg: '#05070E', ink: '#EAF1FF', dim: '#7086AC', accent: '#3B82F6', line: 'rgba(59,130,246,0.3)',  font: "'JetBrains Mono', monospace", radius: '2px', label: 'Dub' },
  raycast:   { bg: '#140708', ink: '#FFECEC', dim: '#B08286', accent: '#FF5C57', line: 'rgba(255,92,87,0.28)',  font: "'Archivo', sans-serif", radius: '8px', label: 'Raycast' },
  halfpipe:  { bg: '#140A1C', ink: '#F6ECFF', dim: '#A085BC', accent: '#C06BFF', line: 'rgba(192,107,255,0.3)', font: "'Archivo', sans-serif", radius: '16px', label: 'Halfpipe' },
  keystone:  { bg: '#0B0F14', ink: '#E6EDF5', dim: '#7C8B9C', accent: '#8FA6BF', line: 'rgba(143,166,191,0.26)', font: "'JetBrains Mono', monospace", radius: '2px', label: 'Keystone' },
  linear:    { bg: '#0A0B1A', ink: '#EDEEFF', dim: '#8288B8', accent: '#5E6AD2', line: 'rgba(94,106,210,0.32)', font: "'Archivo', sans-serif", radius: '6px', label: 'Linear' },
  framer:    { bg: '#03080F', ink: '#EAF4FF', dim: '#7396B5', accent: '#0FA5E9', line: 'rgba(15,165,233,0.3)',  font: "'Archivo', sans-serif", radius: '4px', label: 'Framer' },
  meridian:  { bg: '#0A1020', ink: '#EAF0FF', dim: '#7A8CAE', accent: '#FF7A59', line: 'rgba(255,122,89,0.28)', font: "'Archivo', sans-serif", radius: '8px', label: 'Meridian' },
  parabol:   { bg: '#08130E', ink: '#E9F7EF', dim: '#7DA48D', accent: '#4ADE80', line: 'rgba(74,222,128,0.26)', font: "'Archivo', sans-serif", radius: '10px', label: 'Parabol' },
  loom:      { bg: '#110A1B', ink: '#F2EBFF', dim: '#9C8AB8', accent: '#8B5CF6', line: 'rgba(139,92,246,0.3)',  font: "'Archivo', sans-serif", radius: '12px', label: 'Loom' },
  northwind: { bg: '#061116', ink: '#E6F6FB', dim: '#78A2AF', accent: '#22D3EE', line: 'rgba(34,211,238,0.26)', font: "'JetBrains Mono', monospace", radius: '3px', label: 'Northwind' },
  acme:      { bg: '#150607', ink: '#FFEDEE', dim: '#B98287', accent: '#E11D48', line: 'rgba(225,29,72,0.3)',   font: "'Archivo', sans-serif", radius: '4px', label: 'Acme' },
  lumen:     { bg: '#05130F', ink: '#E9F8F2', dim: '#7BA898', accent: '#D4B254', line: 'rgba(212,178,84,0.3)',  font: "'Archivo', sans-serif", radius: '2px', label: 'Lumen' },
  quanta:    { bg: '#0A0D05', ink: '#F1FBDF', dim: '#9AAF77', accent: '#A3E635', line: 'rgba(163,230,53,0.28)', font: "'JetBrains Mono', monospace", radius: '2px', label: 'Quanta' },
  orbital:   { bg: '#160C04', ink: '#FFF0E2', dim: '#B8916D', accent: '#FB923C', line: 'rgba(251,146,60,0.3)',  font: "'Archivo', sans-serif", radius: '14px', label: 'Orbital' },
  vercel:    { bg: '#08080A', ink: '#FFFFFF', dim: '#8A8A8F', accent: '#FFFFFF', line: 'rgba(255,255,255,0.2)', font: "'Archivo', sans-serif", radius: '6px', label: 'Vercel' },
  notion:    { bg: '#121110', ink: '#F5F3EF', dim: '#9A948B', accent: '#E9E0C4', line: 'rgba(233,224,196,0.22)', font: "'Archivo', sans-serif", radius: '4px', label: 'Notion' },
};

function hx(h: string): [number, number, number] {
  const s = h.replace('#', '');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

/** Linear channel blend between two hex colours. */
export function mix(a: string, b: string, t: number): string {
  const A = hx(a);
  const B = hx(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/**
 * Resolve an advertiser's palette.
 *
 * With auto-tone on, the surface is pulled toward the board so the market reads
 * as one screen. It is opt-in and never forced: an advertiser's brand is theirs,
 * and flattening it by default would defeat the purpose of the widget.
 */
export function brand(id: string, autoTone: boolean): Brand {
  const b = BRANDS[id] ?? BRANDS.keystone;
  if (!autoTone) return b;
  return {
    ...b,
    bg: mix(b.bg, C.ground, 0.62),
    ink: mix(b.ink, C.bone, 0.55),
    dim: mix(b.dim, C.ink, 0.6),
    accent: mix(b.accent, C.ink, 0.34),
    line: 'rgba(233,224,196,0.16)',
  };
}

/** A card ground one step lifted off the advertiser's own background. */
export function cardBg(b: Brand): string {
  return mix(b.bg, b.ink, 0.06);
}
