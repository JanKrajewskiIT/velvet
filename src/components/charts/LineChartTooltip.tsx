import { useTranslate } from '../../i18n/useTranslate';
import type { ChartDatum, ChartSeries } from './chartSeries';
import { ChartTooltip } from './ChartTooltip';
import { chartTooltipRows } from './chartTooltipRows';

export interface LineChartTooltipProps {
  datum: ChartDatum;
  series: ChartSeries[];
  format: (v: number) => string;
  left: number;
  top: number;
}

export const LineChartTooltip = (props: LineChartTooltipProps) => {
  const translate = useTranslate();
  return (
    <ChartTooltip
      x={props.left}
      y={props.top}
      title={props.datum.label}
      rows={chartTooltipRows(props.datum, props.series, props.format, translate('velvet.charts.chartSeries.noValue'))}
      live={false}
    />
  );
};
