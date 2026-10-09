import { type Accessor, batch, createMemo, createSignal, type JSX } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { addDays, addMonths, fmtDate, startOfDay, weekdayNames, ymd } from '../../utils/date';
import { firstOfMonth, sameMonth } from './organizerMonth';

export interface OrganizerCalendarInput {
  weekStartsOn: number;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  selectedDate?: Date;
  defaultSelectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;
}

export interface OrganizerCalendar {
  locale: Accessor<string>;
  today: Accessor<Date>;
  view: Accessor<Date>;
  selected: Accessor<Date>;
  days: Accessor<Date[]>;
  weekdays: Accessor<string[]>;
  monthLabel: Accessor<string>;
  tabStop: Accessor<string>;
  showMonth: (month: Date) => void;
  shiftMonth: (delta: number) => void;
  pick: (d: Date) => void;
  goToday: () => void;
  onGridKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent>;
}

const DAYS_PER_WEEK = 7;
const KEY_STEP: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -DAYS_PER_WEEK,
  ArrowDown: DAYS_PER_WEEK,
};
const MONTH_YEAR: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };

export const createOrganizerCalendar = (input: OrganizerCalendarInput, locale: Accessor<string>): OrganizerCalendar => {
  const today = () => startOfDay(new Date());
  const [view, setView] = createSignal(firstOfMonth(input.defaultMonth ?? today()));
  const [selected, setSelected] = createControllable({
    value: () => (input.selectedDate ? startOfDay(input.selectedDate) : undefined),
    defaultValue: startOfDay(input.defaultSelectedDate ?? today()),
    onChange: (date) => input.onSelectedDateChange?.(date),
  });

  const offset = () => (view().getDay() - input.weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  const days = createMemo(() => {
    const first = view();
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells = Math.ceil((offset() + daysInMonth) / DAYS_PER_WEEK) * DAYS_PER_WEEK;
    const start = addDays(first, -offset());
    return Array.from({ length: cells }, (_, i) => addDays(start, i));
  });
  const weekdays = () => weekdayNames(locale(), input.weekStartsOn);
  const monthLabel = () => fmtDate(view(), locale(), MONTH_YEAR);
  /** The grid keeps one tab stop: the selected day, or the first of the month when the selection is off-screen. */
  const tabStop = () => (sameMonth(selected(), view()) ? ymd(selected()) : ymd(view()));

  const showMonth = (month: Date) => {
    const first = firstOfMonth(month);
    setView(first);
    input.onMonthChange?.(first);
  };
  const shiftMonth = (delta: number) => showMonth(addMonths(view(), delta));
  const pick = (d: Date) =>
    batch(() => {
      setSelected(d);
      if (!sameMonth(d, view())) showMonth(d);
    });
  const goToday = () =>
    batch(() => {
      showMonth(today());
      setSelected(today());
    });

  const onGridKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const step = KEY_STEP[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const next = addDays(selected(), step);
    pick(next);
    e.currentTarget.querySelector<HTMLElement>(`[data-k="${ymd(next)}"]`)?.focus();
  };

  return {
    locale,
    today,
    view,
    selected,
    days,
    weekdays,
    monthLabel,
    tabStop,
    showMonth,
    shiftMonth,
    pick,
    goToday,
    onGridKeyDown,
  };
};
