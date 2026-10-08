import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, createUniqueId, For, type JSX, Match, mergeProps, onMount, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { addDays } from '../../utils/date';
import {
  asArray,
  axisRange,
  buildRows,
  daysBetween,
  dependencyPath,
  type GanttScale,
  type GanttTask,
  type PlacedTask,
  placeTasks,
  PX_PER_DAY,
  toDay,
} from './ganttLayout';

const LONG_MONTH_MIN_PX = 8;
const BAR_HEIGHT = 24;
const SCROLL_LEAD_DAYS = 4;
const OUTSIDE_NAME_MAX_PX = 160;
const NAME_CHAR_PX = 7;
const NAME_PADDING_PX = 20;
const DAYS_PER_WEEK = 7;
const MILESTONE_HALF_PX = 7;
const MONDAY = 1;

export interface GanttProps {
  tasks: GanttTask[];
  /** day 36 px · week 16 px · month 5 px per day. @default 'day' */
  scale?: GanttScale;
  /** Axis range. Defaults to the tasks ±2–3 days. */
  start?: Date | string;
  end?: Date | string;
  /** @default new Date() */
  today?: Date | string;
  /** px. @default 220 */
  labelWidth?: number;
  /** px. @default 40 */
  rowHeight?: number;
  /** Max height before the body scrolls. */
  height?: number | string;
  /** @default true */
  showDependencies?: boolean;
  onTaskClick?: (task: GanttTask) => void;
  /** Month and date names. @default the active locale */
  locale?: string;
  /** Accessible name. @default localized "Project timeline" */
  label?: string;
  class?: string;
}

