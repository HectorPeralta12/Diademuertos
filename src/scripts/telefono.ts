/**
 * Phones get lighter paintings and canvases. Decoded, the full size ones took
 * hundreds of megabytes and Safari reloaded the page mid-scroll when it ran out.
 */
export const PHONE = '(max-width: 1023px)';
export const DESKTOP = '(min-width: 1024px)';

/** Pixel ratio for canvases: dust and light stay soft, so phones draw at 1.5 at most */
export const canvasDpr = () => Math.min(window.devicePixelRatio || 1, window.matchMedia(PHONE).matches ? 1.5 : 2);
