import { type ChartDatum, valueOf } from './chartSeries';
import type { Point } from './linePath';

/** Missing measurements divide a series into independent paths. */
export const valueSegments = (
  values: Iterable<number | undefined>,
  point: (index: number, value: number) => Point,
): Point[][] => {
  const groups: Point[][] = [];
  let current: Point[] = [];
  let index = 0;
  for (const value of values) {
    if (value === undefined) {
      current = [];
    } else {
      if (!current.length) groups.push(current);
      current.push(point(index, value));
    }
    index += 1;
  }
  return groups;
};

export const lineSegments = (
  data: ChartDatum[],
  key: string,
  point: (index: number, value: number) => Point,
): Point[][] =>
  valueSegments(
    data.map((datum) => valueOf(datum, key)),
    point,
  );
