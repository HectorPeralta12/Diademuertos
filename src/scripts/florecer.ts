/**
 * A gust of cempasúchil: a few loose flowers ride the wind into the frame with a
 * swirl of petals, settle for a breath, then open and shed their petals outward
 * to reveal what is behind. Driven by progress values, so it plays backward
 * when the visitor scrolls back.
 *
 *  bloom 0 → 1: the gust blows in; flowers drift to their places, petals stream across
 *  open  0 → 1: from the center outward, each flower lets go of its petals and fades
 *  dark  0 → 1: the night closes in for a moment to hide the hand over between two paintings
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

interface Head { x: number; y: number; r: number; sprite: number; painted: number; spin: number; d: number; a: number; fromX: number; fromY: number; delay: number }
interface Gust { y: number; amp: number; freq: number; speed: number; size: number; spin: number; painted: number; shape: number; tone: string; delay: number }
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
  let gust: Gust[] = [];
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
    // A few loose flowers, one per cell of a coarse grid, never packed together
    const base = Math.min(w, h);
    const cols = w > h ? 5 : 3;
    const rows = w > h ? 3 : 5;
    const cx = w / 2;
    const cy = h / 2;
    const far = Math.hypot(cx, cy);
    heads = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() < 0.4) continue;
        const hx = ((c + 0.2 + rand() * 0.6) / cols) * w;
        const hy = ((r + 0.2 + rand() * 0.6) / rows) * h;
        heads.push({
          x: hx,
          y: hy,
          r: base * (0.07 + rand() * 0.09),
          sprite: Math.floor(rand() * 9),
          painted: Math.floor(rand() * PAINTED_HEADS.length),
          spin: (rand() - 0.5) * 1.2,
          d: Math.hypot(hx - cx, hy - cy) / far,
          a: Math.atan2(hy - cy, hx - cx),
          // They ride in on the wind, from the left and a little from below
          fromX: -base * (0.3 + rand() * 0.6),
          fromY: hy + base * (0.1 + rand() * 0.3),
          delay: rand() * 0.35,
        });
      }
    }
    // Drawn from the outside in, so the center blooms on top
    heads.sort((a, b) => b.d - a.d);
    petals = [];
    heads.forEach((_, i) => {
      for (let k = 0; k < 14; k++) {
        petals.push({
          head: i,
          angle: rand() * Math.PI * 2,
          speed: 0.6 + rand() * 0.9,
          size: heads[i].r * (0.22 + rand() * 0.16),
          spin: (rand() - 0.5) * 8,
          shape: Math.floor(rand() * petalPaths.length),
          painted: Math.floor(rand() * PAINTED_PETALS.length),
          tone: PETAL_TONES[Math.floor(rand() * PETAL_TONES.length)],
        });
      }
    });
    // The swirl of petals the wind carries across the screen
    gust = Array.from({ length: w > h ? 150 : 90 }, () => ({
      y: rand() * h,
      amp: base * (0.04 + rand() * 0.12),
      freq: 1 + rand() * 2.5,
      speed: 1.3 + rand() * 0.9,
      size: base * (0.012 + rand() * 0.02),
      spin: (rand() - 0.5) * 10,
      painted: Math.floor(rand() * PAINTED_PETALS.length),
      shape: Math.floor(rand() * petalPaths.length),
      tone: PETAL_TONES[Math.floor(rand() * PETAL_TONES.length)],
      delay: rand() * 0.5,
    }));
  }

  function petal(x: number, y: number, size: number, angle: number, flip: number, painted: number, shape: number, tone: string, alpha: number) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    const img = PAINTED_PETALS[painted];
    if (img && ready(img)) {
      const k = (size * 2.4) / Math.max(img.naturalWidth, img.naturalHeight);
      ctx.scale(1, flip);
      ctx.drawImage(img, (-img.naturalWidth * k) / 2, (-img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k);
    } else {
      ctx.scale(size * 2, size * 2 * flip);
      ctx.fillStyle = tone;
      ctx.fill(petalPaths[shape]);
    }
    ctx.restore();
  }

  function draw(bloom: number, open: number, dark = 0) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if ((bloom <= 0 || open >= 1) && dark <= 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const reach = Math.hypot(w, h) * 0.6;

    // The night closes in for a moment while one painting gives way to the other,
    // darker at the edges, so the flowers and petals glow against it
    if (dark > 0) {
      const g = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.hypot(w, h) * 0.6);
      g.addColorStop(0, `rgba(16, 13, 52, ${0.72 * dark})`);
      g.addColorStop(1, `rgba(8, 6, 28, ${0.92 * dark})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    if (bloom <= 0 || open >= 1) return;

    // The swirl: petals stream across on the wind, and blow off the screen as the flowers open
    for (const gp of gust) {
      const k = clamp((bloom - gp.delay * 0.5) / 0.6) + open * 1.2 * gp.speed;
      if (k <= 0) continue;
      const x = -40 + k * gp.speed * (w + 80);
      if (x > w + 40) continue;
      const y = gp.y + Math.sin(k * gp.freq * Math.PI * 2) * gp.amp - k * h * 0.08;
      const flip = 0.4 + 0.6 * Math.abs(Math.cos(k * gp.freq * 5));
      petal(x, y, gp.size, gp.spin * k, flip, gp.painted, gp.shape, gp.tone, Math.min(1, k * 4));
    }

    // Flowers: each rides the wind in on its own beat, and opens from the center outward
    const state = heads.map((hd) => {
      const g = clamp((bloom - hd.delay) / 0.55);
      const o = clamp((open - hd.d * 0.5) / 0.5);
      return { g, o };
    });

    heads.forEach((hd, i) => {
      const { g, o } = state[i];
      const gone = ease(Math.min(1, o * 1.6));
      if (g <= 0 || gone >= 1) return;
      // Opening: the head lets go of its petals, shrinking and turning away
      const r = hd.r * (0.6 + 0.4 * pop(g)) * (1 - 0.7 * gone);
      const drift = gone * reach * 0.08;
      // In on a curve: fast at first, settling gently into place
      const e = ease(g);
      const x = hd.fromX + (hd.x - hd.fromX) * e;
      const y = hd.fromY + (hd.y - hd.fromY) * e - Math.sin(e * Math.PI) * hd.r * 1.2;
      ctx.save();
      ctx.globalAlpha = Math.min(1, g * 3) * (1 - gone);
      ctx.translate(x + Math.cos(hd.a) * drift, y + Math.sin(hd.a) * drift);
      ctx.rotate(hd.spin + (1 - e) * -3 + gone * 2.4);
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
      petal(x, y, pt.size, pt.angle + pt.spin * e, 0.5 + 0.5 * Math.abs(Math.cos(e * 6 + pt.angle)), pt.painted, pt.shape, pt.tone, 1 - o);
    }
  }

  layout();
  return { layout, draw };
}
