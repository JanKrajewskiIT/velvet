import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { PlacedTask } from './ganttLayout';

const LONG_MONTH_MIN_PX = 8;

interface GanttFormatOptions {
  locale: () => string | undefined;
  px: () => number;
}

export const createGanttFormat = (options: GanttFormatOptions) => {
  const i18n = useI18n();
  const translate = useTranslate();
  const locale = () => options.locale() ?? i18n.locale();

  const monthName = createMemo(
    () => new Intl.DateTimeFormat(locale(), { month: options.px() < LONG_MONTH_MIN_PX ? 'short' : 'long' }),
  );
  const monthYearName = createMemo(
    () =>
      new Intl.DateTimeFormat(locale(), {
        month: options.px() < LONG_MONTH_MIN_PX ? 'short' : 'long',
        year: 'numeric',
      }),
  );
  const dateName = createMemo(() => new Intl.DateTimeFormat(locale(), { month: 'short', day: 'numeric' }));

  const monthLabel = (date: Date, i: number) =>
    (i === 0 || date.getMonth() === 0 ? monthYearName() : monthName()).format(date);
  const dateLabel = (date: Date) => dateName().format(date);

  const taskLabel = (p: PlacedTask) => {
    const { task } = p;
    const dates = task.milestone ? dateLabel(p.start) : `${dateLabel(p.start)} – ${dateLabel(p.end)}`;
    const name = task.name;
    if (task.progress === undefined || task.milestone)
      return translate('velvet.charts.gantt.taskLabel', { name, dates });
    return translate('velvet.charts.gantt.taskLabelProgress', { name, dates, progress: task.progress });
  };

  return { monthLabel, dateLabel, taskLabel } as const;
};

export type GanttFormat = ReturnType<typeof createGanttFormat>;
