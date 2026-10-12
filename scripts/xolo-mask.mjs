/**
 * Cuts the Xolo out of the opening illustration.
 *
 * A hand traced outline only says roughly where the dog is; inside it (grown a
 * little), every pixel is classified by color: the sky, the sunset, the
 * marigolds and the candles are background, the rest is dog. The result is
 * cleaned up (largest piece, small holes filled), feathered, and saved as:
 *   public/images/xolo-mascara.png  alpha mask of the dog, cropped to BOX
 *   src/scripts/xolo-contorno.json  its outer contour, in painting pixels
 *
 * Run: node scripts/xolo-mask.mjs [--preview out.png]
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const SOURCE = fileURLToPath(new URL('assets/xolo/hero-pictorico-v1.png', root));
// Crop that holds the dog and its glow, in painting pixels (matches Lema.astro)
const BOX = { x: 1050, y: 190, w: 520, h: 680 };

// Rough outline of the dog, clockwise from the nose (offset by 1090, 230)
const GUIDE = [
  [22, 152], [32, 142], [50, 132], [80, 115], [115, 97], [117, 90], [134, 40], [165, -2], [168, 30], [164, 62],
  [172, 76], [182, 76], [205, 35], [225, 12], [231, 50], [226, 100], [210, 135], [212, 165], [215, 190], [225, 240],
  [238, 285], [256, 330], [278, 370], [300, 410], [322, 450], [338, 490], [342, 520], [338, 545], [350, 560],
  [378, 556], [398, 535], [407, 512], [410, 520], [402, 548], [380, 572], [350, 582], [320, 585], [260, 588],
  [200, 590], [150, 590], [100, 588], [88, 578], [105, 560], [122, 530], [133, 490], [138, 440], [134, 390],
  [118, 330], [112, 288], [109, 250], [104, 215], [97, 190], [65, 182], [35, 167],
].map(([x, y]) => [x + 1090 - BOX.x, y + 230 - BOX.y]);

const { data, info } = await sharp(SOURCE)
  .extract({ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const N = W * H;

// 1. Region: the guide polygon, grown by GROW pixels
function inside(x, y, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
let region = new Uint8Array(N);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) region[y * W + x] = inside(x + 0.5, y + 0.5, GUIDE) ? 1 : 0;
const GROW = 14;
// Well inside the outline, purple is the dog's own shading; only near the edge is it sky
const core = erode(region, 12);
region = dilate(region, GROW);

// 2. Color: is this pixel background?
function hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max ? d / max : 0, max];
}
// The ears (red inside) sit above this line, against the blue sky; below it the
// sunset and the candle glow share the ears' reds, so warm rules only apply there
const EARS_END = 205;

function background(r, g, b, y, edge) {
  const [h, s, v] = hsv(r, g, b);
  // Candles and bright highlights
  if (v > 0.86 && s < 0.35) return true;
  // Night sky: blue to violet
  if (h > 205 && h < 300 && b > r * 1.05) return true;
  // Mauve dusk and the violet ground: the dog's skin is red brown, never this purple
  if ((edge || y < 250) && h > 255 && h < 335 && s > 0.25 && v > 0.26) return true;
  if (y > EARS_END) {
    // Marigolds and lit petals: saturated warm
    if (s > 0.62 && v > 0.55 && (h < 50 || h > 340)) return true;
    // Sunset band: pink and coral, brighter and more saturated than the skin
    if ((h > 320 || h < 20) && s > 0.45 && v > 0.5) return true;
  }
  return false;
}

let dog = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  if (!region[i]) continue;
  dog[i] = background(data[i * 3], data[i * 3 + 1], data[i * 3 + 2], (i / W) | 0, !core[i]) ? 0 : 1;
}

// 3. Clean up: smooth specks, keep the largest piece, fill small holes
dog = erode(dilate(dog, 1), 1); // close
dog = dilate(erode(dog, 2), 2); // open: drops petal specks stuck to the edge
dog = largest(dog);
// Only specks (eye glints, skin highlights): the candle light between the legs must stay open
dog = fillHoles(dog, 120);

// 4. Feathered alpha
const alpha = Buffer.alloc(N);
for (let i = 0; i < N; i++) alpha[i] = dog[i] * 255;
const mask = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(0.8).png().toBuffer();
await writeFile(fileURLToPath(new URL('public/images/xolo-mascara.png', root)), mask);

// 5. Outer contour, simplified, back in painting pixels
const contour = simplify(traceOuter(dog), 1.2).map(([x, y]) => [x + BOX.x, y + BOX.y]);
await writeFile(
  fileURLToPath(new URL('src/scripts/xolo-contorno.json', root)),
  JSON.stringify(contour.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10])) + '\n',
);

const previewAt = process.argv.indexOf('--preview');
if (previewAt > 0) {
  const out = Buffer.alloc(N * 3);
  for (let i = 0; i < N; i++) {
    const keep = dog[i];
    out[i * 3] = keep ? data[i * 3] : 20;
    out[i * 3 + 1] = keep ? data[i * 3 + 1] : 220;
    out[i * 3 + 2] = keep ? data[i * 3 + 2] : 120;
  }
  await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png().toFile(process.argv[previewAt + 1]);
}
console.log(`mask ${W}×${H}, contour ${contour.length} points`);

// ---------- helpers ----------

function dilate(src, r) {
  return morph(src, r, 1);
}
function erode(src, r) {
  return morph(src, r, 0);
}
// Square structuring element, done as two passes
function morph(src, r, value) {
  const pass = (a, dx, dy) => {
    const out = new Uint8Array(N);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let hit = !value;
        for (let k = -r; k <= r; k++) {
          const xx = x + k * dx;
          const yy = y + k * dy;
          const v = xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : a[yy * W + xx];
          if (value ? v : !v) {
            hit = value ? true : false;
            break;
          }
        }
        out[y * W + x] = value ? (hit ? 1 : 0) : hit ? 1 : 0;
      }
    return out;
  };
  return pass(pass(src, 1, 0), 0, 1);
}

function components(src, target) {
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
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const k = ny * W + nx;
        if (src[k] === target && label[k] === -1) {
          label[k] = id;
          stack.push(k);
        }
      }
    }
    sizes.push(size);
  }
  return { label, sizes };
}

function largest(src) {
  const { label, sizes } = components(src, 1);
  const best = sizes.indexOf(Math.max(...sizes));
  const out = new Uint8Array(N);
  for (let i = 0; i < N; i++) out[i] = label[i] === best ? 1 : 0;
  return out;
}

// Background pieces that do not touch the border and are small are holes to fill
function fillHoles(src, maxArea) {
  const { label, sizes } = components(src, 0);
  const touches = new Set();
  for (let x = 0; x < W; x++) {
    touches.add(label[x]);
    touches.add(label[(H - 1) * W + x]);
  }
  for (let y = 0; y < H; y++) {
    touches.add(label[y * W]);
    touches.add(label[y * W + W - 1]);
  }
  const out = src.slice();
  for (let i = 0; i < N; i++) if (!src[i] && !touches.has(label[i]) && sizes[label[i]] <= maxArea) out[i] = 1;
  return out;
}

// Moore neighbor tracing of the outer boundary
function traceOuter(src) {
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : src[y * W + x]);
  let start = -1;
  for (let i = 0; i < N && start < 0; i++) if (src[i]) start = i;
  const sx = start % W;
  const sy = (start / W) | 0;
  const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const pts = [[sx, sy]];
  let x = sx;
  let y = sy;
  let d = 6; // came from above
  for (let guard = 0; guard < N; guard++) {
    let found = false;
    for (let k = 0; k < 8; k++) {
      const nd = (d + 6 + k) % 8; // start left of the way we came
      const nx = x + dirs[nd][0];
      const ny = y + dirs[nd][1];
      if (at(nx, ny)) {
        x = nx;
        y = ny;
        d = nd;
        found = true;
        break;
      }
    }
    if (!found || (x === sx && y === sy)) break;
    pts.push([x, y]);
  }
  return pts;
}

// Ramer–Douglas–Peucker on a closed outline
function simplify(pts, eps) {
  const rdp = (a, b) => {
    let max = 0;
    let idx = -1;
    const [x1, y1] = pts[a];
    const [x2, y2] = pts[b];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = pts[i];
      const dist = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / len;
      if (dist > max) {
        max = dist;
        idx = i;
      }
    }
    if (max > eps) return [...rdp(a, idx).slice(0, -1), ...rdp(idx, b)];
    return [pts[a], pts[b]];
  };
  const half = pts.length >> 1;
  return [...rdp(0, half).slice(0, -1), ...rdp(half, pts.length - 1).slice(0, -1)];
}
