import { createMemo } from 'solid-js';

import { type ChartDatum, type ChartSeries, colorOf, valueOf } from './chartSeries';
import { linePath, smoothPath } from './linePath';
import { lineSegments } from './lineSegments';
import { numericScale } from './numericScale';

export const LINE_PAD = { l: 40, r: 12, t: 12, b: 28 } as const;
const MIN_LABEL_SPACING = 64;

interface LineGeometryOptions {
  data: () => ChartDatum[];
  series: () => ChartSeries[];
  width: () => number;
  height: () => number;
  curved: () => boolean;
  area: () => boolean;
  includeZero: () => boolean;
  gradientId: string;
}

export const createLineGeometry = (options: LineGeometryOptions) => {
  const innerWidth = () => Math.max(0, options.width() - LINE_PAD.l - LINE_PAD.r);
  const innerHeight = () => Math.max(0, options.height() - LINE_PAD.t - LINE_PAD.b);
  const lastIndex = () => options.data().length - 1;

  const scale = createMemo(() =>
    numericScale(
      options.data().flatMap((datum) =>
        options.series().flatMap((series) => {
          const value = valueOf(datum, series.key);
          return value === undefined ? [] : [value];
        }),
      ),
      4,
      options.includeZero(),
    ),
  );
  const ticks = () => scale().ticks;
  const x = (i: number) =>
    LINE_PAD.l + (options.data().length < 2 ? innerWidth() / 2 : (i / lastIndex()) * innerWidth());
  const y = (v: number) => LINE_PAD.t + innerHeight() * (1 - scale().position(v));
  const labelEvery = () => Math.ceil(options.data().length / Math.max(2, Math.floor(innerWidth() / MIN_LABEL_SPACING)));
  const baseline = () => LINE_PAD.t + innerHeight();
  const areaBaseline = () => {
    const first = ticks()[0] ?? 0;
    const last = ticks().at(-1) ?? 1;
    return y(first < 0 && last > 0 ? 0 : first);
  };

  const paths = createMemo(() =>
    options.series().map((s, k) => {
      const groups = lineSegments(options.data(), s.key, (index, value) => [x(index), y(value)]);
      const parts = groups.map((group) => {
        const path = options.curved() ? smoothPath(group) : linePath(group);
        const first = group[0];
        const last = group.at(-1);
        const fill =
          k === 0 && options.area() && first && last && group.length > 1
            ? `${path}L${last[0]},${areaBaseline()}L${first[0]},${areaBaseline()}Z`
            : '';
        return { path, fill };
      });
      const line = parts.map((part) => part.path).join('');
      const fill = parts.map((part) => part.fill).join('') || undefined;
      return { key: s.key, color: colorOf(s, k), line, fill, gradient: `${options.gradientId}-${k}` };
    }),
  );

  return { innerWidth, lastIndex, ticks, x, y, labelEvery, baseline, paths } as const;
};

export type LineGeometry = ReturnType<typeof createLineGeometry>;
