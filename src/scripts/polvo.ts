/**
 * Gold dust, the trail Star leaves in *Wish*: tiny warm motes that rise, drift
 * and fade, with an occasional four point glint among them.
 *
 * The canvas covers an SVG that uses `box` as its viewBox, so emitters work in
 * the same coordinates as the drawing they follow.
 */

import { drawSparkle } from './sparkle';
import { canvasDpr } from './telefono';

interface Mote { x: number; y: number; vx: number; vy: number; life: number; age: number; r: number; glint: boolean; hue: number }

const TONES = ['255, 214, 120', '255, 236, 170', '255, 190, 90'];

export function polvo(canvas: HTMLCanvasElement, viewBox?: { x: number; y: number; w: number; h: number }) {
  // Without a viewBox, emitters use the canvas's own CSS pixels
  const box = viewBox ?? { x: 0, y: 0, w: 1, h: 1 };
  const ctx = canvas.getContext('2d')!;
  const motes: Mote[] = [];
  let scale = 1;
  let dpr = 1;

  function resize() {
    dpr = canvasDpr();
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    if (!viewBox) {
      box.w = canvas.clientWidth || 1;
      box.h = canvas.clientHeight || 1;
    }
    // The SVG fits its viewBox with "meet": the same here
    scale = Math.min(canvas.width / box.w, canvas.height / box.h);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  return {
    /** Release `count` motes around a point */
    emit(x: number, y: number, count = 1, spread = 6) {
      for (let i = 0; i < count; i++) {
        motes.push({
          x: x + (Math.random() - 0.5) * spread,
          y: y + (Math.random() - 0.5) * spread,
          vx: (Math.random() - 0.5) * 14,
          vy: -6 - Math.random() * 18,
          life: 1.2 + Math.random() * 1.6,
          age: 0,
          r: 0.6 + Math.random() * 1.4,
          glint: Math.random() < 0.06,
          hue: Math.floor(Math.random() * TONES.length),
        });
      }
      if (motes.length > 600) motes.splice(0, motes.length - 600);
    },
    get alive() {
      return motes.length;
    },
    step(dt: number) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ox = (canvas.width - box.w * scale) / 2;
      const oy = (canvas.height - box.h * scale) / 2;
      ctx.setTransform(scale, 0, 0, scale, ox - box.x * scale, oy - box.y * scale);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.age += dt;
        if (m.age >= m.life) {
          motes.splice(i, 1);
          continue;
        }
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.vx *= 0.985;
        const k = m.age / m.life;
        const a = Math.sin(Math.PI * k);
        if (m.glint) {
          drawSparkle(ctx, m.x, m.y, m.r * 2.2, a, false);
        } else {
          ctx.globalAlpha = a;
          ctx.fillStyle = `rgba(${TONES[m.hue]}, 1)`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    },
  };
}
