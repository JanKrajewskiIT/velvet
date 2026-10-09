import { For } from 'solid-js';

import { type ChartDatum, type ChartSeries, colorOf, valueOf } from './chartSeries';

export interface LineChartTooltipProps {
  datum: ChartDatum;
  series: ChartSeries[];
  format: (v: number) => string;
  left: number;
  top: number;
}

export const LineChartTooltip = (props: LineChartTooltipProps) => (
  <div class="vui-chart__tip" style={{ left: `${props.left}px`, top: `${props.top}px` }} aria-hidden="true">
    <div class="vui-chart__tip-t">{props.datum.label}</div>
    <For each={props.series}>
      {(s, k) => (
        <div class="vui-chart__tip-r">
          <i style={{ background: colorOf(s, k()) }} />
          {s.label}
          <b>{props.format(valueOf(props.datum, s.key))}</b>
        </div>
      )}
    </For>
  </div>
);
