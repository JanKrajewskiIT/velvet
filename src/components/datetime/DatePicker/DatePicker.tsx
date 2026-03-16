import { FiCalendar, FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { createMemo, createSignal, createUniqueId, For, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import DropdownSurface from '../../dropdowns/DropdownBase/DropdownSurface';
import AffixInput from '../../inputs/AffixInput/AffixInput';
import type { InputSize } from '../../inputs/Input/Input';
import { buildDaysGrid, DAY_LABELS, parseDate, toIso } from '../calendar';
import styles from './DatePicker.module.css';

export interface DatePickerMessages {
  placeholder?: string;
  openPickerLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
}

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  locale?: string;
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
    new Date(viewYear(), viewMonth()).toLocaleString(props.locale ?? 'en', { month: 'long', year: 'numeric' })
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
    return classNames(
      styles.day,
      cell.outside && styles.dayOutside,
      iso === todayIso && styles.dayToday,
      iso === props.value && styles.daySelected,
      isDateDisabled(iso) && styles.dayDisabled
    );
  };

  return (
    <div ref={wrapperRef} class={classNames(styles.wrapper, props.class)}>
      <Show when={props.label}>
        <span class={styles.label}>{props.label}</span>
      </Show>
      <AffixInput
        type="text"
        size={props.size}
        inputClass={styles.input}
        value={props.value ?? ''}
        placeholder={placeholder()}
        readOnly
        disabled={props.disabled}
        class={props.disabled ? styles.inputRowDisabled : undefined}
        suffix={
          <IconButton
            icon={<FiCalendar />}
            title={openPickerLabel()}
            class={styles.iconBtn}
            onClick={toggle}
            disabled={props.disabled}
            aria-haspopup="dialog"
            aria-expanded={isOpen()}
            aria-controls={isOpen() ? dropdownId : undefined}
            size="sm"
            variant="subtle"
          />
        }
      />
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

export default DatePicker;
