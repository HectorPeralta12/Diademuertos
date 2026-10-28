/**
 * The site can live under a sub-path (GitHub Pages serves it at /Diademuertos/),
 * so every path to a file in public/ goes through here.
 */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string) => `${BASE}${path}`;
