import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import type { InputSize } from '../Input/Input';
import DropdownSurface from '../shared/DropdownSurface';
import InputBase from '../shared/InputBase';
import styles from './DateRangePicker.module.css';

interface DateRangePickerMessages {
  startLabel?: string;
  endLabel?: string;
  startAriaLabel?: string;
  endAriaLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
}

export interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  startLabel?: string;
  endLabel?: string;
  size?: InputSize;
  disabled?: boolean;
  min?: string;
  max?: string;
  startAriaLabel?: string;
  endAriaLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  messages?: DateRangePickerMessages;
}

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const pad = (n: number): string => String(n).padStart(2, '0');

const toIso = (y: number, m: number, d: number): string => `${y}-${pad(m + 1)}-${pad(d)}`;

const buildDaysGrid = (year: number, month: number) => {
  const first = new Date(year, month, 1).getDay();
  const offset = (first + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; month: number; year: number; outside: boolean }[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: d, month: m, year: y, outside: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, outside: false });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ day: d, month: m, year: y, outside: true });
  }

  return cells;
};

const parseDate = (iso: string): { year: number; month: number } => {
  const [y, m] = iso.split('-');
  return { year: Number(y), month: Number(m) - 1 };
};

const DateRangePicker = (props: Props<DateRangePickerProps>) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeField, setActiveField] = createSignal<'start' | 'end'>('start');
  const [pendingStart, setPendingStart] = createSignal<string | null>(null);
  const dropdownId = createUniqueId();

  const initial = (): { year: number; month: number } => {
    if (props.value.start) return parseDate(props.value.start);
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const [viewYear, setViewYear] = createSignal<number>(initial().year);
  const [viewMonth, setViewMonth] = createSignal<number>(initial().month);

  let wrapperRef: HTMLDivElement | undefined;

  const close = () => {
    setIsOpen(false);
    setPendingStart(null);
  };

  useClickOutside(
    () => wrapperRef,
    () => isOpen(),
    close
  );
  useEscapeKey(() => isOpen(), close);

  const daysGrid = createMemo(() => buildDaysGrid(viewYear(), viewMonth()));
  const todayIso = new Date().toISOString().slice(0, 10);

  const monthName = createMemo(() =>
    new Date(viewYear(), viewMonth()).toLocaleString('en', { month: 'long', year: 'numeric' })
  );
  const startLabel = () => props.messages?.startLabel ?? props.startLabel ?? 'Start';
  const endLabel = () => props.messages?.endLabel ?? props.endLabel ?? 'End';
  const startAriaLabel = () =>
    props.messages?.startAriaLabel ??
    props.startAriaLabel ??
    props.startLabel ??
    props.messages?.startLabel ??
    'Start date';
  const endAriaLabel = () =>
    props.messages?.endAriaLabel ?? props.endAriaLabel ?? props.endLabel ?? props.messages?.endLabel ?? 'End date';
  const calendarLabel = () => props.messages?.calendarLabel ?? props.calendarLabel ?? 'Date range calendar';
  const previousMonthLabel = () => props.messages?.previousMonthLabel ?? props.previousMonthLabel ?? 'Previous month';
  const nextMonthLabel = () => props.messages?.nextMonthLabel ?? props.nextMonthLabel ?? 'Next month';

  const prevMonth = () => {
    if (viewMonth() === 0) {
      setViewMonth(11);
      setViewYear(viewYear() - 1);
    } else setViewMonth(viewMonth() - 1);
  };

  const nextMonth = () => {
    if (viewMonth() === 11) {
      setViewMonth(0);
      setViewYear(viewYear() + 1);
    } else setViewMonth(viewMonth() + 1);
  };

  const isDateDisabled = (iso: string): boolean => {
    if (props.min && iso < props.min) return true;
    if (props.max && iso > props.max) return true;
    return false;
  };

  const openCalendar = (field: 'start' | 'end') => {
    if (props.disabled) return;
    setActiveField(field);
    setPendingStart(null);
    const dateStr = field === 'start' ? props.value.start : props.value.end;
    if (dateStr) {
      const parsed = parseDate(dateStr);
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    } else {
      const i = initial();
      setViewYear(i.year);
      setViewMonth(i.month);
    }
    setIsOpen(true);
  };

  const selectDay = (cell: { day: number; month: number; year: number }) => {
    const iso = toIso(cell.year, cell.month, cell.day);
    if (isDateDisabled(iso)) return;

    const pending = pendingStart();
    if (pending === null) {
      setPendingStart(iso);
    } else {
      const [a, b] = pending <= iso ? [pending, iso] : [iso, pending];
      props.onChange({ start: a, end: b });
      close();
    }
  };

  const effectiveStart = createMemo(() => pendingStart() ?? props.value.start);
  const effectiveEnd = createMemo(() => (pendingStart() !== null ? null : props.value.end));

  const dayClass = (cell: { day: number; month: number; year: number; outside: boolean }): string => {
    const iso = toIso(cell.year, cell.month, cell.day);
    const parts = [styles.day];
    if (cell.outside) parts.push(styles.dayOutside);
    if (iso === todayIso) parts.push(styles.today);
    if (isDateDisabled(iso)) parts.push(styles.disabled);

    const start = effectiveStart();
    const end = effectiveEnd();

    if (start && end && start === end && iso === start) {
      parts.push(styles.rangeSingle);
    } else if (start && iso === start) {
      parts.push(styles.rangeStart);
    } else if (end && iso === end) {
      parts.push(styles.rangeEnd);
    } else if (start && end && iso > start && iso < end) {
      parts.push(styles.inRange);
    }

    return parts.join(' ');
  };

  const startFieldClass = createMemo(() => {
    const parts = [styles.field];
    if (isOpen() && activeField() === 'start') parts.push(styles.fieldActive);
    if (props.disabled) parts.push(styles.fieldDisabled);
    return parts.join(' ');
  });

  const endFieldClass = createMemo(() => {
    const parts = [styles.field];
    if (isOpen() && activeField() === 'end') parts.push(styles.fieldActive);
    if (props.disabled) parts.push(styles.fieldDisabled);
    return parts.join(' ');
  });

  return (
    <div ref={wrapperRef} class={classNames(styles.wrapper, props.class)}>
      <InputBase
        as="button"
        type="button"
        class={startFieldClass()}
        size={props.size}
        disabled={props.disabled}
        focusWithin={false}
        onClick={() => openCalendar('start')}
        aria-label={startAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={isOpen() && activeField() === 'start'}
        aria-controls={isOpen() ? dropdownId : undefined}
      >
        {props.value.start || startLabel()}
      </InputBase>
      <span class={styles.separator}>{'\u2192'}</span>
      <InputBase
        as="button"
        type="button"
        class={endFieldClass()}
        size={props.size}
        disabled={props.disabled}
        focusWithin={false}
        onClick={() => openCalendar('end')}
        aria-label={endAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={isOpen() && activeField() === 'end'}
        aria-controls={isOpen() ? dropdownId : undefined}
      >
        {props.value.end || endLabel()}
      </InputBase>
      <Show when={isOpen()}>
        <DropdownSurface
          id={dropdownId}
          class={styles.dropdown}
          role="dialog"
          aria-modal="false"
          aria-label={calendarLabel()}
          scrollable={false}
        >
          <div class={styles.nav}>
            <button type="button" class={styles.navBtn} onClick={prevMonth} aria-label={previousMonthLabel()}>
              <FiChevronLeft />
            </button>
            <span class={styles.monthYear}>{monthName()}</span>
            <button type="button" class={styles.navBtn} onClick={nextMonth} aria-label={nextMonthLabel()}>
              <FiChevronRight />
            </button>
          </div>
          <div class={styles.grid}>
            <For each={DAY_LABELS}>{(d) => <span class={styles.dayHeader}>{d}</span>}</For>
            <For each={daysGrid()}>
              {(cell) => (
                <button
                  type="button"
                  class={dayClass(cell)}
                  onClick={() => selectDay(cell)}
                  aria-label={toIso(cell.year, cell.month, cell.day)}
                >
                  {cell.day}
                </button>
              )}
            </For>
          </div>
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default DateRangePicker;
