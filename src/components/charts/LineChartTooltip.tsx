import { For } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { type ChartDatum, type ChartSeries, chartValueText, colorOf } from './chartSeries';
import styles from './LineChartTooltip.module.css';

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
    <div
      class={cx(styles.chartPartTip, typographyClass('caption'))}
      style={{ left: `${props.left}px`, top: `${props.top}px` }}
      aria-hidden="true"
    >
      <Text as="div" variant="label-sm" tone="inherit" class={styles.chartPartTipT}>
        {props.datum.label}
      </Text>
      <For each={props.series}>
        {(s, k) => (
          <Text as="div" variant="caption" tone="inherit" class={styles.chartPartTipR}>
            <i style={{ background: colorOf(s, k()) }} />
            {s.label}
            <Text as="b" variant="label-sm" tone="inherit">
              {chartValueText(props.datum, s.key, props.format, translate('velvet.charts.chartSeries.noValue'))}
            </Text>
          </Text>
        )}
      </For>
    </div>
  );
};
