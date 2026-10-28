/**
 * Bakes the Xolo of the tagline scene (Lema.astro) into three transparent
 * images, so the crossing only fades pictures on the GPU instead of running
 * masks, blurs and blends on every scroll frame (it stuttered on phones):
 *
 *   pintura   the painted dog cut out of the opening illustration, with its ink line
 *   espiritu  the dog made of light: a gold glow shaded by the painting's own relief
 *   halo      the soft gold glow around it
 *
 * Each comes at 1× (520 × 680, the BOX of the mask) and 2×, in
 * public/images/xolo-capas/. Run after scripts/xolo-mask.mjs.
 *
 * Run: node scripts/xolo-capas.mjs
 */
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const file = (p) => fileURLToPath(new URL(p, root));
const OUT = file('public/images/xolo-capas/');

// Same crop and eye as the mask and the scene, in painting pixels (1672 × 941)
const BOX = { x: 1050, y: 190, w: 520, h: 680 };
const EYE = { x: 1212, y: 352 };

// The light: a radial gold from the chest outward
const LIGHT = { cx: 1250, cy: 520, r: 360 };
const STOPS = [
  [0, [0xff, 0xf6, 0xd6]],
  [0.45, [0xff, 0xd0, 0x6a]],
  [1, [0xf2, 0x9a, 0x1c]],
];
const HALO = [0xff, 0xc4, 0x5a];

function gold(t) {
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return c0.map((v, j) => v + (c1[j] - v) * k);
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/** Closed Catmull-Rom spline through the contour, as in src/scripts/xolo-path.ts */
function smooth(points, tension = 0.5) {
  const n = points.length;
  const at = (i) => points[(i + n) % n];
  const r = (v) => Math.round(v * 10) / 10;
  let d = `M${r(points[0][0])} ${r(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    const k = tension / 3;
    d += ` C${r(x1 + (x2 - x0) * k)} ${r(y1 + (y2 - y0) * k)} ${r(x2 - (x3 - x1) * k)} ${r(y2 - (y3 - y1) * k)} ${r(x2)} ${r(y2)}`;
  }
  return d + 'Z';
}
const XOLO_D = smooth(JSON.parse(await readFile(file('src/scripts/xolo-contorno.json'), 'utf8')));

/** An SVG drawn over the crop, in painting coordinates */
const overlay = (W, H, body, defs = '') =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}"><defs>${defs}</defs>${body}</svg>`,
  );

// The hand drawn wobble of the shared #trazo filter (Layout.astro)
const TRAZO = `<filter id="trazo" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" /></filter>`;

async function bake(scale) {
  const W = BOX.w * scale;
  const H = BOX.h * scale;
  const N = W * H;

  const paint = await sharp(file('public/images/xolo-hero@2x.webp'))
    .extract({ left: BOX.x * 2, top: BOX.y * 2, width: BOX.w * 2, height: BOX.h * 2 })
    .resize(W, H)
    .removeAlpha()
    .raw()
    .toBuffer();
  const mask = await sharp(file('public/images/xolo-mascara.png')).resize(W, H).greyscale().raw().toBuffer();
  const blurred = await sharp(file('public/images/xolo-mascara.png'))
    .resize(W, H)
    .greyscale()
    .blur(18 * scale)
    .raw()
    .toBuffer();

  const pintura = Buffer.alloc(N * 4);
  const espiritu = Buffer.alloc(N * 4);
  const halo = Buffer.alloc(N * 4);

  for (let i = 0; i < N; i++) {
    const m = mask[i] / 255;
    const [r, g, b] = [paint[i * 3], paint[i * 3 + 1], paint[i * 3 + 2]];

    pintura.set([r, g, b, mask[i]], i * 4);

    // Gold under the painting's light and shade (saturate 0, then a strong lift)
    const x = BOX.x + ((i % W) + 0.5) / scale;
    const y = BOX.y + (Math.floor(i / W) + 0.5) / scale;
    const light = gold(Math.hypot(x - LIGHT.cx, y - LIGHT.cy) / LIGHT.r).map((v) => v / 255);
    const relief = Math.min(1, Math.max(0, ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * 2.4 + 0.12));
    // The relief multiplied over the gold, both masked: 0.92 gold, 0.85 relief
    const ab = 0.92 * m;
    const as = 0.85 * m;
    const ao = as + ab * (1 - as);
    const out = light.map((cb) => {
      const cs = (1 - ab) * relief + ab * cb * relief;
      return ao ? (as * cs + ab * (1 - as) * cb) / ao : 0;
    });
    espiritu.set([...out.map((v) => Math.round(v * 255)), Math.round(ao * 255)], i * 4);

    halo.set([...HALO, blurred[i]], i * 4);
  }

  const raw = { raw: { width: W, height: H, channels: 4 } };
  const name = (n) => `${OUT}${n}${scale > 1 ? `@${scale}x` : ''}.webp`;
  const webp = { quality: 82, alphaQuality: 90, effort: 6 };

  await sharp(pintura, raw)
    .composite([
      {
        input: overlay(
          W,
          H,
          `<path d="${XOLO_D}" fill="none" stroke="#24110f" stroke-opacity="0.55" stroke-width="1.4" stroke-linejoin="round" filter="url(#trazo)" />`,
          TRAZO,
        ),
      },
    ])
    .webp(webp)
    .toFile(name('pintura'));

  await sharp(espiritu, raw)
    .composite([
      {
        input: overlay(
          W,
          H,
          `<ellipse cx="${EYE.x}" cy="${EYE.y}" rx="5.5" ry="4" transform="rotate(-12 ${EYE.x} ${EYE.y})" fill="#7a3c08" fill-opacity="0.5" />`,
        ),
      },
    ])
    .webp(webp)
    .toFile(name('espiritu'));

  await sharp(halo, raw).webp(webp).toFile(name('halo'));
}

await mkdir(OUT, { recursive: true });
await bake(1);
await bake(2);
console.log('xolo-capas: pintura, espiritu, halo at 1× and 2×');
