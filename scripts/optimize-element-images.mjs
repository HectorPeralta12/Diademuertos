import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const names = ['retratos', 'veladoras', 'pan-de-muerto', 'cempasuchil', 'copal', 'papel-picado', 'calaverita'];
const output = new URL('../public/images/elementos-ia/', import.meta.url);
await mkdir(output, { recursive: true });
const manifest = [];
for (const name of names) {
  for (const width of [360, 720]) {
    const file = `${name}${width === 360 ? '-360' : ''}.webp`;
    const result = await sharp(new URL(`../assets/elementos-ia/${name}.png`, import.meta.url).pathname)
      .resize(width, width * 5 / 4, { fit: 'cover' })
      .webp({ quality: 84, effort: 6 })
      .toFile(new URL(file, output).pathname);
    manifest.push({ file, width: result.width, height: result.height, bytes: result.size });
  }
}
await writeFile(new URL('manifest.json', output), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Optimized ${manifest.length} WebP files; 720px set: ${manifest.filter(x => x.width === 720).reduce((sum, x) => sum + x.bytes, 0)} bytes`);
