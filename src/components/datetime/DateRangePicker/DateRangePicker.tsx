import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import DropdownSurface from '../../dropdowns/DropdownBase/DropdownSurface';
import type { InputSize } from '../../inputs/Input/Input';
import InputButton from '../../inputs/InputButton/InputButton';
import { buildDaysGrid, DAY_LABELS, parseDate, toIso } from '../calendar';
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
  locale?: string;
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
    new Date(viewYear(), viewMonth()).toLocaleString(props.locale ?? 'en', { month: 'long', year: 'numeric' })
  );
  const startLabel = () => props.messages?.startLabel ?? props.startLabel ?? 'Start';
  const endLabel = () => props.messages?.endLabel ?? props.endLabel ?? 'End';
  const startAriaLabel = () =>
    props.messages?.startAriaLabel ??
    props.startAriaLabel ??
    props.messages?.startLabel ??
    props.startLabel ??
    'Start date';
  const endAriaLabel = () =>
    props.messages?.endAriaLabel ?? props.endAriaLabel ?? props.messages?.endLabel ?? props.endLabel ?? 'End date';
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

    if (activeField() === 'start') {
      const currentEnd = props.value.end;
      if (currentEnd && currentEnd >= iso) {
        props.onChange({ start: iso, end: currentEnd });
        close();
        return;
      }

      props.onChange({ start: iso, end: '' });
      setPendingStart(iso);
      setActiveField('end');
      return;
    }

    const start = props.value.start || pendingStart();
    if (!start) {
      props.onChange({ start: iso, end: '' });
      setPendingStart(iso);
      setActiveField('end');
      return;
    }

    const [a, b] = start <= iso ? [start, iso] : [iso, start];
    props.onChange({ start: a, end: b });
    close();
  };

  const effectiveStart = createMemo(() => pendingStart() ?? props.value.start);
  const effectiveEnd = createMemo(() => (pendingStart() !== null ? null : props.value.end));

  const dayClass = (cell: { day: number; month: number; year: number; outside: boolean }): string => {
    const iso = toIso(cell.year, cell.month, cell.day);
    const start = effectiveStart();
    const end = effectiveEnd();

    return classNames(
      styles.day,
      cell.outside && styles.dayOutside,
      iso === todayIso && styles.today,
      isDateDisabled(iso) && styles.disabled,
      start && end && start === end && iso === start && styles.rangeSingle,
      start && iso === start && styles.rangeStart,
      end && iso === end && styles.rangeEnd,
      start && end && iso > start && iso < end && styles.inRange
    );
  };

  const startFieldClass = createMemo(() =>
    classNames(
      styles.field,
      isOpen() && activeField() === 'start' && styles.fieldActive,
      props.disabled && styles.fieldDisabled
    )
  );

  const endFieldClass = createMemo(() =>
    classNames(
      styles.field,
      isOpen() && activeField() === 'end' && styles.fieldActive,
      props.disabled && styles.fieldDisabled
    )
  );

  return (
    <div ref={wrapperRef} class={classNames(styles.wrapper, props.class)}>
      <InputButton
        class={startFieldClass()}
        size={props.size}
        disabled={props.disabled}
        onClick={() => openCalendar('start')}
        aria-label={startAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={isOpen() && activeField() === 'start'}
        aria-controls={isOpen() ? dropdownId : undefined}
      >
        {props.value.start || startLabel()}
      </InputButton>
      <span class={styles.separator}>{'\u2192'}</span>
      <InputButton
        class={endFieldClass()}
        size={props.size}
        disabled={props.disabled}
        onClick={() => openCalendar('end')}
        aria-label={endAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={isOpen() && activeField() === 'end'}
        aria-controls={isOpen() ? dropdownId : undefined}
      >
        {props.value.end || endLabel()}
      </InputButton>
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
            <IconButton
              icon={<FiChevronLeft />}
              title={previousMonthLabel()}
              class={styles.navBtn}
              onClick={prevMonth}
              size="sm"
              variant="subtle"
            />
            <span class={styles.monthYear}>{monthName()}</span>
            <IconButton
              icon={<FiChevronRight />}
              title={nextMonthLabel()}
              class={styles.navBtn}
              onClick={nextMonth}
              size="sm"
              variant="subtle"
            />
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
