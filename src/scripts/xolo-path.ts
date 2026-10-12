/**
 * The Xolo's silhouette, traced on hero-pictorico-v1.png (1672 × 941). The same
 * outline clips the painted dog out of the illustration and draws its spirit,
 * so the two line up exactly during the crossing.
 *
 * Points go clockwise from the tip of the nose; `smooth` turns them into a
 * Catmull-Rom curve so the line reads as drawn, not plotted.
 */

const O = { x: 1090, y: 230 };

const RAW: [number, number][] = [
  [22, 152], [32, 142], [50, 132], [80, 115], [115, 97],
  // left ear
  [117, 90], [134, 40], [165, -2], [168, 30], [164, 62], [172, 76],
  // right ear
  [182, 76], [205, 35], [225, 12], [231, 50], [226, 100], [210, 135],
  // neck, back and haunch
  [212, 165], [215, 190], [225, 240], [238, 285], [256, 330], [278, 370], [300, 410], [322, 450], [338, 490], [342, 520], [338, 545],
  // tail
  [350, 560], [378, 556], [398, 535], [407, 512], [410, 520], [402, 548], [380, 572], [350, 582],
  // paws on the stone
  [320, 585], [260, 588], [200, 590], [150, 590], [100, 588], [88, 578],
  // front leg and chest
  [105, 560], [122, 530], [133, 490], [138, 440], [134, 390], [118, 330], [112, 288], [109, 250], [104, 215],
  // throat and under the jaw
  [97, 190], [65, 182], [35, 167],
];

export const XOLO_POINTS = RAW.map(([x, y]) => [x + O.x, y + O.y] as [number, number]);

/** Bounding box of the dog in the painting */
export const XOLO_BOX = { x: 1100, y: 230, w: 420, h: 600 };

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

export const XOLO_D = smooth(XOLO_POINTS);
