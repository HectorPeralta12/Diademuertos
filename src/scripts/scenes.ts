/**
 * Scene engine. Each [data-scene] is a tall container (--len, in viewport heights)
 * with a sticky stage. On every frame the page moves it:
 *  - writes the scene's scroll progress (0 → 1) as `--p`,
 *  - turns texts on with `.is-on` while p is within their [data-beat="from to"],
 *  - sets the page theme, the year counter and the current chapter from the scene
 *    under the middle of the viewport (a beat can override the theme or the year).
 * Pattern adapted from margarethamilton.dev (MIT, midudev).
 */

import { $$ } from './dom';

type Listener = (p: number) => void;

interface Beat {
  el: HTMLElement;
  from: number;
  to: number;
}

interface Scene {
  el: HTMLElement;
  beats: Beat[];
  listeners: Listener[];
  p: number;
  top: number;
  height: number;
  far?: boolean;
}

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/** Local progress of `p` within [from, to], from 0 to 1 */
export const segment = (p: number, from: number, to: number) => clamp((p - from) / (to - from));

export const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);

const scenes: Scene[] = $$('[data-scene]').map((el) => ({
  el,
  beats: $$('[data-beat]', el).map((beat) => {
    const [from, to = 1.01] = (beat.dataset.beat ?? '0').split(' ').map(Number);
    return { el: beat, from, to };
  }),
  listeners: [],
  p: -1,
  top: 0,
  height: 0,
}));

// Stages are 100lvh tall: measuring the same height keeps progress steady
// while mobile toolbars hide or show
const probe = document.createElement('div');
probe.style.cssText = 'position:fixed;top:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none';
document.body.append(probe);
let vh = 0;
let vw = 0;

export const viewportHeight = () => vh;

function measure() {
  vh = probe.offsetHeight;
  vw = window.innerWidth;
  for (const scene of scenes) {
    scene.top = scene.el.getBoundingClientRect().top + window.scrollY;
    scene.height = scene.el.offsetHeight;
  }
}

const root = document.documentElement;
const yearEls = $$('[data-year-display]');
const chapterLinks = $$<HTMLAnchorElement>('[data-chapter-link]');
let shownYear = 0;
let targetYear = 0;
let yearRaf = 0;
let scheduled = false;

export function onProgress(sceneEl: HTMLElement, fn: Listener) {
  const scene = scenes.find((s) => s.el === sceneEl);
  if (!scene) return;
  scene.listeners.push(fn);
  scene.p = -1;
  queue();
}

function queue() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(frame);
}

function frame() {
  scheduled = false;
  const y = window.scrollY;
  let active: Scene | undefined;

  for (const scene of scenes) {
    const top = scene.top - y;
    const bottom = top + scene.height;
    if (top <= vh / 2 && bottom > vh / 2) active = scene;

    const far = bottom < -vh || top > vh * 2;
    if (far !== scene.far) {
      scene.far = far;
      scene.el.classList.toggle('is-far', far);
    }
    if (far) continue;

    const span = scene.height - vh;
    const p = span > 0 ? clamp(-top / span) : top <= 0 ? 1 : 0;
    if (p === scene.p) continue;
    scene.p = p;

    scene.el.style.setProperty('--p', p.toFixed(4));
    for (const beat of scene.beats) {
      beat.el.classList.toggle('is-on', p >= beat.from && p < beat.to);
    }
    for (const fn of scene.listeners) fn(p);
  }

  if (active) applyChrome(active);
}

/** Theme, year and chapter come from the last beat that already started, or from the scene */
function applyChrome(scene: Scene) {
  let theme = scene.el.dataset.theme;
  let year = scene.el.dataset.year;
  for (const beat of scene.beats) {
    if (scene.p < beat.from) continue;
    theme = beat.el.dataset.theme ?? theme;
    year = beat.el.dataset.year ?? year;
  }
  if (theme && root.dataset.theme !== theme) root.dataset.theme = theme;
  if (year) setYear(Number(year));

  const chapter = scene.el.dataset.chapter;
  for (const link of chapterLinks) {
    const current = link.dataset.chapterLink === chapter;
    if (current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}

function setYear(year: number) {
  if (!yearEls.length || year === targetYear) return;
  targetYear = year;
  if (reducedMotion || !shownYear) {
    shownYear = year;
    for (const el of yearEls) el.textContent = String(year);
    return;
  }
  cancelAnimationFrame(yearRaf);
  const step = () => {
    const diff = targetYear - shownYear;
    if (diff === 0) return;
    shownYear += Math.sign(diff) * Math.max(1, Math.round(Math.abs(diff) / 6));
    for (const el of yearEls) el.textContent = String(shownYear);
    yearRaf = requestAnimationFrame(step);
  };
  step();
}

const resizeListeners: (() => void)[] = [];

/** Runs `fn` when the layout viewport really changes, not when mobile toolbars move */
export function onResize(fn: () => void) {
  resizeListeners.push(fn);
}

window.addEventListener('scroll', queue, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth === vw && probe.offsetHeight === vh) return;
  measure();
  for (const scene of scenes) scene.p = -1;
  queue();
  for (const fn of resizeListeners) fn();
});
// Fonts and images can shift scene offsets after the first measure
window.addEventListener('load', () => {
  measure();
  for (const scene of scenes) scene.p = -1;
  queue();
});
measure();
frame();
root.classList.add('scenes-ready');
