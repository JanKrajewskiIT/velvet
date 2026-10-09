import { For } from 'solid-js';

import { type ChartSeries, colorOf } from './chartSeries';

export interface ChartLegendProps {
  series: ChartSeries[];
}

export const ChartLegend = (props: ChartLegendProps) => (
  <div class="vui-chart__legend">
    <For each={props.series}>
      {(s, k) => (
        <span class="vui-chart__lg">
          <i style={{ background: colorOf(s, k()) }} />
          {s.label}
        </span>
      )}
    </For>
  </div>
);
