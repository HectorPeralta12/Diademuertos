/**
 * The opening painting, kept alive in code instead of a video: stars twinkle,
 * cempasúchil petals fall from the tree, the candles breathe and the Xolo blinks.
 *
 * Everything is drawn in the painting's own pixel space (ART_W × ART_H), so the
 * canvas only needs to sit exactly on top of the image and scale with it.
 */

import { drawSparkle, twinkle } from './sparkle';
import piezas from './cempasuchil.json';

// Painted petals from the cempasúchil sheet; a drawn petal stands in until they load
const PAINTED = piezas.petalo.map((p) => {
  const img = new Image();
  img.decoding = 'async';
  img.src = p.src;
  return img;
});

export const ART_W = 1672;
export const ART_H = 941;

type Rand = () => number;

function random(seed: number): Rand {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Places in the painting, measured on hero-pictorico-v1.png
const EYE = { x: 1212, y: 352, rx: 14, ry: 11, lid: '#4f2c2b', lash: '#2a1414' };
const CANDLES = [
  { x: 1170, y: 702, r: 46 },
  { x: 1431, y: 630, r: 40 },
  { x: 1486, y: 597, r: 44 },
  { x: 1540, y: 710, r: 46 },
];
const PETAL_TONES = ['#f7a21b', '#ef8817', '#dc6410', '#ffb23f'];

/** The open sky: left of the tree, above the sunset band, away from the dog */
function inSky(x: number, y: number) {
  if (y < 12 || y > 330) return false;
  if (x > 1120) return false;
  if (x > 520 && y < 120) return false; // leaves at the top
  if (x > 980 && y > 230) return false; // ear and leaves on the right
  return true;
}

interface Star { x: number; y: number; r: number; phase: number; speed: number; flare: boolean }
interface Petal { x: number; y: number; vx: number; vy: number; rot: number; spin: number; sway: number; size: number; tone: string; phase: number; painted: number }

export function ambience(canvas: HTMLCanvasElement, still: boolean) {
  const ctx = canvas.getContext('2d')!;
  const rand = random(1102);

  const stars: Star[] = [];
  while (stars.length < 70) {
    const x = rand() * ART_W;
    const y = rand() * ART_H;
    if (!inSky(x, y)) continue;
    const flare = rand() < 0.12;
    stars.push({ x, y, r: flare ? 4 + rand() * 3 : 1 + rand() * 1.8, phase: rand() * Math.PI * 2, speed: 0.6 + rand() * 1.6, flare });
  }

  const petals: Petal[] = Array.from({ length: 16 }, () => spawn(true));
  function spawn(anywhere = false): Petal {
    // From the canopy (top right) or the marigold bush beside the dog
    const bush = rand() < 0.35;
    const x = bush ? 1380 + rand() * 280 : 620 + rand() * 1050;
    const y = anywhere ? rand() * ART_H : bush ? 260 + rand() * 260 : -20 + rand() * 140;
    return {
      x, y,
      vx: -6 - rand() * 14,
      vy: 18 + rand() * 22,
      rot: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 2.4,
      sway: 10 + rand() * 18,
      size: 5 + rand() * 5,
      tone: PETAL_TONES[Math.floor(rand() * PETAL_TONES.length)],
      phase: rand() * Math.PI * 2,
      painted: Math.floor(rand() * PAINTED.length),
    };
  }

  let nextBlink = 1.6;
  let shooting: { t: number; x: number; y: number } | null = null;
  let nextShooting = 5;

  let scale = 1;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    scale = canvas.width / ART_W;
  }

  function drawStar(s: Star, time: number) {
    const tw = twinkle(time, s.speed, s.phase);
    const a = s.flare ? 0.35 + 0.65 * tw : 0.15 + 0.75 * tw;
    drawSparkle(ctx, s.x, s.y, s.r * (0.75 + 0.35 * tw), a, s.flare);
  }

  function drawShooting(dt: number) {
    if (!shooting) return;
    shooting.t += dt;
    const life = 1.1;
    const k = shooting.t / life;
    if (k >= 1) { shooting = null; return; }
    const x = shooting.x + 420 * k;
    const y = shooting.y + 140 * k;
    const tail = 120;
    const g = ctx.createLinearGradient(x, y, x - tail, y - tail / 3);
    g.addColorStop(0, 'rgba(255, 246, 220, 0.95)');
    g.addColorStop(1, 'rgba(255, 246, 220, 0)');
    ctx.globalAlpha = Math.sin(Math.PI * k);
    ctx.strokeStyle = g;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - tail, y - tail / 3);
    ctx.stroke();
  }

  function drawCandles(time: number) {
    ctx.globalCompositeOperation = 'lighter';
    CANDLES.forEach((c, i) => {
      // Two slow waves and a quick one read as a living flame
      const f = 0.55 + 0.25 * Math.sin(time * 2.1 + i * 1.7) + 0.12 * Math.sin(time * 7.3 + i) + 0.08 * Math.sin(time * 13 + i * 3);
      const r = c.r * (0.9 + 0.15 * f);
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
      g.addColorStop(0, `rgba(255, 190, 90, ${0.32 * f})`);
      g.addColorStop(1, 'rgba(255, 150, 60, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawPetal(p: Petal, time: number) {
    // The petal turns as it falls: its width breathes like a flipping leaf
    const flip = Math.cos(time * 1.8 + p.phase);
    ctx.save();
    ctx.translate(p.x + Math.sin(time * 1.2 + p.phase) * p.sway, p.y);
    ctx.rotate(p.rot);
    ctx.scale(0.35 + 0.65 * Math.abs(flip), 1);
    ctx.globalAlpha = 0.95;
    const img = PAINTED[p.painted];
    if (img && img.complete && img.naturalWidth) {
      const k = (p.size * 2.6) / Math.max(img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, (-img.naturalWidth * k) / 2, (-img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k);
      ctx.restore();
      return;
    }
    ctx.fillStyle = p.tone;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.7, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
    ctx.fill();
    // Ruffled tip, darker, like the painted flowers
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#a84b04';
    ctx.beginPath();
    ctx.ellipse(0, -p.size * 0.55, p.size * 0.35, p.size * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBlink(time: number) {
    // A blink closes over ~90ms, holds a beat and opens over ~140ms
    const t = time - nextBlink;
    if (t < 0) return;
    const total = 0.32;
    if (t > total) {
      nextBlink = time + 2.8 + rand() * 3.6;
      // Now and then, a double blink
      if (rand() < 0.25) nextBlink = time + 0.35;
      return;
    }
    const close = t < 0.09 ? t / 0.09 : t < 0.18 ? 1 : 1 - (t - 0.18) / 0.14;
    const k = Math.max(0, Math.min(1, close));
    const { x, y, rx, ry } = EYE;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 3, ry + 3, -0.15, 0, Math.PI * 2);
    ctx.clip();
    const lidBottom = y - ry - 3 + (ry * 2 + 6) * k;
    ctx.fillStyle = EYE.lid;
    ctx.fillRect(x - rx - 4, y - ry - 6, rx * 2 + 8, lidBottom - (y - ry - 6));
    ctx.strokeStyle = EYE.lash;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x - rx - 4, lidBottom);
    ctx.quadraticCurveTo(x, lidBottom + 3 * k, x + rx + 4, lidBottom);
    ctx.stroke();
    ctx.restore();
  }

  let raf = 0;
  let running = false;
  let lastTime = 0;
  let clock = 0;

  function frame(now: number) {
    const dt = Math.min(0.05, lastTime ? (now - lastTime) / 1000 : 0);
    lastTime = now;
    clock += dt;
    render(dt);
    if (running) raf = requestAnimationFrame(frame);
  }

  function render(dt: number) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    for (const s of stars) drawStar(s, clock);

    if (!still) {
      if (clock > nextShooting && !shooting) {
        shooting = { t: 0, x: 60 + rand() * 500, y: 30 + rand() * 90 };
        nextShooting = clock + 9 + rand() * 8;
      }
      drawShooting(dt);
    }

    ctx.globalAlpha = 1;
    drawCandles(clock);

    if (!still) {
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        if (p.y > ART_H + 20 || p.x < -20) petals[i] = spawn();
        drawPetal(p, clock);
      }
      drawBlink(clock);
    }
    ctx.globalAlpha = 1;
  }

  const ro = new ResizeObserver(() => {
    resize();
    if (!running) render(0);
  });
  ro.observe(canvas);
  resize();

  return {
    play() {
      if (still) { render(0); return; }
      if (running) return;
      running = true;
      lastTime = 0;
      raf = requestAnimationFrame(frame);
    },
    pause() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}
