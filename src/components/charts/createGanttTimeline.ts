import { createMemo } from 'solid-js';

import { addDays } from '../../utils/date';
import {
  axisRange,
  buildMonths,
  buildRows,
  daysBetween,
  type GanttScale,
  type GanttTask,
  isWeekend,
  type PlacedTask,
  placeTasks,
  PX_PER_DAY,
  toDay,
} from './ganttLayout';

const DAYS_PER_WEEK = 7;
const MONDAY = 1;

interface GanttTimelineOptions {
  tasks: () => GanttTask[];
  scale: () => GanttScale;
  start: () => Date | string | undefined;
  end: () => Date | string | undefined;
  today: () => Date | string | undefined;
  rowHeight: () => number;
}

export const createGanttTimeline = (options: GanttTimelineOptions) => {
  const placed = createMemo(() => placeTasks(options.tasks()));
  const rows = createMemo(() => buildRows(placed()));
  const rowIndex = createMemo(
    () => new Map(rows().flatMap((row, k) => (row.kind === 'task' ? [[row.placed.key, k] as const] : []))),
  );
  const today = () => toDay(options.today() ?? new Date());
  const range = createMemo(() => axisRange(placed(), options.start(), options.end(), today()));
  const px = () => PX_PER_DAY[options.scale()];
  const dayCount = () => daysBetween(range().from, range().to) + 1;
  const canvasWidth = () => dayCount() * px();
  const canvasHeight = () => rows().length * options.rowHeight();
  const x = (d: Date) => daysBetween(range().from, d) * px();
  const rowTop = (key: PlacedTask['key']) => (rowIndex().get(key) ?? 0) * options.rowHeight();
  const rowCentre = (key: PlacedTask['key']) => rowTop(key) + options.rowHeight() / 2;

  const days = createMemo(() => {
    const from = range().from;
    return Array.from({ length: dayCount() }, (_, k) => addDays(from, k));
  });
  const months = createMemo(() => buildMonths(days()));
  const monthSpans = () =>
    months().map((m, i) => ({ ...m, width: ((months()[i + 1]?.index ?? dayCount()) - m.index) * px() }));
  const units = createMemo(() =>
    days().flatMap((date, k) => {
      if (options.scale() === 'month' || (options.scale() === 'week' && date.getDay() !== MONDAY)) return [];
      const isToday = date.getTime() === today().getTime();
      return [
        {
          k,
          date,
          weekend: isWeekend(date),
          today: isToday,
          width: options.scale() === 'week' ? DAYS_PER_WEEK * px() : px(),
        },
      ];
    }),
  );
  const todayX = () => (today() >= range().from && today() <= range().to ? x(today()) + px() / 2 : undefined);

  return {
    scale: options.scale,
    rowHeight: options.rowHeight,
    placed,
    rows,
    px,
    canvasWidth,
    canvasHeight,
    x,
    rowTop,
    rowCentre,
    days,
    months,
    monthSpans,
    units,
    todayX,
  } as const;
};

export type GanttTimeline = ReturnType<typeof createGanttTimeline>;
