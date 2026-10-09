import { useI18n } from '@jankrajewskiit/i18n';
import { For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { ymd } from '../../utils/date';
import { createHeatmapCursor } from './createHeatmapCursor';
import { createHeatmapGrid } from './createHeatmapGrid';
import { createHeatmapLabels, MIN_MONTH_LABEL_GAP } from './createHeatmapLabels';
import { HEATMAP_COLORS } from './heatmapColors';
import { HeatmapTooltip } from './HeatmapTooltip';
import type { HeatmapConfig, HeatmapProps } from './heatmapTypes';

export type { HeatmapCell, HeatmapPoint, HeatmapProps } from './heatmapTypes';

const CELL_GAP = 3;
const AXIS_GUTTER = 34;

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
    <div class={cx('vui-chart', 'vui-heat-wrap', merged.class)} role="group" aria-label={label()}>
      <Show when={merged.showTotal || merged.showLegend}>
        <div class="vui-chart__bar-top">
          <Show when={merged.showTotal} fallback={<span />}>
            <span class="vui-heat__total">
              <b>{format(grid().total)}</b>
              {unitSuffix()}
              <span> · {label()}</span>
            </span>
          </Show>
          <Show when={merged.showLegend}>
            <span class="vui-heat__legend" aria-hidden="true">
              <span>{translate('velvet.charts.heatmap.less')}</span>
              <For each={merged.colors}>{(c) => <i style={{ background: c }} />}</For>
              <span>{translate('velvet.charts.heatmap.more')}</span>
            </span>
          </Show>
        </div>
      </Show>
      <div
        class="vui-heat"
        style={{ 'max-width': `calc(${merged.weeks} * ${merged.cellMax + CELL_GAP}px + ${AXIS_GUTTER}px)` }}
        onMouseLeave={() => setHover(-1)}
      >
        <div class="vui-heat__months" style={columns()} aria-hidden="true">
          <For each={monthLabels()}>
            {(m) => (
              <span
                style={{
                  'grid-column': `${m.week + 1} / span ${Math.min(MIN_MONTH_LABEL_GAP, merged.weeks - m.week)}`,
                }}
              >
                {m.label}
              </span>
            )}
          </For>
        </div>
        <div class="vui-heat__days" aria-hidden="true">
          <For each={weekdayLabels()}>{(name) => <span>{name}</span>}</For>
        </div>
        <div class="vui-heat__cells" style={columns()}>
          <For each={grid().cells}>
            {(c) => (
              <Show
                when={c.index <= lastIndex()}
                fallback={<span class="vui-heat__cell vui-heat__cell--future" aria-hidden="true" />}
              >
                <button
                  ref={(el) => (cellRefs[c.index] = el)}
                  type="button"
                  tabindex={c.index === tabStop() ? 0 : -1}
                  class={cx(
                    'vui-heat__cell',
                    merged.onCellClick && 'vui-heat__cell--click',
                    hover() === c.index && 'vui-heat__cell--on',
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
