import { type ChartDatum, valueOf } from './chartSeries';

/** Change against the previous period; `null` for the first period or a zero base. */
export const periodDelta = (data: ChartDatum[], i: number, key: string): number | null => {
  const previous = data[i - 1];
  const current = data[i];
  if (!previous || !current) return null;
  const base = valueOf(previous, key);
  return base ? (valueOf(current, key) - base) / base : null;
};
