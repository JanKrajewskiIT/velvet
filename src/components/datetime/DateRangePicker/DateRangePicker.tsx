import { createMemo, createSignal, createUniqueId, Show } from 'solid-js';

import DropdownFieldTrigger from '~/components/dropdowns/DropdownFieldTrigger/DropdownFieldTrigger';
import DropdownSurface from '~/components/dropdowns/DropdownSurface/DropdownSurface';
import type { InputSize } from '~/components/inputs/Input/Input';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import CalendarPanel from '../CalendarPanel/CalendarPanel';
import { buildDaysGrid, DAY_LABELS, type DayCell, toIso } from '../shared/calendar';
import useCalendarPopupState from '../shared/useCalendarPopupState';
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
  id?: string;
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
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

const DateRangePicker = (props: Props<DateRangePickerProps>) => {
  const [activeField, setActiveField] = createSignal<'start' | 'end'>('start');
  const [pendingStart, setPendingStart] = createSignal<string | null>(null);
  const dropdownId = createUniqueId();

  let wrapperRef: HTMLDivElement | undefined;

  const popup = useCalendarPopupState({
    rootRef: () => wrapperRef,
    selectedIso: () => props.value.start,
    isDisabled: () => Boolean(props.disabled),
    onClose: () => setPendingStart(null),
  });

  const daysGrid = createMemo(() => buildDaysGrid(popup.viewYear(), popup.viewMonth()));
  const todayIso = new Date().toISOString().slice(0, 10);

  const monthName = createMemo(() =>
    new Date(popup.viewYear(), popup.viewMonth()).toLocaleString(props.locale ?? 'en', {
      month: 'long',
      year: 'numeric',
    })
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
    popup.open(dateStr);
  };

  const selectDay = (cell: DayCell) => {
    const iso = toIso(cell.year, cell.month, cell.day);
    if (isDateDisabled(iso)) return;

    if (activeField() === 'start') {
      const currentEnd = props.value.end;
      if (currentEnd && currentEnd >= iso) {
        props.onChange({ start: iso, end: currentEnd });
        popup.close();
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
    popup.close();
  };

  const effectiveStart = createMemo(() => pendingStart() ?? props.value.start);
  const effectiveEnd = createMemo(() => (pendingStart() !== null ? null : props.value.end));

  const dayClass = (cell: DayCell): string => {
    const iso = toIso(cell.year, cell.month, cell.day);
    const start = effectiveStart();
    const end = effectiveEnd();

    return classNames(
      styles.day,
      iso === todayIso && styles.today,
      start && end && start === end && iso === start && styles.rangeSingle,
      start && iso === start && styles.rangeStart,
      end && iso === end && styles.rangeEnd,
      start && end && iso > start && iso < end && styles.inRange
    );
  };

  const isDayDisabled = (cell: DayCell): boolean => isDateDisabled(toIso(cell.year, cell.month, cell.day));

  const startFieldClass = createMemo(() =>
    classNames(
      styles.field,
      popup.isOpen() && activeField() === 'start' && styles.fieldActive,
      props.disabled && styles.fieldDisabled
    )
  );

  const endFieldClass = createMemo(() =>
    classNames(
      styles.field,
      popup.isOpen() && activeField() === 'end' && styles.fieldActive,
      props.disabled && styles.fieldDisabled
    )
  );

  return (
    <div
      id={props.id}
      ref={wrapperRef}
      class={classNames(styles.wrapper, props.class)}
      role="group"
      aria-labelledby={props['aria-labelledby']}
      aria-describedby={props['aria-describedby']}
    >
      <DropdownFieldTrigger
        class={startFieldClass()}
        size={props.size}
        label={props.value.start || startLabel()}
        labelTone={props.value.start ? 'default' : 'muted'}
        disabled={props.disabled}
        onClick={() => openCalendar('start')}
        aria-label={startAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={popup.isOpen() && activeField() === 'start'}
        aria-controls={popup.isOpen() ? dropdownId : undefined}
      />
      <Text as="span" variant="bodySm" tone="muted">
        {'\u2192'}
      </Text>
      <DropdownFieldTrigger
        class={endFieldClass()}
        size={props.size}
        label={props.value.end || endLabel()}
        labelTone={props.value.end ? 'default' : 'muted'}
        disabled={props.disabled}
        onClick={() => openCalendar('end')}
        aria-label={endAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={popup.isOpen() && activeField() === 'end'}
        aria-controls={popup.isOpen() ? dropdownId : undefined}
      />
      <Show when={popup.isOpen()}>
        <DropdownSurface
          id={dropdownId}
          class={styles.dropdown}
          style={{ top: 'calc(100% + var(--spacing-xs))' }}
          align="left"
          origin="topLeft"
          role="dialog"
          aria-modal="false"
          aria-label={calendarLabel()}
          scrollable={false}
        >
          <CalendarPanel
            monthLabel={monthName()}
            previousLabel={previousMonthLabel()}
            nextLabel={nextMonthLabel()}
            onPrevious={popup.prevMonth}
            onNext={popup.nextMonth}
            dayLabels={DAY_LABELS}
            days={daysGrid()}
            getDayClass={dayClass}
            isDayDisabled={isDayDisabled}
            getDayAriaLabel={(cell) => toIso(cell.year, cell.month, cell.day)}
            onSelectDay={selectDay}
          />
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default DateRangePicker;
