import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { type ChartDatum, type ChartSeries, chartValueText } from './chartSeries';
import styles from './LineChartTable.module.css';
import { periodDelta } from './periodDelta';

export interface LineChartTableProps {
  data: ChartDatum[];
  series: ChartSeries[];
  format: (v: number) => string;
}

export const LineChartTable = (props: LineChartTableProps) => {
  const i18n = useI18n();
  const translate = useTranslate();
  const deltaFormat = createMemo(
    () =>
      new Intl.NumberFormat(i18n.locale(), {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        signDisplay: 'always',
      }),
  );

  const singleSeriesKey = () => (props.series.length === 1 ? props.series[0]?.key : undefined);
  const deltaText = (i: number, key: string) => {
    const change = periodDelta(props.data, i, key);
    return change === null ? '—' : deltaFormat().format(change);
  };
  const deltaColor = (i: number, key: string) => {
    const change = periodDelta(props.data, i, key);
    if (change === null) return 'var(--fg-tertiary)';
    return change >= 0 ? 'var(--status-success-fg)' : 'var(--status-danger-fg)';
  };

  return (
    <div class={styles.chartPartTable}>
      <table class={cx(styles.table, typographyClass('body'))}>
        <thead>
          <tr>
            <th>
              <Text as="span" variant="label-sm" tone="inherit">
                {translate('velvet.charts.lineChart.periodHeader')}
              </Text>
            </th>
            <For each={props.series}>
              {(s) => (
                <th class={styles.tablePartNum}>
                  <Text as="span" variant="label-sm" tone="inherit">
                    {s.label}
                  </Text>
                </th>
              )}
            </For>
            <Show when={singleSeriesKey()}>
              <th class={styles.tablePartNum}>
                <Text as="span" variant="label-sm" tone="inherit">
                  Δ
                </Text>
              </th>
            </Show>
          </tr>
        </thead>
        <tbody>
          <For each={props.data}>
            {(d, i) => (
              <tr>
                <td>
                  <Text as="span" variant="body" tone="inherit">
                    {d.label}
                  </Text>
                </td>
                <For each={props.series}>
                  {(s) => (
                    <td class={styles.tablePartNum}>
                      <Text as="span" variant="body" tone="inherit" tabular>
                        {chartValueText(d, s.key, props.format, translate('velvet.charts.chartSeries.noValue'))}
                      </Text>
                    </td>
                  )}
                </For>
                <Show when={singleSeriesKey()}>
                  {(key) => (
                    <td class={styles.tablePartNum} style={{ color: deltaColor(i(), key()) }}>
                      <Text as="span" variant="body" tone="inherit" tabular>
                        {deltaText(i(), key())}
                      </Text>
                    </td>
                  )}
                </Show>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};
