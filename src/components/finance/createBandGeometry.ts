import { createMemo } from 'solid-js';

import { type ChartDatum, valueOf } from '../charts/chartSeries';
import { linePath, type Point } from '../charts/linePath';
import { lineSegments } from '../charts/lineSegments';
import { numericScale } from '../charts/numericScale';

export const BAND_PAD = { l: 44, r: 12, t: 12, b: 28 } as const;

interface BandGeometryOptions {
  data: () => ChartDatum[];
  keys: () => { lo: string; hi: string; mid: string; value: string };
  width: () => number;
  height: () => number;
}

export const createBandGeometry = (options: BandGeometryOptions) => {
  const innerWidth = () => Math.max(0, options.width() - BAND_PAD.l - BAND_PAD.r);
  const innerHeight = () => Math.max(0, options.height() - BAND_PAD.t - BAND_PAD.b);
  const lastIndex = () => options.data().length - 1;
  const scale = createMemo(() =>
    numericScale(
      options.data().flatMap((datum) =>
        Object.values(options.keys()).flatMap((key) => {
          const value = valueOf(datum, key);
          return value === undefined ? [] : [value];
        }),
      ),
    ),
  );
  const x = (index: number) => BAND_PAD.l + (lastIndex() < 1 ? innerWidth() / 2 : (index / lastIndex()) * innerWidth());
  const y = (value: number) => BAND_PAD.t + innerHeight() * (1 - scale().position(value));
  const line = (key: string) =>
    lineSegments(options.data(), key, (index, value) => [index, value])
      .map((group) => linePath(group.map(([index, value]) => [x(index), y(value)])))
      .join('');
  const paths = createMemo(() => {
    const keys = options.keys();
    const groups: { upper: Point[]; lower: Point[] }[] = [];
    let current: (typeof groups)[number] | undefined;
    options.data().forEach((datum, index) => {
      const lo = valueOf(datum, keys.lo);
      const hi = valueOf(datum, keys.hi);
      if (lo === undefined || hi === undefined) {
        current = undefined;
        return;
      }
      if (!current) {
        current = { upper: [], lower: [] };
        groups.push(current);
      }
      current.upper.push([x(index), y(hi)]);
      current.lower.push([x(index), y(lo)]);
    });
    const band = groups
      .filter((group) => group.upper.length > 1)
      .map((group) => `${linePath(group.upper)}${linePath([...group.lower].reverse()).replace(/^M/u, 'L')}Z`)
      .join('');
    return { band, lo: line(keys.lo), hi: line(keys.hi), mid: line(keys.mid), value: line(keys.value) };
  });
  const outside = createMemo(() =>
    options.data().flatMap((datum, index) => {
      const keys = options.keys();
      const value = valueOf(datum, keys.value);
      const lo = valueOf(datum, keys.lo);
      const hi = valueOf(datum, keys.hi);
      return value !== undefined && lo !== undefined && hi !== undefined && (value < lo || value > hi)
        ? [{ index, value }]
        : [];
    }),
  );
  const ticks = () => scale().ticks;
  const labelEvery = () => Math.max(1, Math.ceil(options.data().length / Math.max(2, Math.floor(innerWidth() / 64))));
  return { innerWidth, innerHeight, lastIndex, ticks, x, y, paths, outside, labelEvery };
};
