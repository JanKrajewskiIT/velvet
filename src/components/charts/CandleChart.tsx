import { createSignal, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { booleanAttribute } from '../../utils/booleanAttribute';
import { cx } from '../../utils/cx';
import { clamp } from '../../utils/math';
import { positiveNumber } from '../../utils/numericOption';
import { withDefaults } from '../../utils/props';
import { Button } from '../actions/Button';
import { typographyClass } from '../primitives/typography';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import styles from './CandleChart.module.css';
import { CandleChartAxes } from './CandleChartAxes';
import { CandleChartLayers } from './CandleChartLayers';
import { CandleChartTable } from './CandleChartTable';
import {
  type CandleDatum,
  type CandleMarker,
  type CandleOverlay,
  type CandleReference,
  overlayColor,
} from './candleData';
import { candleRows } from './candleRows';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';
import { createCandleGeometry } from './createCandleGeometry';
import { createCandleLabels } from './createCandleLabels';
import { createCandleSelect } from './createCandleSelect';
import { createChartFormat } from './createChartFormat';
import { createLineCursor } from './createLineCursor';
import { LINE_PAD } from './createLineGeometry';
import { createWidth } from './createWidth';

const TIP_MARGIN = 70;
const NO_OVERLAYS: readonly CandleOverlay[] = Object.freeze([]);
const NO_MARKERS: readonly CandleMarker[] = Object.freeze([]);
const NO_REFERENCES: readonly CandleReference[] = Object.freeze([]);

export interface CandleChartProps {
  /** One entry per period. A candle with a missing price leaves a gap. */
  candles: readonly CandleDatum[];
  /** Lines drawn over the candles, one value per candle. */
  overlays?: readonly CandleOverlay[];
  /** Points pinned to a candle at a price, coloured by `tone`. */
  markers?: readonly CandleMarker[];
  /** Dashed horizontal price levels labelled at the right edge; they widen the price scale. */
  references?: readonly CandleReference[];
  /** Index of the candle to highlight; exposed as the current row of the table. */
  selectedIndex?: number;
  /** Fired with the candle index on click, or Enter / Space on the focused crosshair candle. */
  onSelect?: (index: number) => void;
  /** Draw rising candles with an unfilled body. @default false */
  hollowRising?: boolean;
  /** Draw a dashed placeholder at the position of a candle with a missing price. @default false */
  showGaps?: boolean;
  /** px. @default 320 */
  height?: number;
  /** Axis + tooltip formatter. @default compact numbers in the active locale (1.2K) */
  format?: (value: number) => string;
  /** Start in table view. */
  showTable?: boolean;
  /** Accessible name. @default localized "Candlestick chart" */
  label?: string;
  class?: string;
}

/** Candlestick (OHLC) chart with overlay lines and markers. Mouse, or focus + ←→ Home End, moves the crosshair and the candle is announced. The "Table" toggle shows the same data as an accessible table. */
export const CandleChart = (props: CandleChartProps) => {
  const merged = withDefaults(
    {
      height: 320,
      overlays: NO_OVERLAYS,
      markers: NO_MARKERS,
      references: NO_REFERENCES,
      hollowRising: false,
      showGaps: false,
    } satisfies Partial<CandleChartProps>,
    props,
  );
  const translate = useTranslate();
  const format = createChartFormat(() => merged.format);
  const { ref, width } = createWidth();
  const [table, setTable] = createSignal(untrack(() => props.showTable ?? false));
  const height = () => positiveNumber(merged.height, 320);
  const label = () => merged.label ?? translate('velvet.charts.candleChart.label');
  const labels = createCandleLabels();
  const geometry = createCandleGeometry({
    candles: () => merged.candles,
    overlays: () => merged.overlays,
    markers: () => merged.markers,
    references: () => merged.references,
    width,
    height,
  });
  const { x } = geometry;
  const cursor = createLineCursor(geometry);
  const hover = cursor.hover;
  const hovered = () => (hover() >= 0 ? merged.candles[hover()] : undefined);
  const rows = (datum: CandleDatum) => candleRows(datum, hover(), merged.overlays, merged.markers, format, labels());
  const announcement = (datum: CandleDatum) =>
    `${datum.label}: ${rows(datum)
      .map((row) => `${row.label} ${row.value}`)
      .join(', ')}`;
  const { onClick, onKeyDown } = createCandleSelect(cursor, (index) => merged.onSelect?.(index));
  const legend = () =>
    merged.overlays.map((overlay, index) => ({
      key: overlay.id,
      label: overlay.label,
      color: overlayColor(overlay, index),
    }));

  return (
    <div ref={ref} class={cx(typographyClass('body'), styles.chart, merged.class)}>
      <div class={styles.barTop}>
        <Show when={merged.overlays.length > 0} fallback={<span />}>
          <ChartLegend items={legend()} />
        </Show>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={table() ? 'bar-chart' : 'list'}
          aria-pressed={booleanAttribute(table())}
          onClick={() => setTable(!table())}
        >
          {table() ? translate('velvet.charts.candleChart.chart') : translate('velvet.charts.candleChart.table')}
        </Button>
      </div>
      <Show
        when={!table()}
        fallback={
          <CandleChartTable
            candles={merged.candles}
            overlays={merged.overlays}
            markers={merged.markers}
            references={merged.references}
            selectedIndex={merged.selectedIndex}
            format={format}
            labels={labels()}
          />
        }
      >
        <div class={styles.plot} style={{ height: `${height()}px` }}>
          <svg
            width={width()}
            height={height()}
            role="img"
            aria-label={translate('velvet.charts.candleChart.instructions', { label: label() })}
            tabindex={0}
            onMouseMove={cursor.move}
            onMouseLeave={cursor.clear}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={cursor.focus}
            onBlur={cursor.clear}
          >
            <CandleChartAxes
              geometry={geometry}
              candles={merged.candles}
              width={width()}
              height={height()}
              hover={hover()}
              format={format}
            />
            <CandleChartLayers
              geometry={geometry}
              width={width()}
              hollowRising={merged.hollowRising}
              showGaps={merged.showGaps}
              selectedIndex={merged.selectedIndex}
            />
            <Show when={hovered()}>
              <line x1={x(hover())} x2={x(hover())} y1={LINE_PAD.t} y2={geometry.baseline()} class={styles.cross} />
            </Show>
          </svg>
          <Show when={hovered()}>
            {(datum) => (
              <ChartTooltip
                x={clamp(x(hover()), TIP_MARGIN, Math.max(TIP_MARGIN, width() - TIP_MARGIN))}
                y={LINE_PAD.t}
                title={datum().label}
                rows={rows(datum())}
                live={false}
              />
            )}
          </Show>
          <VisuallyHidden role="status">
            <Show when={hovered()}>{(datum) => announcement(datum())}</Show>
          </VisuallyHidden>
        </div>
      </Show>
    </div>
  );
};
