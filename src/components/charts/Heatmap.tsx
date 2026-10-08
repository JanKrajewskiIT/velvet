import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { addDays, startOfDay, toDate, ymd } from '../../utils/date';
import { HEATMAP_COLORS } from './heatmapColors';

const DAYS_PER_WEEK = 7;
const MIN_MONTH_LABEL_GAP = 3;
const CELL_GAP = 3;
const AXIS_GUTTER = 34;
const KEY_STEPS: Record<string, number> = {
  ArrowUp: -1,
  ArrowDown: 1,
  ArrowLeft: -DAYS_PER_WEEK,
  ArrowRight: DAYS_PER_WEEK,
};

export interface HeatmapPoint {
  /** 'YYYY-MM-DD' or Date. Duplicates on one day are summed. */
  date: string | Date;
  value: number;
}

export interface HeatmapCell {
  date: string;
  value: number;
}

export interface HeatmapProps {
  data: HeatmapPoint[];
  /** @default 20 */
  weeks?: number;
  /** Last day shown. @default latest date in data (or today) */
  end?: string | Date;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStart?: 0 | 1;
  /** Month / weekday / date names. @default the active locale */
  locale?: string;
  /** Group name, shown after the total. @default localized "Activity" */
  label?: string;
  /** e.g. "sessions" — used in total, tooltip and aria labels. @default localized "Value" in the tooltip */
  unit?: string;
  /** @default value.toLocaleString(locale) */
  format?: (v: number) => string;
  /** Level colours, index 0 = empty. @default HEATMAP_COLORS */
  colors?: string[];
  /** Fixed lower bounds for levels 2…n-1 (any value > 0 is level 1). Default scales to the max in range. */
  thresholds?: number[];
  /** Max cell size in px — the grid is fluid below that. @default 16 */
  cellMax?: number;
  /** @default true */
  showTotal?: boolean;
  /** @default true */
  showLegend?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
  class?: string;
}

const toDay = (value: string | Date): Date =>
  startOfDay(toDate(typeof value === 'string' ? value.slice(0, 10) : value));

/** Calendar density grid — "how much, when". Weeks are columns, weekdays rows; level colours come from --dv-seq-*. Hover or arrow-key through days (←→ week, ↑↓ day, Home/End); each cell has a full spoken label with its value. */
export const Heatmap = (props: HeatmapProps) => {
  const merged = mergeProps(
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
  const [hover, setHover] = createSignal(-1);
  const [focusIndex, setFocusIndex] = createSignal(-1);
  const cellRefs: HTMLButtonElement[] = [];

  const format = (v: number) => (merged.format ? merged.format(v) : v.toLocaleString(locale()));
  const monthFormat = createMemo(() => new Intl.DateTimeFormat(locale(), { month: 'short' }));
  const weekdayFormat = createMemo(() => new Intl.DateTimeFormat(locale(), { weekday: 'short' }));
  const dateFormat = createMemo(
    () => new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
  );

  const byDay = createMemo(() => {
    const totals = new Map<string, number>();
    for (const point of merged.data) {
      const key = ymd(toDay(point.date));
      totals.set(key, (totals.get(key) ?? 0) + (point.value || 0));
    }
    return totals;
  });

  const lastDay = createMemo(() => {
    if (merged.end) return toDay(merged.end);
    let latest: Date | undefined;
    for (const point of merged.data) {
      const day = toDay(point.date);
      if (!latest || day > latest) latest = day;
    }
    return latest ?? startOfDay(new Date());
  });

  const firstDay = () => addDays(lastDay(), -offset() - (merged.weeks - 1) * DAYS_PER_WEEK);
  const offset = () => (lastDay().getDay() - merged.weekStart + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  const lastIndex = () => (merged.weeks - 1) * DAYS_PER_WEEK + offset();

  const grid = createMemo(() => {
    const start = firstDay();
    const last = lastIndex();
    const cells: { index: number; date: Date; value: number }[] = [];
    let total = 0;
    let max = 0;
    for (let i = 0; i < merged.weeks * DAYS_PER_WEEK; i++) {
      const date = addDays(start, i);
      const value = i > last ? 0 : (byDay().get(ymd(date)) ?? 0);
      if (i <= last) {
        total += value;
        max = Math.max(max, value);
      }
      cells.push({ index: i, date, value });
    }
    return { cells, total, max };
  });

  const level = (v: number): number => {
    const top = merged.colors.length - 1;
    if (v <= 0) return 0;
    if (merged.thresholds) return Math.min(top, 1 + merged.thresholds.filter((t) => v >= t).length);
    return Math.max(1, Math.min(top, Math.ceil((v / (grid().max || 1)) * top)));
  };
  const colorOf = (v: number) => merged.colors[level(v)];

  const monthLabels = createMemo(() => {
    const start = firstDay();
    const labels: { week: number; label: string }[] = [];
    for (let w = 0; w < merged.weeks; w++) {
      const date = addDays(start, w * DAYS_PER_WEEK);
      if (!w || date.getMonth() !== addDays(start, (w - 1) * DAYS_PER_WEEK).getMonth())
        labels.push({ week: w, label: monthFormat().format(date) });
    }
    const [first, second] = labels;
    if (first && second && second.week - first.week < MIN_MONTH_LABEL_GAP) labels.shift();
    return labels;
  });

  const weekdayLabels = () => {
    const first = firstDay();
    const formatter = weekdayFormat();
    return Array.from({ length: DAYS_PER_WEEK }, (_, r) =>
      r % 2 === 0 && r < 6 ? formatter.format(addDays(first, r)) : '',
    );
  };

  const tabStop = () => (focusIndex() < 0 || focusIndex() > lastIndex() ? lastIndex() : focusIndex());
  const go = (target: number) => {
    const i = Math.max(0, Math.min(lastIndex(), target));
    setFocusIndex(i);
    setHover(i);
    cellRefs[i]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const step = KEY_STEPS[e.key];
    if (step !== undefined) {
      e.preventDefault();
      go(index + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      go(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      go(lastIndex());
    } else if (e.key === 'Escape') setHover(-1);
  };

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
                  onFocus={() => {
                    setFocusIndex(c.index);
                    setHover(c.index);
                  }}
                  onBlur={() => setHover(-1)}
                  onKeyDown={(e) => onKeyDown(e, c.index)}
                  onClick={() => merged.onCellClick?.({ date: ymd(c.date), value: c.value })}
                />
              </Show>
            )}
          </For>
          <Show when={tip()}>
            {(t) => (
              <div class="vui-chart__tip" style={{ left: `${t().left}px`, top: `${t().top}px` }} aria-hidden="true">
                <div class="vui-chart__tip-t">{dateFormat().format(t().cell.date)}</div>
                <div class="vui-chart__tip-r">
                  <i style={{ background: colorOf(t().cell.value) }} />
                  {merged.unit ?? translate('velvet.charts.heatmap.valueLabel')}
                  <b>{format(t().cell.value)}</b>
                </div>
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
};
