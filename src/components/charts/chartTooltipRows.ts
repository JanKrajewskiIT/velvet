import { type ChartDatum, type ChartSeries, chartValueText, colorOf } from './chartSeries';
import type { ChartTooltipRow } from './ChartTooltip';

export const chartTooltipRows = (
  datum: ChartDatum,
  series: readonly ChartSeries[],
  format: (value: number) => string,
  missing: string,
): ChartTooltipRow[] =>
  series.map((item, index) => ({
    key: item.key,
    label: item.label,
    color: colorOf(item, index),
    value: chartValueText(datum, item.key, format, missing),
  }));
