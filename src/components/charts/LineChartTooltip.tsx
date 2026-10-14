import { For } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { type ChartDatum, type ChartSeries, chartValueText, colorOf } from './chartSeries';

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
    <div class="vui-chart__tip" style={{ left: `${props.left}px`, top: `${props.top}px` }} aria-hidden="true">
      <div class="vui-chart__tip-t">{props.datum.label}</div>
      <For each={props.series}>
        {(s, k) => (
          <div class="vui-chart__tip-r">
            <i style={{ background: colorOf(s, k()) }} />
            {s.label}
            <b>{chartValueText(props.datum, s.key, props.format, translate('velvet.charts.chartSeries.noValue'))}</b>
          </div>
        )}
      </For>
    </div>
  );
};
