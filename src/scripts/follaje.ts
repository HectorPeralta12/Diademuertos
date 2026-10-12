/**
 * Storybook foliage for the corners of the 2D sections, drawn the way *Wish*
 * draws its forests: dark, almost flat leaves with a fine ink line and a pale
 * vein, in two depths, with lit cempasúchil among them.
 *
 * Runs at build time. Every piece is drawn for the top left or bottom left
 * corner of a 500 × 500 box; the right corners are the same drawing mirrored.
 */
import { marigold, type Layer } from './marigold';

function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v: number) => Math.round(v * 10) / 10;

export interface Leaf { d: string; vein: string; fill: string }
export interface Flower { x: number; y: number; r: number; layers: Layer[] }
export interface Stem { d: string }
export interface Piece {
  /** Hanging vines (top) or a bush (bottom), split in two depths */
  far: { leaves: Leaf[]; stems: Stem[] };
  near: { leaves: Leaf[]; stems: Stem[]; flowers: Flower[]; sway: { d: string; leaves: Leaf[]; flowers: Flower[]; ox: number; oy: number }[] };
}

const NEAR = ['#0d0b2b', '#110e35', '#0a0922', '#141039'];
const FAR = ['#1b1846', '#17143e', '#1f1b4c'];

/** An almond leaf from (x, y), pointing at angle a, `len` long */
function leaf(x: number, y: number, a: number, len: number, wid: number, fill: string): Leaf {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const P = (u: number, v: number) => `${n(x + u * c - v * s)} ${n(y + u * s + v * c)}`;
  const w = wid / 2;
  return {
    d: `M${P(0, 0)}C${P(len * 0.25, -w * 1.1)} ${P(len * 0.7, -w * 0.9)} ${P(len, 0)}C${P(len * 0.7, w * 0.9)} ${P(len * 0.25, w * 1.1)} ${P(0, 0)}Z`,
    vein: `M${P(len * 0.08, 0)}Q${P(len * 0.5, -w * 0.12)} ${P(len * 0.88, 0)}`,
    fill,
  };
}

function flower(x: number, y: number, r: number, rand: () => number): Flower {
  return { x, y, r, layers: marigold(Math.floor(rand() * 6), Math.floor(rand() * 3)) };
}

/** Vines hanging from the top edge, with a leafy mass in the corner */
export function colgante(seed: number): Piece {
  const rand = random(seed);
  const piece: Piece = { far: { leaves: [], stems: [] }, near: { leaves: [], stems: [], flowers: [], sway: [] } };

  // Far: a soft mass of big leaves along the top
  for (let i = 0; i < 28; i++) {
    const x = rand() * 480;
    const y = -30 + rand() * 90 * (1 - x / 600);
    piece.far.leaves.push(leaf(x, y, Math.PI * (0.15 + rand() * 0.7), 80 + rand() * 90, 30 + rand() * 24, FAR[i % FAR.length]));
  }

  // Near: the corner mass
  for (let i = 0; i < 26; i++) {
    const a = Math.PI * (0.02 + rand() * 0.5);
    const len = 90 + rand() * 110;
    piece.near.leaves.push(leaf(-20 + rand() * 140, -20 + rand() * 50, a, len, len * 0.34, NEAR[i % NEAR.length]));
  }

  // Near: vines, each its own swaying group
  const vines = 3 + Math.floor(rand() * 2);
  for (let v = 0; v < vines; v++) {
    const ox = 40 + v * (90 + rand() * 40);
    const length = 200 + rand() * 230;
    const bend = (rand() - 0.3) * 80;
    const pts: [number, number][] = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push([ox + Math.sin(t * Math.PI * 0.9) * bend, -10 + t * length]);
    }
    const d = 'M' + pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L');
    const group = { d, leaves: [] as Leaf[], flowers: [] as Flower[], ox, oy: -10 };
    for (let i = 1; i < steps; i++) {
      const [x, y] = pts[i];
      const [x2, y2] = pts[i + 1];
      const dir = Math.atan2(y2 - y, x2 - x);
      const side = i % 2 === 0 ? 1 : -1;
      const size = (1 - i / steps) * 34 + 20;
      group.leaves.push(leaf(x, y, dir + side * (0.9 + rand() * 0.4), size, size * 0.45, NEAR[(i + v) % NEAR.length]));
    }
    const [ex, ey] = pts[steps];
    if (rand() < 0.8) group.flowers.push(flower(ex, ey + 8, 15 + rand() * 10, rand));
    if (rand() < 0.5) {
      const [mx, my] = pts[Math.floor(steps * 0.55)];
      group.flowers.push(flower(mx + 10, my, 11 + rand() * 6, rand));
    }
    piece.near.sway.push(group);
  }
  return piece;
}

/** A bush rising from the bottom edge, with marigolds on tall stems */
export function mata(seed: number): Piece {
  const rand = random(seed);
  const piece: Piece = { far: { leaves: [], stems: [] }, near: { leaves: [], stems: [], flowers: [], sway: [] } };

  // Far: taller, paler leaves behind
  for (let i = 0; i < 24; i++) {
    const x = rand() * 440;
    piece.far.leaves.push(leaf(x, 515, -Math.PI * (0.22 + rand() * 0.56), (130 + rand() * 150) * (1 - x / 700), 36 + rand() * 22, FAR[i % FAR.length]));
  }

  // Near: marigolds on stems, behind the front leaves
  const blooms = 6 + Math.floor(rand() * 3);
  for (let i = 0; i < blooms; i++) {
    const bx = 20 + rand() * 340;
    const top = 250 + rand() * 170 + bx * 0.15;
    const lean = (rand() - 0.4) * 40;
    const group = { d: `M${n(bx)} 510Q${n(bx + lean * 0.3)} ${n((510 + top) / 2)} ${n(bx + lean)} ${n(top)}`, leaves: [] as Leaf[], flowers: [] as Flower[], ox: bx, oy: 510 };
    group.flowers.push(flower(bx + lean, top, 16 + rand() * 16, rand));
    // A pair of small leaves on the stem
    const ly = (510 + top) / 2 + 20;
    group.leaves.push(leaf(bx + lean * 0.4, ly, -Math.PI * 0.2, 30, 12, NEAR[i % NEAR.length]));
    group.leaves.push(leaf(bx + lean * 0.4, ly + 18, -Math.PI * 0.85, 26, 11, NEAR[(i + 1) % NEAR.length]));
    piece.near.sway.push(group);
  }

  // Near: the bush, big dark leaves fanning up from the ground
  for (let i = 0; i < 38; i++) {
    const x = -30 + rand() * 400;
    const a = -Math.PI * (0.15 + rand() * 0.68);
    const len = 80 + rand() * 150 * (1 - x / 480);
    piece.near.leaves.push(leaf(x, 515, a, len, len * 0.36, NEAR[i % NEAR.length]));
  }
  // A few lower blooms peeking out of the leaves
  for (let i = 0; i < 5; i++) piece.near.flowers.push(flower(20 + rand() * 280, 430 + rand() * 60, 14 + rand() * 12, rand));
  return piece;
}
