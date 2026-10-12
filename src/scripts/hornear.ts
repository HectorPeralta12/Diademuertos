/**
 * Bakes a static SVG into a bitmap. A detailed SVG (hundreds of shapes, masks,
 * turbulence and ink filters) is drawn again whenever the browser repaints
 * the area around it; a canvas is just copied. The SVG keeps its place and its
 * accessibility; only its pixels are swapped for the baked copy.
 *
 * Styles that come from CSS classes do not travel with a serialized SVG, so the
 * paint properties are inlined from the computed style first. Filters defined
 * elsewhere in the page (like #trazo) are copied in.
 */

const PROPS = [
  'fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linejoin', 'stroke-linecap',
  'paint-order', 'opacity', 'filter', 'mix-blend-mode',
];

/** url("http://host/page#id") → url(#id), so references resolve inside the image */
const local = (value: string) => value.replace(/url\((["']?)[^#)"']*#([^)"']+)\1\)/g, 'url(#$2)');

function serialize(svg: SVGSVGElement, width: number, height: number) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const from = svg.querySelectorAll<SVGElement>('*');
  const to = clone.querySelectorAll<SVGElement>('*');
  const needed = new Set<string>();
  from.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const style = PROPS.map((p) => `${p}:${local(cs.getPropertyValue(p))}`).join(';');
    to[i].setAttribute('style', style);
    for (const m of style.matchAll(/url\(#([^)]+)\)/g)) needed.add(m[1]);
    // References made by attribute: mask="url(#…)", clip-path, href="#…"
    for (const attr of Array.from(el.attributes)) {
      const m = attr.value.match(/^url\(#([^)]+)\)$/) ?? (attr.name.endsWith('href') ? attr.value.match(/^#(.+)$/) : null);
      if (m) needed.add(m[1]);
    }
  });
  // Bring in referenced definitions that live outside this SVG
  let defs = clone.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    clone.prepend(defs);
  }
  for (const id of needed) {
    if (clone.querySelector(`#${CSS.escape(id)}`)) continue;
    const outside = document.getElementById(id);
    if (outside) defs.append(outside.cloneNode(true));
  }
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.removeAttribute('class');
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  return new XMLSerializer().serializeToString(clone);
}

/** Replace the SVG's pixels with a baked canvas; re-bakes when its size changes */
export function hornear(svg: SVGSVGElement) {
  const canvas = document.createElement('canvas');
  // Created at runtime, so scoped component styles would not reach it: place it inline
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.hidden = true;
  svg.after(canvas);

  let job = 0;
  async function bake() {
    const id = ++job;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    // While re-baking at a new size, the live SVG shows
    canvas.hidden = true;
    svg.style.visibility = '';
    try {
      const url = URL.createObjectURL(new Blob([serialize(svg, w, h)], { type: 'image/svg+xml' }));
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      await img.decode();
      URL.revokeObjectURL(url);
      if (id !== job) return;
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      canvas.hidden = false;
      svg.style.visibility = 'hidden';
    } catch {
      // Anything the image cannot render: keep the SVG as it was
      canvas.hidden = true;
      svg.style.visibility = '';
    }
  }

  let timer = 0;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = window.setTimeout(bake, 250);
  }).observe(svg);
}
