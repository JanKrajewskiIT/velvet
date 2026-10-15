import { For } from 'solid-js';

import { Text } from '../primitives/Text';
import styles from './ChartLegend.module.css';
import { type ChartSeries, colorOf } from './chartSeries';

export interface ChartLegendProps {
  series: ChartSeries[];
}

export const ChartLegend = (props: ChartLegendProps) => (
  <div class={styles.chartPartLegend}>
    <For each={props.series}>
      {(s, k) => (
        <Text as="span" variant="caption" tone="secondary" class={styles.chartPartLg}>
          <i style={{ background: colorOf(s, k()) }} />
          {s.label}
        </Text>
      )}
    </For>
  </div>
);
