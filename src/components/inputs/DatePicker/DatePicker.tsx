import { FiCalendar, FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { InputSize } from '../Input/Input';
import { buildDaysGrid, DAY_LABELS, parseDate, toIso } from '../shared/calendar';
import DropdownSurface from '../shared/DropdownSurface';
import InputBase from '../shared/InputBase';
import styles from './DatePicker.module.css';

interface DatePickerMessages {
  placeholder?: string;
  openPickerLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
}

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  label?: string;
  size?: InputSize;
  openPickerLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  messages?: DatePickerMessages;
}

const DatePicker = (props: Props<DatePickerProps>) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const dropdownId = createUniqueId();

  const initial = (): { year: number; month: number } => {
    if (props.value) return parseDate(props.value);
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const [viewYear, setViewYear] = createSignal<number>(initial().year);
  const [viewMonth, setViewMonth] = createSignal<number>(initial().month);

  let wrapperRef: HTMLDivElement | undefined;

  const close = () => setIsOpen(false);

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
  const placeholder = () => props.messages?.placeholder ?? props.placeholder ?? 'YYYY-MM-DD';
  const openPickerLabel = () => props.messages?.openPickerLabel ?? props.openPickerLabel ?? 'Open date picker';
  const calendarLabel = () => props.messages?.calendarLabel ?? props.calendarLabel ?? 'Calendar';
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

  const selectDay = (cell: { day: number; month: number; year: number }) => {
    const iso = toIso(cell.year, cell.month, cell.day);
    if (!isDateDisabled(iso)) {
      props.onChange(iso);
      close();
    }
  };

  const toggle = () => {
    if (props.disabled) return;
    if (!isOpen()) {
      const i = initial();
      setViewYear(i.year);
      setViewMonth(i.month);
    }
    setIsOpen(!isOpen());
  };

  const dayClass = (cell: { day: number; month: number; year: number; outside: boolean }): string => {
    const iso = toIso(cell.year, cell.month, cell.day);
    const parts = [styles.day];
    if (cell.outside) parts.push(styles.dayOutside);
    if (iso === todayIso) parts.push(styles.dayToday);
    if (iso === props.value) parts.push(styles.daySelected);
    if (isDateDisabled(iso)) parts.push(styles.dayDisabled);
    return parts.join(' ');
  };

  return (
    <div ref={wrapperRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <Show when={props.label}>
        <span class={styles.label}>{props.label}</span>
      </Show>
      <InputBase
        class={classNames(styles.inputRow, props.disabled && styles.inputRowDisabled)}
        size={props.size}
        disabled={props.disabled}
        focusWithin
      >
        <input
          type="text"
          class={styles.input}
          value={props.value ?? ''}
          placeholder={placeholder()}
          readOnly
          disabled={props.disabled}
        />
        <button
          type="button"
          class={styles.iconBtn}
          onClick={toggle}
          disabled={props.disabled}
          aria-label={openPickerLabel()}
          aria-haspopup="dialog"
          aria-expanded={isOpen()}
          aria-controls={isOpen() ? dropdownId : undefined}
        >
          <FiCalendar />
        </button>
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
          <div class={styles.header}>
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

export default DatePicker;
