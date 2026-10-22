import { type ChartDatum, valueOf } from './chartSeries';
import type { Point } from './linePath';

/** Missing measurements divide a series into independent paths. */
export const lineSegments = (
  data: ChartDatum[],
  key: string,
  point: (index: number, value: number) => Point,
): Point[][] => {
  const groups: Point[][] = [];
  let current: Point[] = [];
  data.forEach((datum, index) => {
    const value = valueOf(datum, key);
    if (value === undefined) {
      current = [];
      return;
    }
    if (!current.length) groups.push(current);
    current.push(point(index, value));
  });
  return groups;
};
