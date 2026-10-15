import { useI18n } from '@jankrajewskiit/i18n';
import { For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { ymd } from '../../utils/date';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { createHeatmapCursor } from './createHeatmapCursor';
import { createHeatmapGrid } from './createHeatmapGrid';
import { createHeatmapLabels, MIN_MONTH_LABEL_GAP } from './createHeatmapLabels';
import styles from './Heatmap.module.css';
import { HEATMAP_COLORS } from './heatmapColors';
import { HeatmapTooltip } from './HeatmapTooltip';
import type { HeatmapConfig, HeatmapProps } from './heatmapTypes';

export type { HeatmapCell, HeatmapPoint, HeatmapProps } from './heatmapTypes';

/** Calendar density grid — "how much, when". Weeks are columns, weekdays rows; level colours come from --dv-seq-*. Hover or arrow-key through days (←→ week, ↑↓ day, Home/End); each cell has a full spoken label with its value. */
export const Heatmap = (props: HeatmapProps) => {
  const merged: HeatmapConfig = mergeProps(
    {
      weeks: 20,
      weekStart: 1,
      colors: HEATMAP_COLORS,
      cellMax: 16,
      showTotal: true,
      showLegend: true,
    } satisfies Partial<HeatmapProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const locale = () => merged.locale ?? i18n.locale();
  const label = () => merged.label ?? translate('velvet.charts.heatmap.label');
  const { firstDay, lastIndex, grid, colorOf } = createHeatmapGrid(merged);
  const { dateFormat, monthLabels, weekdayLabels } = createHeatmapLabels(merged, locale, firstDay);
  const { hover, setHover, cellRefs, tabStop, reveal, onKeyDown } = createHeatmapCursor(lastIndex);

  const format = (v: number) => (merged.format ? merged.format(v) : v.toLocaleString(locale()));
  const unitSuffix = () => (merged.unit ? ` ${merged.unit}` : '');
  const say = (date: Date, value: number) => `${dateFormat().format(date)}: ${format(value)}${unitSuffix()}`;
  const columns = () => ({ 'grid-template-columns': `repeat(${merged.weeks}, minmax(0,1fr))` });

  const tip = () => {
    const cell = grid().cells[hover()];
    const element = cellRefs[hover()];
    return hover() >= 0 && cell && element
      ? { cell, left: element.offsetLeft + element.offsetWidth / 2, top: element.offsetTop }
      : undefined;
  };

  return (
    <div
      class={cx(typographyClass('body'), styles.chart, styles.heatWrap, merged.class)}
      role="group"
      aria-label={label()}
    >
      <Show when={merged.showTotal || merged.showLegend}>
        <div class={styles.chartPartBarTop}>
          <Show when={merged.showTotal} fallback={<span />}>
            <Text as="span" variant="body-sm" tone="secondary" class={styles.heatPartTotal}>
              <Text as="b" variant="label-sm" tone="inherit">
                {format(grid().total)}
              </Text>
              {unitSuffix()}
              <Text as="span" variant="caption" tone="inherit">
                {' '}
                · {label()}
              </Text>
            </Text>
          </Show>
          <Show when={merged.showLegend}>
            <Text as="span" variant="caption" tone="tertiary" class={styles.heatPartLegend} aria-hidden="true">
              <Text as="span" variant="caption" tone="inherit">
                {translate('velvet.charts.heatmap.less')}
              </Text>
              <For each={merged.colors}>{(c) => <i style={{ background: c }} />}</For>
              <Text as="span" variant="caption" tone="inherit">
                {translate('velvet.charts.heatmap.more')}
              </Text>
            </Text>
          </Show>
        </div>
      </Show>
      <div
        class={styles.heat}
        style={{ '--heatmap-weeks': merged.weeks, '--heatmap-cell-max': `${merged.cellMax}px` }}
        onMouseLeave={() => setHover(-1)}
      >
        <div class={styles.heatPartMonths} style={columns()} aria-hidden="true">
          <For each={monthLabels()}>
            {(m) => (
              <Text
                as="span"
                variant="overline"
                tone="inherit"
                style={{
                  'grid-column': `${m.week + 1} / span ${Math.min(MIN_MONTH_LABEL_GAP, merged.weeks - m.week)}`,
                }}
              >
                {m.label}
              </Text>
            )}
          </For>
        </div>
        <div class={styles.heatPartDays} aria-hidden="true">
          <For each={weekdayLabels()}>
            {(name) => (
              <Text as="span" variant="overline" tone="inherit">
                {name}
              </Text>
            )}
          </For>
        </div>
        <div class={styles.heatPartCells} style={columns()}>
          <For each={grid().cells}>
            {(c) => (
              <Show
                when={c.index <= lastIndex()}
                fallback={<span class={cx(styles.heatPartCell, styles.heatPartCellVariantFuture)} aria-hidden="true" />}
              >
                <button
                  ref={(el) => (cellRefs[c.index] = el)}
                  type="button"
                  tabindex={c.index === tabStop() ? 0 : -1}
                  class={cx(
                    styles.heatPartCell,
                    merged.onCellClick && styles.heatPartCellVariantClick,
                    hover() === c.index && styles.heatPartCellVariantOn,
                  )}
                  style={{ background: colorOf(c.value) }}
                  aria-label={say(c.date, c.value)}
                  onMouseEnter={() => setHover(c.index)}
                  onFocus={() => reveal(c.index)}
                  onBlur={() => setHover(-1)}
                  onKeyDown={(e) => onKeyDown(e, c.index)}
                  onClick={() => merged.onCellClick?.({ date: ymd(c.date), value: c.value })}
                />
              </Show>
            )}
          </For>
          <Show when={tip()}>
            {(t) => (
              <HeatmapTooltip
                left={t().left}
                top={t().top}
                title={dateFormat().format(t().cell.date)}
                color={colorOf(t().cell.value)}
                label={merged.unit ?? translate('velvet.charts.heatmap.valueLabel')}
                value={format(t().cell.value)}
              />
            )}
          </Show>
        </div>
      </div>
    </div>
  );
};
