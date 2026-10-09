import { createMemo } from 'solid-js';

import { niceTicks } from './chartScale';
import { type ChartDatum, type ChartSeries, colorOf, valueOf } from './chartSeries';
import { linePath, type Point, smoothPath } from './linePath';

export const LINE_PAD = { l: 40, r: 12, t: 12, b: 28 } as const;
const MIN_LABEL_SPACING = 64;

interface LineGeometryOptions {
  data: () => ChartDatum[];
  series: () => ChartSeries[];
  width: () => number;
  height: () => number;
  curved: () => boolean;
  area: () => boolean;
  gradientId: string;
}

export const createLineGeometry = (options: LineGeometryOptions) => {
  const innerWidth = () => options.width() - LINE_PAD.l - LINE_PAD.r;
  const innerHeight = () => options.height() - LINE_PAD.t - LINE_PAD.b;
  const lastIndex = () => options.data().length - 1;

  const ticks = createMemo(() =>
    niceTicks(Math.max(1, ...options.data().flatMap((d) => options.series().map((s) => valueOf(d, s.key))))),
  );
  const top = () => ticks().at(-1) ?? 1;
  const x = (i: number) =>
    LINE_PAD.l + (options.data().length < 2 ? innerWidth() / 2 : (i / lastIndex()) * innerWidth());
  const y = (v: number) => LINE_PAD.t + innerHeight() - (v / top()) * innerHeight();
  const labelEvery = () => Math.ceil(options.data().length / Math.max(2, Math.floor(innerWidth() / MIN_LABEL_SPACING)));
  const baseline = () => LINE_PAD.t + innerHeight();

  const paths = createMemo(() =>
    options.series().map((s, k) => {
      const points: Point[] = options.data().map((d, i) => [x(i), y(valueOf(d, s.key))]);
      const line = options.curved() ? smoothPath(points) : linePath(points);
      const first = points[0];
      const last = points.at(-1);
      const fill =
        k === 0 && options.area() && first && last && points.length > 1
          ? `${line}L${last[0]},${baseline()}L${first[0]},${baseline()}Z`
          : undefined;
      return { key: s.key, color: colorOf(s, k), line, fill, gradient: `${options.gradientId}-${k}` };
    }),
  );

  return { innerWidth, lastIndex, ticks, x, y, labelEvery, baseline, paths } as const;
};

export type LineGeometry = ReturnType<typeof createLineGeometry>;
