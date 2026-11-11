import type { ChartLegendItem } from './ChartLegend';
import { type ChartSeries, colorOf } from './chartSeries';

export const chartLegendItems = (series: readonly ChartSeries[]): ChartLegendItem[] =>
  series.map((item, index) => ({ ...item, color: colorOf(item, index) }));
