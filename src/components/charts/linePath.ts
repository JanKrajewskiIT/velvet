export type Point = readonly [number, number];

/** Straight segments through `points`. */
export const linePath = (points: Point[]): string =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');

/** Horizontal-tangent cubic curve through `points`; falls back to straight segments below three points. */
export const smoothPath = (points: Point[]): string => {
  const [first] = points;
  if (!first || points.length < 3) return linePath(points);
  let d = `M${first[0]},${first[1]}`;
  points.slice(1).forEach(([x1, y1], i) => {
    const [x0, y0] = points[i] ?? first;
    const mid = (x0 + x1) / 2;
    d += `C${mid},${y0} ${mid},${y1} ${x1},${y1}`;
  });
  return d;
};
