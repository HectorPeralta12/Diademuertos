import { mkdir, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const images = [
  // The upscaled painting (4×), served at the original size and at 2× for dense screens
  ['assets/xolo/hero_upscaled.webp', 'xolo-hero.webp', 1672],
  ['assets/xolo/hero_upscaled.webp', 'xolo-hero@2x.webp', 3344],
  // The tall night sky behind the 2D sections
  ['assets/altar/cielo_upscaled.webp', 'cielo-900.webp', 900],
  ['assets/altar/cielo_upscaled.webp', 'cielo-1600.webp', 1600],
  // Same painting as the 4K copy the altar scene swaps to, so the swap shows no change
  ['assets/altar/altar-general-4k.png', 'altar-general.webp', 1669],
  ['assets/altar/checkpoints-pictoricos-v2/01-flores-velas-copal.png', 'altar-flores-velas-copal.webp'],
  ['assets/altar/checkpoints-pictoricos-v2/02-comida-agua.png', 'altar-comida-agua.webp'],
  ['assets/altar/checkpoints-pictoricos-v2/03-retratos-papel-picado.png', 'altar-retratos-papel-picado.webp'],
];
const output = new URL('public/images/', root);
await mkdir(output, { recursive: true });
const manifest = [];

for (const [source, filename, width] of images) {
  const sourcePath = fileURLToPath(new URL(source, root));
  const targetPath = fileURLToPath(new URL(filename, output));
  const result = await sharp(sourcePath)
    .resize(width ? { width } : undefined)
    .webp({ quality: 90, effort: 6 })
    .toFile(targetPath);
  const sourceInfo = await stat(sourcePath);
  manifest.push({
    source,
    url: `/images/${filename}`,
    width: result.width,
    height: result.height,
    originalBytes: sourceInfo.size,
    webpBytes: result.size,
  });
  console.log(`${filename}: ${result.width} × ${result.height}, ${(result.size / 1024).toFixed(0)} KB`);
}

await writeFile(new URL('manifest.json', output), `${JSON.stringify(manifest, null, 2)}\n`);
