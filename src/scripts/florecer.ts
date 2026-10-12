/**
 * A wall of cempasúchil that blooms over the screen and then opens, shedding
 * its petals, to reveal what is behind. Driven by a single progress value, so
 * it plays backward when the visitor scrolls back.
 *
 *  bloom 0 → 1: heads pop open from the center outward until they cover the screen
 *  open  0 → 1: from the center outward, each head lets go of its petals and fades
 *
 * The flowers and petals are the painted ones cut from the cempasúchil sheet
 * (scripts/cempasuchil-piezas.mjs); the code-drawn heads stand in until they load.
 */
import { marigold, LOOSE_PETALS, EDGE } from './marigold';
import piezas from './cempasuchil.json';

const load = (src: string) => {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return img;
};
// Painted heads seen from above, and loose petals
const PAINTED_HEADS = [...piezas.flor, ...piezas.florcita].map((p) => load(p.src));
const PAINTED_PETALS = piezas.petalo.map((p) => load(p.src));
const ready = (img: HTMLImageElement) => img.complete && img.naturalWidth > 0;

const PETAL_TONES = ['#f7a21b', '#ef8817', '#dc6410', '#ffb23f', '#fbb12b'];

function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The nine flower heads, painted once at a good size and reused as sprites */
function sprites(size: number) {
  return [0, 1, 2].flatMap((shape) =>
    [0, 1, 2].map((tone) => {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const g = c.getContext('2d')!;
      g.translate(size / 2, size / 2);
      // A soft shadow under the head, baked in: each flower sits on the ones behind it
      const shade = g.createRadialGradient(size * 0.03, size * 0.06, size * 0.3, size * 0.03, size * 0.06, size * 0.5);
      shade.addColorStop(0, 'rgba(40, 12, 4, 0.55)');
      shade.addColorStop(1, 'rgba(40, 12, 4, 0)');
      g.fillStyle = shade;
      g.fillRect(-size / 2, -size / 2, size, size);
      g.scale(size / 2.2, size / 2.2);
      g.lineWidth = EDGE;
      g.lineJoin = 'round';
      for (const l of marigold(shape, tone)) {
        const path = new Path2D(l.d);
        g.globalAlpha = l.opacity ?? 1;
        g.fillStyle = l.fill;
        g.fill(path);
        if (l.stroke) {
          g.strokeStyle = l.stroke;
          g.stroke(path);
        }
      }
      return c;
    }),
  );
}

interface Head { x: number; y: number; r: number; sprite: number; painted: number; spin: number; d: number; a: number }
interface Petal { head: number; angle: number; speed: number; size: number; spin: number; shape: number; painted: number; tone: string }

