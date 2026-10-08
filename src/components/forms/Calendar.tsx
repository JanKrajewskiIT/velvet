import { useI18n } from '@jankrajewskiit/i18n';
import { batch, createEffect, createMemo, createSignal, For, Index, mergeProps, on, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { addDays, addMonths, fmtDate, sameDay, startOfDay, weekdayNames } from '../../utils/date';
import { IconButton } from '../actions/IconButton';
import { Weekday } from '../primitives/Weekday';
import { monthGrid, monthKey, navigateDay, startOfMonth } from './calendarGrid';
import { callbackAlias } from './callbackAlias';

export { addDays, addMonths, fmtDate, sameDay, startOfDay };

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type CalendarValue = Date | null | DateRange;

interface CalendarBaseProps {
  /** Side-by-side months (range pickers use 2). @default 1 */
  months?: number;
  /** Controlled visible month. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (date: Date) => boolean;
  /** Dot under days with events: array of dates or predicate. */
  marks?: Date[] | ((date: Date) => boolean);
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  /** Intl locale for month/weekday names. @default the active i18n locale */
  locale?: string;
  class?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** @default 'single' */
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: Date | null) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/** Both modes seen through one value type; the public union keeps each mode's callback precisely typed. */
interface CalendarModelProps extends CalendarBaseProps {
  mode?: 'single' | 'range';
  value?: CalendarValue;
  defaultValue?: CalendarValue;
  onValueChange?: (value: CalendarValue) => void;
  onChange?: (value: CalendarValue) => void;
}

const EMPTY_RANGE: DateRange = { start: null, end: null };
const MONTH_TITLE: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
const DAY_LABEL: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
const WEEKDAY_LENGTH = 2;

const isDateRange = (value: CalendarValue | undefined): value is DateRange => value != null && !(value instanceof Date);

/** Month grid. single or range (hover previews the range). Keyboard: arrows = day/week, PageUp/Down = month (Shift = year), Home/End = week edges, Enter selects. */
export const Calendar = (props: CalendarProps) => {
  const p = mergeProps({ months: 1, weekStartsOn: 1 }, props as CalendarModelProps);
  const i18n = useI18n();
  const translate = useTranslate();
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

  const renderMonth = (index: number) => {
    const first = createMemo(() => addMonths(view(), index));
    const days = createMemo(() => monthGrid(first(), p.weekStartsOn));
    const title = () => fmtDate(first(), locale(), MONTH_TITLE);
    return (
      <div class="vui-cal__month">
        <div class="vui-cal__head">
          <Show when={index === 0} fallback={<span class="vui-cal__nav-sp" />}>
            <IconButton
              size="sm"
              icon="chevron-left"
              label={translate('velvet.forms.calendar.previousMonth')}
              class="vui-cal__nav"
              onClick={() => setView(addMonths(view(), -1))}
            />
          </Show>
          <span class="vui-cal__title" aria-live="polite">
            {title()}
          </span>
          <Show when={index === months() - 1} fallback={<span class="vui-cal__nav-sp" />}>
            <IconButton
              size="sm"
              icon="chevron-right"
              label={translate('velvet.forms.calendar.nextMonth')}
              class="vui-cal__nav"
              onClick={() => setView(addMonths(view(), 1))}
            />
          </Show>
        </div>
        <div role="grid" class="vui-cal__grid" aria-label={title()}>
          <Index each={weekdays()}>
            {(name) => (
              <Weekday class="vui-cal__wd" role="columnheader">
                {name()}
              </Weekday>
            )}
          </Index>
          <Index each={days()}>
            {(day) => {
              const outside = () => day().getMonth() !== first().getMonth();
              const isToday = () => sameDay(day(), today());
              const isStart = () => sameDay(day(), rangeStart());
              const isEnd = () => sameDay(day(), rangeEnd());
              const selected = () => (isRange() ? isStart() || isEnd() : sameDay(day(), anchor()));
              const inRange = () => {
                const start = rangeStart();
                const end = rangeEnd();
                return !!start && !!end && day() > start && day() < end;
              };
              const tabStop = () => (focusVisible() ? sameDay(day(), focus()) : !outside() && day().getDate() === 1);
              return (
                <Show when={!(outside() && months() > 1)} fallback={<span />}>
                  <button
                    type="button"
                    role="gridcell"
                    data-day={day().toDateString()}
                    tabIndex={tabStop() ? 0 : -1}
                    disabled={isOff(day())}
                    aria-selected={selected() || inRange() || undefined}
                    aria-current={isToday() ? 'date' : undefined}
                    aria-label={dayLabel().format(day())}
                    class={cx(
                      'vui-cal__day',
                      outside() && 'vui-cal__day--out',
                      isToday() && 'vui-cal__day--today',
                      selected() && 'vui-cal__day--sel',
                      inRange() && 'vui-cal__day--in',
                      isStart() && !!rangeEnd() && 'vui-cal__day--start',
                      isEnd() && !!rangeStart() && 'vui-cal__day--end',
                    )}
                    onClick={() => pick(day())}
                    onMouseEnter={() => isRange() && setHover(day())}
                    onFocus={() => setFocus(day())}
                  >
                    <span>{day().getDate()}</span>
                    <Show when={isMarked(day())}>
                      <i class="vui-cal__mark" aria-hidden="true" />
                    </Show>
                  </button>
                </Show>
              );
            }}
          </Index>
        </div>
      </div>
    );
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard events bubble from the focusable day buttons; mouseleave only clears the range hover preview
    <div
      ref={root}
      class={cx('vui-cal', months() > 1 && 'vui-cal--multi', p.class)}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
    >
      <For each={monthOffsets()}>{renderMonth}</For>
    </div>
  );
};
