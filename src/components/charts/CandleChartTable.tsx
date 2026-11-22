import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './CandleChartTable.module.css';
import type { CandleDatum, CandleMarker, CandleOverlay, CandleReference } from './candleData';
import { type CandleLabels, markersAt, overlayText, PRICE_FIELDS, priceText } from './candleRows';

export interface CandleChartTableProps {
  candles: readonly CandleDatum[];
  overlays: readonly CandleOverlay[];
  markers: readonly CandleMarker[];
  references: readonly CandleReference[];
  selectedIndex?: number;
  format: (value: number) => string;
  labels: CandleLabels;
}

export const CandleChartTable = (props: CandleChartTableProps) => {
  const translate = useTranslate();
  const markerText = (index: number) =>
    markersAt(props.markers, index)
      .map((marker) => `${marker.label} ${props.format(marker.price)}`)
      .join(', ');
  const columns = () => PRICE_FIELDS.length + props.overlays.length + (props.markers.length > 0 ? 1 : 0);
  const heading = (text: string, numeric = true) => (
    <th class={numeric ? styles.tablePartNum : undefined}>
      <Text as="span" variant="label-sm" tone="inherit">
        {text}
      </Text>
    </th>
  );

  return (
    <div class={styles.chartPartTable}>
      <table class={cx(styles.table, typographyClass('body'))}>
        <thead>
          <tr>
            {heading(translate('velvet.charts.candleChart.periodHeader'), false)}
            <For each={PRICE_FIELDS}>{(field) => heading(props.labels[field])}</For>
            <For each={props.overlays}>{(overlay) => heading(overlay.label)}</For>
            <Show when={props.markers.length > 0}>
              {heading(translate('velvet.charts.candleChart.markersHeader'), false)}
            </Show>
          </tr>
        </thead>
        <tbody>
          <For each={props.candles}>
            {(datum, index) => (
              <tr aria-current={props.selectedIndex === index() ? 'true' : undefined}>
                <td>
                  <Text as="span" variant="body" tone="inherit">
                    {datum.label}
                  </Text>
                </td>
                <For each={PRICE_FIELDS}>
                  {(field) => (
                    <td class={styles.tablePartNum}>
                      <Text as="span" variant="body" tone="inherit" tabular>
                        {priceText(datum, field, props.format, props.labels.missing)}
                      </Text>
                    </td>
                  )}
                </For>
                <For each={props.overlays}>
                  {(overlay) => (
                    <td class={styles.tablePartNum}>
                      <Text as="span" variant="body" tone="inherit" tabular>
                        {overlayText(overlay, index(), props.format, props.labels.missing)}
                      </Text>
                    </td>
                  )}
                </For>
                <Show when={props.markers.length > 0}>
                  <td>
                    <Text as="span" variant="body" tone="inherit">
                      {markerText(index())}
                    </Text>
                  </td>
                </Show>
              </tr>
            )}
          </For>
        </tbody>
        <Show when={props.references.length > 0}>
          <tfoot>
            <For each={props.references}>
              {(reference) => (
                <tr>
                  <th scope="row">
                    <Text as="span" variant="label-sm" tone="inherit">
                      {reference.label}
                    </Text>
                  </th>
                  <td class={styles.tablePartNum} colspan={columns()}>
                    <Text as="span" variant="body" tone="inherit" tabular>
                      {props.format(reference.price)}
                    </Text>
                  </td>
                </tr>
              )}
            </For>
          </tfoot>
        </Show>
      </table>
    </div>
  );
};
