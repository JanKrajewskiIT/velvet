import { useTranslate } from '../../i18n/useTranslate';
import { type ChartDatum, chartValueText } from '../charts/chartSeries';
import { ChartTooltip } from '../charts/ChartTooltip';

export interface RangeBandTooltipProps {
  datum: ChartDatum;
  keys: { lo: string; hi: string; mid: string; value: string };
  labels: { band: string; mid: string; value: string };
  format: (value: number) => string;
  left: number;
  top: number;
}

export const RangeBandTooltip = (props: RangeBandTooltipProps) => {
  const translate = useTranslate();
  const value = (key: string) =>
    chartValueText(props.datum, key, props.format, translate('velvet.charts.chartSeries.noValue'));
  return (
    <ChartTooltip
      x={props.left}
      y={props.top}
      title={props.datum.label}
      rows={[
        { key: 'value', color: 'var(--dv-1)', label: props.labels.value, value: value(props.keys.value) },
        { key: 'median', color: 'var(--chart-median)', label: props.labels.mid, value: value(props.keys.mid) },
        {
          key: 'band',
          swatch: 'band',
          label: props.labels.band,
          value: `${value(props.keys.lo)} … ${value(props.keys.hi)}`,
        },
      ]}
      live={false}
    />
  );
};
