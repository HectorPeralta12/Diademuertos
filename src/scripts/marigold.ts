/**
 * One cempasúchil, drawn the same way everywhere: in the SVG (arch, vases, pots)
 * as a <symbol>, and on the canvas (the path) as cached Path2D layers.
 *
 * A flower is a few rings of small ruffled petals, the outer ones longer and
 * darker, packed tighter toward a dense center, over a scalloped backing that
 * closes the gaps. Every layer is one SVG path string in a unit circle (radius 1),
 * so it renders identically in both places and scales to any size.
 */

export type Layer = { d: string; fill: string; stroke?: string; opacity?: number };

// Three tones of the same species: golden, orange and deep orange
export const TONES = [
  { deep: '#c4650a', base: '#f7a21b', alt: '#fbb12b', light: '#ffc94d', core: '#a84b04', line: 'rgba(169, 80, 10, 0.6)' },
  { deep: '#b4500b', base: '#ef8817', alt: '#f59a22', light: '#ffb23f', core: '#8f3a03', line: 'rgba(154, 66, 8, 0.6)' },
  { deep: '#963606', base: '#dc6410', alt: '#e8780c', light: '#f5932f', core: '#742a02', line: 'rgba(127, 46, 4, 0.6)' },
];

function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v: number) => +v.toFixed(3);

// One ruffled petal in its own frame: base at the origin, tip at +x.
// Narrow at the base, widening into a frilled edge of three soft scallops.
function petal(len: number, wid: number, a: number, bx: number, by: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const P = (u: number, v: number) => `${n(bx + u * c - v * s)} ${n(by + u * s + v * c)}`;
  const w = wid / 2;
  return (
    `M${P(0, -w * 0.3)}` +
    `C${P(len * 0.35, -w * 0.55)} ${P(len * 0.6, -w * 1.05)} ${P(len * 0.86, -w)}` +
    `Q${P(len * 1.04, -w * 0.82)} ${P(len * 0.95, -w * 0.38)}` +
    `Q${P(len * 1.08, -w * 0.1)} ${P(len * 0.97, w * 0.22)}` +
    `Q${P(len * 1.04, w * 0.72)} ${P(len * 0.86, w)}` +
    `C${P(len * 0.6, w * 1.05)} ${P(len * 0.35, w * 0.55)} ${P(0, w * 0.3)}Z`
  );
}

/**
 * Layers of one flower, back to front. `shape` changes the petal arrangement,
 * `tone` the color (0 golden, 1 orange, 2 deep orange).
 */
export function marigold(shape: number, tone: number): Layer[] {
  const r = random(97 + shape * 31);
  const T = TONES[tone % TONES.length];
  const layers: Layer[] = [];

  // Scalloped backing, a little irregular, so the silhouette is never a perfect circle
  const bumps = 17;
  let back = '';
  for (let i = 0; i <= bumps; i++) {
    const a = (i / bumps) * Math.PI * 2;
    const peak = a - Math.PI / bumps;
    const rp = 0.97 + (r() - 0.5) * 0.08;
    const pt = (rr: number, aa: number) => `${n(Math.cos(aa) * rr)} ${n(Math.sin(aa) * rr)}`;
    back += i === 0 ? `M${pt(0.86, a)}` : `Q${pt(rp * 1.06, peak)} ${pt(0.86, a)}`;
  }
  layers.push({ d: back + 'Z', fill: T.deep });

  // Rings of petals, outside in: each is drawn over the last, so they overlap like a real head
  const rings = [
    { R: 0.98, count: 15, len: 0.44, wid: 0.36, fill: [T.base, T.alt] },
    { R: 0.8, count: 13, len: 0.4, wid: 0.34, fill: [T.alt, T.base] },
    { R: 0.6, count: 11, len: 0.36, wid: 0.32, fill: [T.base, T.light] },
    { R: 0.4, count: 8, len: 0.3, wid: 0.3, fill: [T.light, T.alt] },
  ];
  rings.forEach((ring, k) => {
    const turn = r() * Math.PI * 2;
    const paths = ['', ''];
    for (let i = 0; i < ring.count; i++) {
      const a = turn + ((i + (k % 2) * 0.5) / ring.count) * Math.PI * 2 + (r() - 0.5) * 0.18;
      const R = ring.R * (0.95 + r() * 0.08);
      const len = ring.len * (0.88 + r() * 0.24);
      const base = R - len;
      // Petals tilt a little, like a ruffled head, never all pointing straight out
      const tilt = (r() - 0.5) * 0.5;
      paths[i % 2] += petal(len, ring.wid * (0.9 + r() * 0.2), a + tilt, Math.cos(a) * base, Math.sin(a) * base);
    }
    paths.forEach((d, j) => layers.push({ d, fill: ring.fill[j], stroke: T.line }));
  });

  // The dense heart: tiny folded florets
  let heart = '';
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + r();
    const rr = i === 0 ? 0 : 0.1;
    const x = i === 0 ? 0 : Math.cos(a) * rr;
    const y = i === 0 ? 0 : Math.sin(a) * rr;
    const s = 0.07 + r() * 0.03;
    heart += `M${n(x - s)} ${n(y)}a${n(s)} ${n(s)} 0 1 0 ${n(s * 2)} 0a${n(s)} ${n(s)} 0 1 0 ${n(-s * 2)} 0Z`;
  }
  layers.push({ d: heart, fill: T.core, opacity: 0.85 });

  // Volume: the lower side of the head turns away from the light
  layers.push({ d: 'M-0.88 0.05A0.88 0.88 0 0 0 0.88 0.05A0.95 0.95 0 0 1 -0.88 0.05Z', fill: '#3a1200', opacity: 0.16 });

  return layers;
}

// Line width of the petal edges, in the unit circle
export const EDGE = 0.026;

// A loose petal for the path: a rounded heel that widens into a frilled tip; unit length along +x
export const LOOSE_PETALS = [
  'M-0.5 -0.04C-0.5 -0.22 -0.2 -0.38 0.18 -0.42Q0.44 -0.44 0.46 -0.24Q0.6 -0.08 0.5 0.06Q0.58 0.26 0.4 0.36Q0.28 0.46 0.12 0.4C-0.22 0.34 -0.5 0.16 -0.5 -0.04Z',
  'M-0.5 0C-0.48 -0.2 -0.22 -0.34 0.14 -0.4Q0.42 -0.42 0.48 -0.2Q0.56 0 0.48 0.16Q0.46 0.36 0.24 0.4C-0.1 0.42 -0.5 0.2 -0.5 0Z',
  'M-0.5 0.02C-0.52 -0.16 -0.26 -0.36 0.12 -0.42Q0.32 -0.46 0.42 -0.32Q0.58 -0.2 0.52 -0.04Q0.6 0.12 0.5 0.24Q0.42 0.42 0.2 0.4C-0.14 0.38 -0.48 0.22 -0.5 0.02Z',
];
// A soft crease down the middle, the only inner detail it needs
export const PETAL_CREASE = 'M-0.38 0.02Q0 -0.04 0.36 0.02';
