/**
 * Cuts every piece out of the painted cempasúchil sheet
 * (assets/elementos-ia/cempasuchil_elements.webp): flower heads, small
 * flowers, buds, loose petals and leaves, painted over a flat navy ground.
 *
 * The ground is keyed out by color distance with a soft edge and "unmixed"
 * from the edge pixels (no navy halo). Pieces are found on their own as
 * connected shapes and sorted by what they look like:
 *   flor     big round heads, seen from above
 *   florcita small round heads
 *   petalo   single loose petals
 *   hoja     green leaves
 *   monton   little piles of petals
 *   otro     buds and flowers seen from the side, with their stems
 *
 * Run: node scripts/cempasuchil-piezas.mjs
 * Out: public/images/cempasuchil/<kind>-<n>.webp and src/scripts/cempasuchil.json
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const SHEET = fileURLToPath(new URL('assets/elementos-ia/cempasuchil_elements.webp', root));
const OUT = new URL('public/images/cempasuchil/', root);
const MANIFEST = fileURLToPath(new URL('src/scripts/cempasuchil.json', root));

const NAVY = [8, 24, 56];
const NEAR = 40;
const FAR = 95;
// Work at half the sheet's size: plenty for sprites, four times faster
const SCALE = 0.5;
// Largest side of each saved piece, by kind
const SIZE = { flor: 320, florcita: 200, petalo: 120, hoja: 220, monton: 220, otro: 220 };

const { data, info } = await sharp(SHEET)
  .resize({ width: Math.round(6144 * SCALE) })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const N = W * H;

const alpha = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const d = Math.hypot(data[i * 3] - NAVY[0], data[i * 3 + 1] - NAVY[1], data[i * 3 + 2] - NAVY[2]);
  alpha[i] = Math.min(1, Math.max(0, (d - NEAR) / (FAR - NEAR)));
}

// Connected pieces (8-neighbors) of clearly visible pixels
const label = new Int32Array(N).fill(-1);
const pieces = [];
const stack = [];
for (let i = 0; i < N; i++) {
  if (alpha[i] < 0.3 || label[i] !== -1) continue;
  const id = pieces.length;
  let x0 = W, y0 = H, x1 = 0, y1 = 0, area = 0, r = 0, g = 0, b = 0, edge = 0, green = 0, white = 0;
  stack.push(i);
  label[i] = id;
  while (stack.length) {
    const j = stack.pop();
    const x = j % W;
    const y = (j / W) | 0;
    area++;
    const pr = data[j * 3], pg = data[j * 3 + 1], pb = data[j * 3 + 2];
    r += pr; g += pg; b += pb;
    if (pg > pr * 0.95) green++;
    const mx = Math.max(pr, pg, pb);
    if (mx > 150 && (mx - Math.min(pr, pg, pb)) / mx < 0.25) white++;
    // Boundary pixels: any 4-neighbor outside the shape
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1 || alpha[j - 1] < 0.3 || alpha[j + 1] < 0.3 || alpha[j - W] < 0.3 || alpha[j + W] < 0.3) edge++;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const k = ny * W + nx;
        if (alpha[k] >= 0.3 && label[k] === -1) {
          label[k] = id;
          stack.push(k);
        }
      }
  }
  pieces.push({ id, x0, y0, x1, y1, area, rgb: [r / area, g / area, b / area], edge, green: green / area, white: white / area });
}

function kindOf(p) {
  const w = p.x1 - p.x0 + 1;
  const h = p.y1 - p.y0 + 1;
  const fill = p.area / (w * h);
  const aspect = Math.max(w, h) / Math.min(w, h);
  // How ruffled the outline is: 1 for a circle, higher for a scalloped head
  const ruffle = (p.edge * p.edge) / (4 * Math.PI * p.area);
  if (p.white > 0.12) return 'descarte'; // stems with unpainted gaps
  if (p.green > 0.5) return 'hoja';
  if (p.green > 0.03) return 'otro';
  const size = Math.max(w, h);
  // Heads seen from above fill their box like a disc and are never tiny;
  // the upper rows of the sheet hold them, a little less round where petals stick out
  const head = size >= 150 && ((fill >= 0.69 && aspect <= 1.15) || (p.y0 < 1000 && fill >= 0.6 && aspect <= 1.3));
  if (head) return size > 300 ? 'flor' : 'florcita';
  if (size > 300 && ruffle > 2.2) return 'monton';
  return 'petalo';
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
const manifest = { flor: [], florcita: [], petalo: [], hoja: [], monton: [], otro: [] };
const PAD = 4;

for (const p of pieces) {
  if (p.area < 600) continue; // specks and paint dust
  const kind = kindOf(p);
  if (process.env.DEBUG) {
    const w = p.x1 - p.x0 + 1, h = p.y1 - p.y0 + 1;
    console.log(kind.padEnd(9), `x${p.x0} y${p.y0}`.padEnd(12), `size ${Math.max(w, h)}`.padEnd(9), `fill ${(p.area / (w * h)).toFixed(2)}`, `asp ${(Math.max(w, h) / Math.min(w, h)).toFixed(2)}`, `ruf ${((p.edge * p.edge) / (4 * Math.PI * p.area)).toFixed(2)}`, `g ${p.green.toFixed(2)} w ${p.white.toFixed(2)}`);
  }
  if (kind === 'descarte') continue;
  const x0 = Math.max(0, p.x0 - PAD);
  const y0 = Math.max(0, p.y0 - PAD);
  const w = Math.min(W, p.x1 + PAD + 1) - x0;
  const h = Math.min(H, p.y1 + PAD + 1) - y0;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y + y0) * W + (x + x0);
      // Only this piece's pixels, plus its soft fringe (unlabeled, faint, touching it)
      const own = label[i] === p.id || (label[i] === -1 && alpha[i] > 0);
      const a = own ? alpha[i] : 0;
      const o = (y * w + x) * 4;
      out[o + 3] = Math.round(a * 255);
      if (a <= 0) continue;
      for (let c = 0; c < 3; c++) out[o + c] = Math.max(0, Math.min(255, Math.round((data[i * 3 + c] - (1 - a) * NAVY[c]) / a)));
    }
  const n = manifest[kind].length + 1;
  const name = `${kind}-${n}.webp`;
  const side = SIZE[kind];
  const k = Math.min(1, side / Math.max(w, h));
  const result = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .resize(Math.round(w * k), Math.round(h * k))
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(fileURLToPath(new URL(name, OUT)));
  manifest[kind].push({ src: `/images/cempasuchil/${name}`, w: result.width, h: result.height });
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(Object.entries(manifest).map(([k, v]) => `${k}: ${v.length}`).join(', '));
