import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { type ChartDatum, type ChartSeries, valueOf } from './chartSeries';
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
    <div class="vui-chart__table">
      <table class="vui-table">
        <thead>
          <tr>
            <th>{translate('velvet.charts.lineChart.periodHeader')}</th>
            <For each={props.series}>{(s) => <th class="vui-table__num">{s.label}</th>}</For>
            <Show when={singleSeriesKey()}>
              <th class="vui-table__num">Δ</th>
            </Show>
          </tr>
        </thead>
        <tbody>
          <For each={props.data}>
            {(d, i) => (
              <tr>
                <td>{d.label}</td>
                <For each={props.series}>
                  {(s) => <td class="vui-table__num">{props.format(valueOf(d, s.key))}</td>}
                </For>
                <Show when={singleSeriesKey()}>
                  {(key) => (
                    <td class="vui-table__num" style={{ color: deltaColor(i(), key()) }}>
                      {deltaText(i(), key())}
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
