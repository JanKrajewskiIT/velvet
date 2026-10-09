import { useI18n } from '@jankrajewskiit/i18n';
import { batch, createEffect, createMemo, createSignal, on, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { addMonths, sameDay, startOfDay, weekdayNames } from '../../utils/date';
import { monthKey, navigateDay, startOfMonth } from './calendarGrid';
import type { CalendarConfig, CalendarValue, DateRange } from './calendarTypes';
import { callbackAlias } from './callbackAlias';

const EMPTY_RANGE: DateRange = { start: null, end: null };
const DAY_LABEL: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
const WEEKDAY_LENGTH = 2;

const isDateRange = (value: CalendarValue | undefined): value is DateRange => value != null && !(value instanceof Date);

export const createCalendar = (p: CalendarConfig) => {
  const i18n = useI18n();
  const locale = () => p.locale ?? i18n.locale();
  const isRange = () => p.mode === 'range';
  const months = () => Math.max(1, p.months);

  const [value, setValue] = createControllable<CalendarValue>({
    value: () => p.value,
    defaultValue: untrack(() => p.defaultValue ?? (p.mode === 'range' ? EMPTY_RANGE : null)),
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const range = (): DateRange => {
    const v = value();
    return isRange() && isDateRange(v) ? v : EMPTY_RANGE;
  };
  const anchor = (): Date | null => {
    const v = value();
    if (isRange()) return range().start;
    return v instanceof Date ? v : null;
  };

  const [view, setViewState] = createControllable<Date>({
    value: () => (p.month ? startOfMonth(p.month) : undefined),
    defaultValue: startOfMonth(p.defaultMonth ?? anchor() ?? new Date()),
    onChange: (next) => p.onMonthChange?.(next),
  });
  const setView = (d: Date) => setViewState(startOfMonth(d));
  const lastMonthKey = () => monthKey(view()) + months() - 1;

  const [focus, setFocus] = createSignal(startOfDay(anchor() ?? new Date()));
  const [hover, setHover] = createSignal<Date | null>(null);
  const today = createMemo(() => startOfDay(new Date()));
  let root: HTMLDivElement | undefined;
  let keyboardMove = false;

  const dayLabel = createMemo(() => new Intl.DateTimeFormat(locale(), DAY_LABEL));
  const weekdays = createMemo(() => weekdayNames(locale(), p.weekStartsOn, WEEKDAY_LENGTH));
  const monthOffsets = createMemo(() => Array.from({ length: months() }, (_, i) => i));

  const isOff = (d: Date): boolean =>
    (!!p.min && d < startOfDay(p.min)) || (!!p.max && d > startOfDay(p.max)) || !!p.isDisabled?.(d);
  const isMarked = (d: Date): boolean => {
    const marks = p.marks;
    if (typeof marks === 'function') return marks(d);
    return Array.isArray(marks) && marks.some((mark) => sameDay(mark, d));
  };

  const rangeStart = () => (isRange() ? range().start : null);
  const rangeEnd = (): Date | null => {
    if (!isRange()) return null;
    const { start, end } = range();
    const hovered = hover();
    return end ?? (start && hovered && hovered >= start ? hovered : null);
  };
  const focusVisible = () => monthKey(focus()) >= monthKey(view()) && monthKey(focus()) <= lastMonthKey();

  createEffect(
    on(
      focus,
      (day) => {
        if (!keyboardMove || !root) return;
        keyboardMove = false;
        root.querySelector<HTMLElement>(`[data-day="${day.toDateString()}"]`)?.focus();
      },
      { defer: true },
    ),
  );

  const pick = (d: Date) => {
    if (isOff(d)) return;
    batch(() => {
      setFocus(d);
      if (isRange()) {
        const { start, end } = range();
        if (!start || end) setValue({ start: d, end: null });
        else setValue(d < start ? { start: d, end: start } : { start, end: d });
      } else setValue(d);
      if (monthKey(d) < monthKey(view()) || monthKey(d) > lastMonthKey()) setView(d);
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!(e.target instanceof Element) || !e.target.closest('[data-day]')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(focus());
      return;
    }
    const next = navigateDay(focus(), e.key, e.shiftKey, p.weekStartsOn);
    if (!next) return;
    e.preventDefault();
    keyboardMove = true;
    batch(() => {
      setFocus(next);
      if (monthKey(next) < monthKey(view())) setView(next);
      else if (monthKey(next) > lastMonthKey()) setView(addMonths(next, -(months() - 1)));
    });
  };

  return {
    config: p,
    locale,
    isRange,
    months,
    monthOffsets,
    weekdays,
    dayLabel,
    today,
    view,
    setView,
    anchor,
    focus,
    setFocus,
    setHover,
    focusVisible,
    rangeStart,
    rangeEnd,
    isOff,
    isMarked,
    pick,
    onKeyDown,
    setRoot: (element: HTMLDivElement) => {
      root = element;
    },
  } as const;
};

export type CalendarController = ReturnType<typeof createCalendar>;