/** Timeline of tasks on a date axis — sticky task column and header, month + day / week scale, weekend shading, today line, progress strip, milestones and finish-to-start dependency arrows. Bars are buttons whose label carries name, dates and progress. Scrolls to today on mount. */
export const Gantt = (props: GanttProps) => {
  const merged = mergeProps(
    { scale: 'day', labelWidth: 220, rowHeight: 40, showDependencies: true } satisfies Partial<GanttProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const locale = () => merged.locale ?? i18n.locale();
  const label = () => merged.label ?? translate('velvet.charts.gantt.label');
  const arrowId = createUniqueId();
  let scroller: HTMLDivElement | undefined;

  const placed = createMemo(() => placeTasks(merged.tasks));
  const rows = createMemo(() => buildRows(placed()));
  const rowIndex = createMemo(
    () => new Map(rows().flatMap((row, k) => (row.kind === 'task' ? [[row.placed.key, k] as const] : []))),
  );
  const today = () => toDay(merged.today ?? new Date());
  const range = createMemo(() => axisRange(placed(), merged.start, merged.end, today()));
  const px = () => PX_PER_DAY[merged.scale];
  const dayCount = () => daysBetween(range().from, range().to) + 1;
  const canvasWidth = () => dayCount() * px();
  const canvasHeight = () => rows().length * merged.rowHeight;
  const x = (d: Date) => daysBetween(range().from, d) * px();
  const rowCentre = (key: PlacedTask['key']) => (rowIndex().get(key) ?? 0) * merged.rowHeight + merged.rowHeight / 2;
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  const days = createMemo(() => {
    const from = range().from;
    return Array.from({ length: dayCount() }, (_, k) => addDays(from, k));
  });
  const months = createMemo(() => {
    const list: { id: number; index: number; date: Date }[] = [];
    days().forEach((date, index) => {
      const id = date.getFullYear() * 12 + date.getMonth();
      if (list.at(-1)?.id !== id) list.push({ id, index, date });
    });
    return list;
  });
  const monthSpans = () =>
    months().map((m, i) => ({ ...m, width: ((months()[i + 1]?.index ?? dayCount()) - m.index) * px() }));
  const units = createMemo(() =>
    days().flatMap((date, k) => {
      if (merged.scale === 'month' || (merged.scale === 'week' && date.getDay() !== MONDAY)) return [];
      const isToday = date.getTime() === today().getTime();
      return [
        {
          k,
          date,
          weekend: isWeekend(date),
          today: isToday,
          width: merged.scale === 'week' ? DAYS_PER_WEEK * px() : px(),
        },
      ];
    }),
  );
  const todayX = () => (today() >= range().from && today() <= range().to ? x(today()) + px() / 2 : undefined);

  const monthName = createMemo(
    () => new Intl.DateTimeFormat(locale(), { month: px() < LONG_MONTH_MIN_PX ? 'short' : 'long' }),
  );
  const monthYearName = createMemo(
    () => new Intl.DateTimeFormat(locale(), { month: px() < LONG_MONTH_MIN_PX ? 'short' : 'long', year: 'numeric' }),
  );
  const dateName = createMemo(() => new Intl.DateTimeFormat(locale(), { month: 'short', day: 'numeric' }));
  const monthLabel = (date: Date, i: number) =>
    (i === 0 || date.getMonth() === 0 ? monthYearName() : monthName()).format(date);

  const dependencies = createMemo(() => {
    if (!merged.showDependencies) return [];
    return placed().flatMap((t) =>
      asArray(t.task.dependsOn).flatMap((id) => {
        const predecessor = placed().find((q) => q.key === id);
        if (!predecessor) return [];
        const x1 = x(predecessor.end) + (predecessor.task.milestone ? px() / 2 + MILESTONE_HALF_PX : px());
        const x2 = x(t.start) + (t.task.milestone ? px() / 2 - MILESTONE_HALF_PX - 1 : 0);
        return [
          {
            id: `${predecessor.key}-${t.key}`,
            d: dependencyPath(x1, rowCentre(predecessor.key), x2, rowCentre(t.key), merged.rowHeight),
          },
        ];
      }),
    );
  });

  const spoken = (p: PlacedTask) => {
    const { task } = p;
    const dates = task.milestone
      ? dateName().format(p.start)
      : `${dateName().format(p.start)} – ${dateName().format(p.end)}`;
    const name = task.name;
    if (task.progress === undefined || task.milestone)
      return translate('velvet.charts.gantt.taskLabel', { name, dates });
    return translate('velvet.charts.gantt.taskLabelProgress', { name, dates, progress: task.progress });
  };

  onMount(() => {
    const at = todayX();
    if (scroller && at !== undefined) scroller.scrollLeft = Math.max(0, at - px() * SCROLL_LEAD_DAYS);
  });

  const barWidth = (p: PlacedTask) => (daysBetween(p.start, p.end) + 1) * px();
  const rowTop = (p: PlacedTask) => (rowIndex().get(p.key) ?? 0) * merged.rowHeight;

  const taskButton = (p: PlacedTask): JSX.Element => (
    <Show
      when={p.task.milestone}
      fallback={
        <button
          type="button"
          class={cx(
            'vui-gantt__bar',
            barWidth(p) < Math.min(OUTSIDE_NAME_MAX_PX, p.task.name.length * NAME_CHAR_PX + NAME_PADDING_PX) &&
              'vui-gantt__bar--out',
          )}
          style={{
            left: `${x(p.start) + 1}px`,
            width: `${barWidth(p) - 2}px`,
            top: `${rowTop(p) + (merged.rowHeight - BAR_HEIGHT) / 2}px`,
            '--c': p.color,
          }}
          aria-label={spoken(p)}
          title={spoken(p)}
          onClick={() => merged.onTaskClick?.(p.task)}
        >
          <Show when={p.task.progress}>
            {(progress) => (
              <span class="vui-gantt__prog" style={{ width: `${Math.max(0, Math.min(100, progress()))}%` }} />
            )}
          </Show>
          <span class="vui-gantt__name">{p.task.name}</span>
        </button>
      }
    >
      <button
        type="button"
        class="vui-gantt__ms"
        style={{ left: `${x(p.start) + px() / 2}px`, top: `${rowTop(p) + merged.rowHeight / 2}px`, '--c': p.color }}
        aria-label={translate('velvet.charts.gantt.milestone', { description: spoken(p) })}
        title={spoken(p)}
        onClick={() => merged.onTaskClick?.(p.task)}
      >
        <span>{p.task.name}</span>
      </button>
    </Show>
  );

  return (
    <div
      class={cx('vui-gantt', `vui-gantt--${merged.scale}`, merged.class)}
      style={{ '--gantt-label': `${merged.labelWidth}px`, '--row': `${merged.rowHeight}px` }}
      role="group"
      aria-label={label()}
    >
      <div
        ref={scroller}
        class="vui-gantt__scroll"
        style={{ 'max-height': typeof merged.height === 'number' ? `${merged.height}px` : merged.height }}
      >
        <div style={{ width: `${merged.labelWidth + canvasWidth()}px` }}>
          <div class="vui-gantt__head">
            <div class="vui-gantt__corner">{translate('velvet.charts.gantt.taskHeader')}</div>
            <div class="vui-gantt__scale" style={{ width: `${canvasWidth()}px` }}>
              <div class="vui-gantt__months">
                <For each={monthSpans()}>
                  {(m, i) => (
                    <span class="vui-gantt__month" style={{ left: `${m.index * px()}px`, width: `${m.width}px` }}>
                      {monthLabel(m.date, i())}
                    </span>
                  )}
                </For>
              </div>
              <Show when={merged.scale !== 'month'}>
                <div class="vui-gantt__units">
                  <For each={units()}>
                    {(u) => (
                      <span
                        class={cx(
                          'vui-gantt__unit',
                          merged.scale === 'day' && u.weekend && 'vui-gantt__unit--we',
                          merged.scale === 'day' && u.today && 'vui-gantt__unit--today',
                        )}
                        style={{ left: `${u.k * px()}px`, width: `${u.width}px` }}
                      >
                        {merged.scale === 'week' ? dateName().format(u.date) : u.date.getDate()}
                      </span>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
          <div class="vui-gantt__body">
            <div class="vui-gantt__labels">
              <For each={rows()}>
                {(row) => (
                  <Switch>
                    <Match when={row.kind === 'group' && row}>
                      {(g) => <div class="vui-gantt__label vui-gantt__label--group">{g().group}</div>}
                    </Match>
                    <Match when={row.kind === 'task' && row}>
                      {(t) => (
                        <div class="vui-gantt__label">
                          <i style={{ background: t().placed.color }} />
                          <span title={t().placed.task.name}>{t().placed.task.name}</span>
                          <Show when={t().placed.task.progress !== undefined && !t().placed.task.milestone}>
                            <small>{t().placed.task.progress}%</small>
                          </Show>
                        </div>
                      )}
                    </Match>
                  </Switch>
                )}
              </For>
            </div>
            <div class="vui-gantt__canvas" style={{ width: `${canvasWidth()}px`, height: `${canvasHeight()}px` }}>
              <For each={rows()}>
                {(row, k) => (
                  <Show when={row.kind === 'group'}>
                    <span
                      class="vui-gantt__grp"
                      style={{ top: `${k() * merged.rowHeight}px`, height: `${merged.rowHeight}px` }}
                    />
                  </Show>
                )}
              </For>
              <Show when={merged.scale === 'day'}>
                <For each={days()}>
                  {(d, k) => (
                    <Show when={isWeekend(d)}>
                      <span class="vui-gantt__we" style={{ left: `${k() * px()}px`, width: `${px()}px` }} />
                    </Show>
                  )}
                </For>
              </Show>
              <For each={months().slice(1)}>
                {(m) => <span class="vui-gantt__mline" style={{ left: `${m.index * px()}px` }} />}
              </For>
              <Show when={todayX()}>
                {(at) => (
                  <span
                    class="vui-gantt__today"
                    style={{ left: `${at()}px` }}
                    title={translate('velvet.common.today')}
                  />
                )}
              </Show>
              <svg class="vui-gantt__deps" width={canvasWidth()} height={canvasHeight()} aria-hidden="true">
                <defs>
                  <marker
                    id={arrowId}
                    viewBox="0 0 8 8"
                    refX="7"
                    refY="4"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto"
                  >
                    <path d="M0,0L8,4L0,8z" class="vui-gantt__arrow" />
                  </marker>
                </defs>
                <For each={dependencies()}>
                  {(dep) => <path d={dep.d} class="vui-gantt__dep" marker-end={`url(#${arrowId})`} />}
                </For>
              </svg>
              <For each={placed()}>{taskButton}</For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