const ease = (x: number) => 1 - Math.pow(1 - x, 3);
// Overshoots a little before settling: the pop of a flower opening
const pop = (x: number) => {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function florecer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const heads9 = sprites(384);
  // A soft shadow under each painted head, so the carpet has depth
  const shadow = document.createElement('canvas');
  shadow.width = shadow.height = 128;
  {
    const g = shadow.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 20, 64, 64, 64);
    grad.addColorStop(0, 'rgba(40, 12, 4, 0.6)');
    grad.addColorStop(1, 'rgba(40, 12, 4, 0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  const petalPaths = LOOSE_PETALS.map((d) => new Path2D(d));
  let heads: Head[] = [];
  let petals: Petal[] = [];
  let w = 0;
  let h = 0;
  let dpr = 1;

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const rand = random(1031);
    // A loose grid, jittered, so the heads overlap into one carpet of flowers
    const step = Math.max(60, Math.min(w, h) / 7.5);
    const cx = w / 2;
    const cy = h / 2;
    const far = Math.hypot(cx, cy);
    heads = [];
    for (let y = -step * 0.4; y < h + step; y += step * 0.78) {
      for (let x = -step * 0.4; x < w + step; x += step * 0.86) {
        const hx = x + (rand() - 0.5) * step * 0.5;
        const hy = y + (rand() - 0.5) * step * 0.5;
        heads.push({
          x: hx,
          y: hy,
          r: step * (0.5 + rand() * 0.18),
          sprite: Math.floor(rand() * 9),
          painted: Math.floor(rand() * PAINTED_HEADS.length),
          spin: (rand() - 0.5) * 1.2,
          d: Math.hypot(hx - cx, hy - cy) / far,
          a: Math.atan2(hy - cy, hx - cx),
        });
      }
    }
    // Drawn from the outside in, so the center blooms on top
    heads.sort((a, b) => b.d - a.d);
    petals = [];
    heads.forEach((_, i) => {
      for (let k = 0; k < 7; k++) {
        petals.push({
          head: i,
          angle: rand() * Math.PI * 2,
          speed: 0.6 + rand() * 0.9,
          size: step * (0.13 + rand() * 0.09),
          spin: (rand() - 0.5) * 8,
          shape: Math.floor(rand() * petalPaths.length),
          painted: Math.floor(rand() * PAINTED_PETALS.length),
          tone: PETAL_TONES[Math.floor(rand() * PETAL_TONES.length)],
        });
      }
    });
  }

  function draw(bloom: number, open: number) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bloom <= 0 || open >= 1) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const reach = Math.hypot(w, h) * 0.6;

    // Heads: each blooms on its own beat, center first, and opens on its own beat too
    const state = heads.map((hd) => {
      const g = clamp((bloom - hd.d * 0.55) / 0.45);
      const o = clamp((open - hd.d * 0.5) / 0.5);
      return { g, o };
    });

    heads.forEach((hd, i) => {
      const { g, o } = state[i];
      const gone = ease(Math.min(1, o * 1.6));
      if (g <= 0 || gone >= 1) return;
      // Opening: the head lets go of its petals, shrinking and turning away
      const r = hd.r * pop(g) * (1 - 0.7 * gone);
      const drift = gone * reach * 0.08;
      ctx.save();
      ctx.globalAlpha = Math.min(1, g * 3) * (1 - gone);
      ctx.translate(hd.x + Math.cos(hd.a) * drift, hd.y + Math.sin(hd.a) * drift);
      ctx.rotate(hd.spin + (1 - g) * -1.2 + gone * 2.4);
      const img = PAINTED_HEADS[hd.painted];
      if (img && ready(img)) {
        ctx.drawImage(shadow, -r * 1.05 + r * 0.08, -r * 1.05 + r * 0.12, r * 2.1, r * 2.1);
        const k = (r * 2) / Math.max(img.naturalWidth, img.naturalHeight);
        ctx.drawImage(img, (-img.naturalWidth * k) / 2, (-img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k);
      } else {
        ctx.drawImage(heads9[hd.sprite], -r * 1.1, -r * 1.1, r * 2.2, r * 2.2);
      }
      ctx.restore();
    });

    // Its petals fly outward from the center, over everything
    for (const pt of petals) {
      const hd = heads[pt.head];
      const o = state[pt.head].o;
      if (o <= 0 || o >= 1) continue;
      const e = ease(o);
      const dir = hd.a * 0.7 + pt.angle * 0.3;
      const x = hd.x + Math.cos(dir) * reach * 0.35 * e * pt.speed;
      const y = hd.y + Math.sin(dir) * reach * 0.35 * e * pt.speed + e * e * 40;
      ctx.save();
      ctx.globalAlpha = 1 - o;
      ctx.translate(x, y);
      ctx.rotate(pt.angle + pt.spin * e);
      const flip = 0.5 + 0.5 * Math.abs(Math.cos(e * 6 + pt.angle));
      const img = PAINTED_PETALS[pt.painted];
      if (img && ready(img)) {
        const k = (pt.size * 2.4) / Math.max(img.naturalWidth, img.naturalHeight);
        ctx.scale(1, flip);
        ctx.drawImage(img, (-img.naturalWidth * k) / 2, (-img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k);
      } else {
        ctx.scale(pt.size * 2, pt.size * 2 * flip);
        ctx.fillStyle = pt.tone;
        ctx.fill(petalPaths[pt.shape]);
      }
      ctx.restore();
    }

  }

  layout();
  return { layout, draw };
}
