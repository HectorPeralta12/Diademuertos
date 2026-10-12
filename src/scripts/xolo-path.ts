/**
 * The Xolo's outline in the opening illustration (1672 × 941 pixels). It comes
 * from the same cut out as public/images/xolo-mascara.png (see
 * scripts/xolo-mask.mjs), so the gold line follows the painted dog exactly.
 *
 * `smooth` turns the contour into a Catmull-Rom curve so the line reads as
 * drawn, not plotted.
 */
import contour from './xolo-contorno.json';

/** The crop the mask covers, in painting pixels */
export const XOLO_BOX = { x: 1050, y: 190, w: 520, h: 680 };

const r = (n: number) => Math.round(n * 10) / 10;

/** Closed Catmull-Rom spline through the points, as SVG path data */
export function smooth(points: [number, number][], tension = 0.5) {
  const n = points.length;
  const at = (i: number) => points[(i + n) % n];
  let d = `M${r(points[0][0])} ${r(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);
    const k = tension / 3;
    d += ` C${r(x1 + (x2 - x0) * k)} ${r(y1 + (y2 - y0) * k)} ${r(x2 - (x3 - x1) * k)} ${r(y2 - (y3 - y1) * k)} ${r(x2)} ${r(y2)}`;
  }
  return d + 'Z';
}

export const XOLO_D = smooth(contour as [number, number][]);
