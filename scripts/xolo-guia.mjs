/**
 * The guide: three walking poses from the character sheet, cut from the cream
 * paper and turned into the same golden spirit the Xolo becomes in the
 * crossing (gold light, shaded by the drawing itself).
 *
 * Frames share one canvas, aligned on the paws and on the body's center of
 * mass, so swapping them reads as steps and not as jumps.
 *
 * Also the Xolo sitting with its back to us, for when it reaches the altar,
 * at the same scale as the walking frames.
 *
 * Run: node scripts/xolo-guia.mjs
 * Out: public/images/guia/paso-1.webp … paso-3.webp, sentado.webp
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const SHEET = fileURLToPath(new URL('assets/xolo/upscaled_poses.webp', root));
const OUT = new URL('public/images/guia/', root);

// Second row of the sheet (6144 × 4096): the first three dogs, walking left
const FRAMES = [
  { left: 0, width: 1180 },
  { left: 960, width: 1240 },
  { left: 1960, width: 1260 },
].map((f) => ({ ...f, top: 1660, height: 1080 }));
// First row, fourth dog: sitting, seen from behind
const SEATED = { left: 2720, top: 100, width: 600, height: 1460 };

// Final height of every frame, in pixels (shown at about half for sharp screens)
const HEIGHT = 320;

function hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return [max ? (max - min) / max : 0, max];
}

async function cut(f) {
  const { data, info } = await sharp(SHEET).extract(f).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const N = W * H;

  // Dog: darker than the paper, or saturated (the red inside the ears).
  // The soft shadows under the paws are light and grey, so they stay paper.
  let dog = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const [s, v] = hsv(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
    dog[i] = v < 0.62 || (s > 0.38 && v < 0.92) ? 1 : 0;
  }
  dog = largest(dog, W, H);
  dog = fillHoles(dog, W, H, 4000);

  // Bounding box and center of mass
  let x0 = W, y0 = H, x1 = 0, y1 = 0, cx = 0, count = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (dog[y * W + x]) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        cx += x; count++;
      }
  return { data, dog, W, H, box: { x0, y0, x1, y1 }, cx: cx / count };
}

const cuts = [];
for (const f of FRAMES) cuts.push(await cut(f));

// One canvas for all: tallest dog sets the scale, paws on the bottom edge,
// centers of mass on the same vertical line
const tallest = Math.max(...cuts.map((c) => c.box.y1 - c.box.y0 + 1));
const scale = HEIGHT / tallest;
const leftReach = Math.max(...cuts.map((c) => c.cx - c.box.x0));
const rightReach = Math.max(...cuts.map((c) => c.box.x1 - c.cx));
const CW = Math.ceil((leftReach + rightReach) * scale) + 8;
const CH = HEIGHT + 8;

await mkdir(OUT, { recursive: true });

// The cut dog as golden light, scaled to the shared size
async function spirit(c) {
  const { data, dog, W, box } = c;
  // Full resolution spirit, then scaled down once
  const bw = box.x1 - box.x0 + 1;
  const bh = box.y1 - box.y0 + 1;
  const out = Buffer.alloc(bw * bh * 4);
  const mx = bw * 0.45;
  const my = bh * 0.55;
  const reach = Math.hypot(bw, bh) * 0.55;
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      const i = (y + box.y0) * W + (x + box.x0);
      const o = (y * bw + x) * 4;
      if (!dog[i]) continue;
      const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
      // The drawing's light and shade, brightened like the crossing's relief
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const shade = Math.min(1, lum * 2 + 0.1);
      // Gold light: pale at the heart, deep marigold at the edges
      const t = Math.min(1, Math.hypot(x - mx, y - my) / reach);
      const gold = mix([[255, 228, 150], [255, 196, 88], [240, 146, 30]], t);
      out[o] = gold[0] * shade;
      out[o + 1] = gold[1] * shade;
      out[o + 2] = gold[2] * shade;
      out[o + 3] = 255;
    }
  const tw = Math.round(bw * scale);
  const th = Math.round(bh * scale);
  return { input: await sharp(out, { raw: { width: bw, height: bh, channels: 4 } }).resize(tw, th).png().toBuffer(), tw, th };
}

for (const [n, c] of cuts.entries()) {
  const { box } = c;
  const { input: scaled, th } = await spirit(c);
  const left = Math.round((leftReach - (c.cx - box.x0)) * scale) + 4;
  const top = CH - 4 - th;
  await sharp({ create: { width: CW, height: CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: scaled, left, top }])
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(fileURLToPath(new URL(`paso-${n + 1}.webp`, OUT)));
}
console.log(`3 frames, ${CW} × ${CH}`);

{
  const { input, tw, th } = await spirit(await cut(SEATED));
  await sharp({ create: { width: tw + 8, height: th + 8, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input, left: 4, top: 4 }])
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(fileURLToPath(new URL('sentado.webp', OUT)));
  console.log(`sitting, ${tw + 8} × ${th + 8}`);
}

// ---------- helpers ----------

function mix(stops, t) {
  const seg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)));
  const k = t * (stops.length - 1) - seg;
  return stops[seg].map((v, i) => v + (stops[seg + 1][i] - v) * k);
}

function components(src, W, H, target) {
  const N = W * H;
  const label = new Int32Array(N).fill(-1);
  const sizes = [];
  const stack = [];
  for (let i = 0; i < N; i++) {
    if (src[i] !== target || label[i] !== -1) continue;
    const id = sizes.length;
    let size = 0;
    stack.push(i);
    label[i] = id;
    while (stack.length) {
      const j = stack.pop();
      size++;
      const x = j % W;
      const y = (j / W) | 0;
      if (x + 1 < W) visit(j + 1);
      if (x > 0) visit(j - 1);
      if (y + 1 < H) visit(j + W);
      if (y > 0) visit(j - W);
    }
    sizes.push(size);
    function visit(k) {
      if (src[k] === target && label[k] === -1) {
        label[k] = id;
        stack.push(k);
      }
    }
  }
  return { label, sizes };
}

function largest(src, W, H) {
  const { label, sizes } = components(src, W, H, 1);
  const best = sizes.indexOf(Math.max(...sizes));
  const out = new Uint8Array(W * H);
  for (let i = 0; i < out.length; i++) out[i] = label[i] === best ? 1 : 0;
  return out;
}

function fillHoles(src, W, H, maxArea) {
  const { label, sizes } = components(src, W, H, 0);
  const touches = new Set();
  for (let x = 0; x < W; x++) touches.add(label[x]).add(label[(H - 1) * W + x]);
  for (let y = 0; y < H; y++) touches.add(label[y * W]).add(label[y * W + W - 1]);
  const out = src.slice();
  for (let i = 0; i < out.length; i++) if (!src[i] && !touches.has(label[i]) && sizes[label[i]] <= maxArea) out[i] = 1;
  return out;
}
