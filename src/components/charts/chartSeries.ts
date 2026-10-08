import type { useTranslate } from '../../i18n/useTranslate';
import { seriesColor } from './chartScale';

export interface ChartSeries {
  key: string;
  label: string;
  /** Defaults to --dv-N in order. */
  color?: string;
}

/** One category / period: a `label` plus one numeric value per series key. */
export type ChartDatum = { label: string } & Record<string, string | number | null | undefined>;

export const defaultSeries = (translate: ReturnType<typeof useTranslate>): ChartSeries[] => [
  { key: 'value', label: translate('velvet.charts.chartSeries.valueLabel') },
];

export const valueOf = (datum: ChartDatum, key: string): number => Number(datum[key]) || 0;

export const colorOf = (series: ChartSeries, index: number): string => series.color ?? seriesColor(index);
