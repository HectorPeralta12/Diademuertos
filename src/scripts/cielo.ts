/**
 * The night sky under the whole page: the same storybook sparkles as the
 * opening painting, drifting a little slower than the scroll so the page has
 * depth. Painted scenes cover it; the 2D sections let it through.
 *
 * Its brightness follows the theme through --estrellas (set in CSS).
 */

import { drawSparkle, twinkle } from './sparkle';
import { canvasDpr } from './telefono';

interface Star { x: number; y: number; r: number; phase: number; speed: number; flare: boolean; depth: number }

function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function cielo(canvas: HTMLCanvasElement, still: boolean) {
  const ctx = canvas.getContext('2d')!;
  const rand = random(211);
  // Stars live on a tile one screen tall that repeats as the page scrolls
  const stars: Star[] = Array.from({ length: 64 }, () => {
    const flare = rand() < 0.08;
    return {
      x: rand(),
      y: rand(),
      r: flare ? 3 + rand() * 2.5 : 0.8 + rand() * 1.4,
      phase: rand() * Math.PI * 2,
      speed: 0.5 + rand() * 1.4,
      flare,
      depth: 0.04 + rand() * 0.1,
    };
  });

  let w = 0;
  let h = 0;
  let dpr = 1;
  function resize() {
    dpr = canvasDpr();
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }

  function render(time: number) {
    // Not laid out yet: nothing to draw, and the star wrap below would divide by zero
    if (!w || !h) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const scroll = window.scrollY;
    // Fewer stars on small screens, so the sky does not crowd the copy
    const count = w < 768 ? 36 : stars.length;
    for (let i = 0; i < count; i++) {
      const s = stars[i];
      const y = ((s.y * h - scroll * s.depth) % h + h) % h;
      const tw = still ? 0.7 : twinkle(time, s.speed, s.phase);
      const a = s.flare ? 0.3 + 0.6 * tw : 0.12 + 0.6 * tw;
      drawSparkle(ctx, s.x * w, y, s.r * (0.75 + 0.35 * tw), a, s.flare);
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0;
  let running = false;
  const frame = (now: number) => {
    render(now / 1000);
    if (running) raf = requestAnimationFrame(frame);
  };

  new ResizeObserver(() => {
    resize();
    render(performance.now() / 1000);
  }).observe(canvas);
  resize();

  return {
    play() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    pause() {
      running = false;
      cancelAnimationFrame(raf);
    },
    /** For reduced motion: redraw only when the page moves */
    draw: () => render(0),
  };
}
