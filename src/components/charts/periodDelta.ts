import { type ChartDatum, valueOf } from './chartSeries';

/** Change against the previous period; `null` for the first period or a zero base. */
export const periodDelta = (data: ChartDatum[], i: number, key: string): number | null => {
  const previous = data[i - 1];
  const current = data[i];
  if (!previous || !current) return null;
  const base = valueOf(previous, key);
  const value = valueOf(current, key);
  if (base === undefined || base === 0 || value === undefined) return null;
  const delta = (value - base) / Math.abs(base);
  return Number.isFinite(delta) ? delta : null;
};
