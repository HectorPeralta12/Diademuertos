/**
 * Cuts painted pieces out of the elements sheet (assets/altar/elementos_dia.webp),
 * which is painted over a flat navy ground.
 *
 * Each pixel's distance to the navy decides its alpha, with a soft ramp so
 * edges stay painterly. Edge pixels are then "unmixed": the navy that bled into
 * them is taken out, so pieces carry no blue halo onto other skies. Only the
 * pieces' connected body is kept (specks of the ground are dropped).
 *
 * Run: node scripts/kit-recorte.mjs [name …]   (no names: every piece)
 * Out: public/images/kit/<name>.webp
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const SHEET = fileURLToPath(new URL('assets/altar/elementos_dia.webp', root));
const OUT = new URL('public/images/kit/', root);

// The painted ground, and how far from it a color must be to count as the piece
const NAVY = [6, 23, 60];
const NEAR = 34; // closer than this: ground
const FAR = 70; // farther than this: fully the piece

// Pieces on the sheet (6144 × 4096): crop box and final width in pixels
export const PIECES = {
  farol: { left: 1430, top: 2140, width: 320, height: 640, out: 220 },
  enredadera: { left: 900, top: 440, width: 400, height: 1120, out: 300 },
};

const names = process.argv.slice(2);
await mkdir(OUT, { recursive: true });

for (const [name, p] of Object.entries(PIECES)) {
  if (names.length && !names.includes(name)) continue;
  const { data, info } = await sharp(SHEET).extract(p).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const N = W * H;

  const alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const d = Math.hypot(data[i * 3] - NAVY[0], data[i * 3 + 1] - NAVY[1], data[i * 3 + 2] - NAVY[2]);
    alpha[i] = Math.min(1, Math.max(0, (d - NEAR) / (FAR - NEAR)));
  }

  // Keep the body: pixels connected (through any visible pixel) to the biggest piece
  const solid = new Uint8Array(N);
  for (let i = 0; i < N; i++) solid[i] = alpha[i] > 0.02 ? 1 : 0;
  const keep = largestPieces(solid, W, H, 0.04);

  const out = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) {
    const a = keep[i] ? alpha[i] : 0;
    out[i * 4 + 3] = Math.round(a * 255);
    if (a <= 0) continue;
    // Unmix the ground: c = a·piece + (1 − a)·navy
    for (let c = 0; c < 3; c++) {
      const v = (data[i * 3 + c] - (1 - a) * NAVY[c]) / a;
      out[i * 4 + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }

  const file = fileURLToPath(new URL(`${name}.webp`, OUT));
  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ width: p.out })
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(file);
  console.log(name, '→', file.split('/public')[1]);
}

/** Connected pieces at least `share` of the biggest one */
function largestPieces(src, W, H, share) {
  const label = new Int32Array(W * H).fill(-1);
  const sizes = [];
  const stack = [];
  for (let i = 0; i < src.length; i++) {
    if (!src[i] || label[i] !== -1) continue;
    const id = sizes.length;
    let size = 0;
    stack.push(i);
    label[i] = id;
    while (stack.length) {
      const j = stack.pop();
      size++;
      const x = j % W;
      const y = (j / W) | 0;
      for (const k of [x + 1 < W ? j + 1 : -1, x > 0 ? j - 1 : -1, y + 1 < H ? j + W : -1, y > 0 ? j - W : -1]) {
        if (k >= 0 && src[k] && label[k] === -1) {
          label[k] = id;
          stack.push(k);
        }
      }
    }
    sizes.push(size);
  }
  const max = Math.max(0, ...sizes);
  const out = new Uint8Array(src.length);
  for (let i = 0; i < src.length; i++) out[i] = label[i] >= 0 && sizes[label[i]] >= max * share ? 1 : 0;
  return out;
}
