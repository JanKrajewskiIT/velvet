import { createMemo } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { addDays, fmtDate, startOfDay } from '../../utils/date';
import { isWeekend, WEEKDAY_LONG } from './schedulerLayout';
import type { SchedulerConfig, SchedulerView } from './schedulerTypes';

export const createSchedulerCalendar = (config: SchedulerConfig, locale: () => string) => {
  const [view, setView] = createControllable<SchedulerView>({
    value: () => config.view,
    defaultValue: config.defaultView,
    onChange: (v) => config.onViewChange?.(v),
  });
  const [date, setDate] = createControllable<Date>({
    value: () => (config.date ? startOfDay(config.date) : undefined),
    defaultValue: startOfDay(config.defaultDate ?? new Date()),
    onChange: (d) => config.onDateChange?.(d),
  });

  const days = createMemo(() => {
    const current = date();
    if (view() === 'day') return [current];
    const weekStart = addDays(current, -((current.getDay() - config.weekStartsOn + 7) % 7));
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).filter(
      (d) => !config.hideWeekends || !isWeekend(d),
    );
  });
  const step = () => (view() === 'day' ? 1 : 7);

  const range = () => {
    const [first] = days();
    const last = days()[days().length - 1];
    if (view() === 'day' || !first || !last) return fmtDate(date(), locale(), { ...WEEKDAY_LONG, year: 'numeric' });
    const sameMonth = first.getMonth() === last.getMonth();
    const start = fmtDate(first, locale(), { month: 'short', day: 'numeric' });
    const end = fmtDate(last, locale(), { month: sameMonth ? undefined : 'short', day: 'numeric', year: 'numeric' });
    return `${start} – ${end}`;
  };

  return { view, setView, date, setDate, days, step, range } as const;
};

export type SchedulerCalendar = ReturnType<typeof createSchedulerCalendar>;
