/**
 * The storybook star: a soft halo and a four point sparkle with pinched sides.
 * Shared by the opening painting and the sky that runs under the whole page.
 */
export function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, flare: boolean) {
  ctx.globalAlpha = alpha;
  const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
  halo.addColorStop(0, 'rgba(255, 244, 214, 0.9)');
  halo.addColorStop(1, 'rgba(255, 244, 214, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, r * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff8e6';
  const arm = flare ? r * 3.2 : r * 1.8;
  const waist = r * 0.32;
  ctx.beginPath();
  ctx.moveTo(x, y - arm);
  ctx.quadraticCurveTo(x + waist, y - waist, x + arm, y);
  ctx.quadraticCurveTo(x + waist, y + waist, x, y + arm);
  ctx.quadraticCurveTo(x - waist, y + waist, x - arm, y);
  ctx.quadraticCurveTo(x - waist, y - waist, x, y - arm);
  ctx.fill();
}

/** Twinkle: 0 → 1 → 0, at the star's own pace */
export const twinkle = (time: number, speed: number, phase: number) => 0.5 + 0.5 * Math.sin(time * speed + phase);
