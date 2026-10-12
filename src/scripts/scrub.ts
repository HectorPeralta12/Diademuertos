/**
 * Scroll-scrubbed video. The clip is fetched once into a Blob (always seekable,
 * even on hosts without range requests). `seek(t)` sets a target from 0 to 1;
 * the playhead eases toward it and never queues a seek while the decoder is busy.
 */

import { clamp, reducedMotion } from './scenes';

export interface Scrub {
  readonly ready: boolean;
  load(): void;
  seek(t: number): void;
}

export function scrub(video: HTMLVideoElement, src: string, onReady?: () => void): Scrub {
  let loading = false;
  let ready = false;
  let cur = 0;
  let target = 0;
  let raf = 0;

  function tick() {
    cancelAnimationFrame(raf);
    if (!ready) return;
    const d = target - cur;
    cur = Math.abs(d) > 0.001 ? cur + d * 0.2 : target;
    if (!video.seeking) {
      const t = clamp(cur, 0, 0.999) * (video.duration || 0);
      if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
    }
    if (cur !== target || video.seeking) raf = requestAnimationFrame(tick);
  }

  return {
    get ready() {
      return ready;
    },
    load() {
      if (loading || reducedMotion) return;
      loading = true;
      fetch(src)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
        .then((blob) => {
          video.addEventListener(
            'loadeddata',
            () => {
              ready = true;
              cur = target;
              video.currentTime = clamp(cur, 0, 0.999) * (video.duration || 0);
              onReady?.();
            },
            { once: true },
          );
          video.src = URL.createObjectURL(blob);
          video.load();
        })
        .catch(() => (loading = false));
    },
    seek(t: number) {
      target = clamp(t);
      tick();
    },
  };
}
