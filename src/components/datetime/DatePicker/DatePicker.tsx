import { FiCalendar } from 'solid-icons/fi';
import { createMemo, createUniqueId, Show } from 'solid-js';

import DropdownFieldTrigger from '~/components/dropdowns/DropdownFieldTrigger/DropdownFieldTrigger';
import DropdownSurface from '~/components/dropdowns/DropdownSurface/DropdownSurface';
import type { InputSize } from '~/components/inputs/Input/Input';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';

import CalendarPanel from '../CalendarPanel/CalendarPanel';
import DateTimeFieldTrigger from '../DateTimeFieldTrigger/DateTimeFieldTrigger';
import { buildDaysGrid, type DayCell, toIso } from '../shared/calendar';
import useCalendarPopupState from '../shared/useCalendarPopupState';
import styles from './DatePicker.module.css';

export interface DatePickerMessages {
  placeholder?: string;
  openPickerLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
}

interface DatePickerProps extends AriaFieldProps {
  value?: string;
  onChange: (value: string) => void;
  locale?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  size?: InputSize;
  openPickerLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  messages?: DatePickerMessages;
}

const DatePicker = (props: Props<DatePickerProps>) => {
  const { locale: currentLocale, t } = useI18n();
  const dropdownId = createUniqueId();

  let wrapperRef: HTMLDivElement | undefined;

  const popup = useCalendarPopupState({
    rootRef: () => wrapperRef,
    selectedIso: () => props.value,
    isDisabled: () => Boolean(props.disabled),
  });

  const daysGrid = createMemo(() => buildDaysGrid(popup.viewYear(), popup.viewMonth()));
  const todayIso = new Date().toISOString().slice(0, 10);

  const monthName = createMemo(() =>
    new Date(popup.viewYear(), popup.viewMonth()).toLocaleString(props.locale ?? currentLocale(), {
      month: 'long',
      year: 'numeric',
    })
  );
  const placeholder = () => props.messages?.placeholder ?? props.placeholder ?? t('date.yyyymmdd');
  const openPickerLabel = () =>
    props.messages?.openPickerLabel ?? props.openPickerLabel ?? t('datetime.openDatePicker');
  const calendarLabel = () => props.messages?.calendarLabel ?? props.calendarLabel ?? t('calendar.label');
  const previousMonthLabel = () =>
    props.messages?.previousMonthLabel ?? props.previousMonthLabel ?? t('calendar.prevMonth');
  const nextMonthLabel = () => props.messages?.nextMonthLabel ?? props.nextMonthLabel ?? t('calendar.nextMonth');

  const isDateDisabled = (iso: string): boolean => {
    if (props.min && iso < props.min) return true;
    if (props.max && iso > props.max) return true;
    return false;
  };

  const selectDay = (cell: DayCell) => {
    const iso = toIso(cell.year, cell.month, cell.day);
    if (!isDateDisabled(iso)) {
      props.onChange(iso);
      popup.close();
    }
  };

  const dayClass = (cell: DayCell): string => {
    const iso = toIso(cell.year, cell.month, cell.day);
    return classNames(styles.day, iso === todayIso && styles.dayToday, iso === props.value && styles.daySelected);
  };

  const isDayDisabled = (cell: DayCell): boolean => isDateDisabled(toIso(cell.year, cell.month, cell.day));

  return (
    <DateTimeFieldTrigger
      ref={wrapperRef}
      class={props.class}
      open={popup.isOpen()}
      trigger={(triggerClass) => (
        <DropdownFieldTrigger
          size={props.size}
          label={props.value || placeholder()}
          labelTone={props.value ? 'default' : 'muted'}
          class={triggerClass}
          disabled={props.disabled}
          onClick={() => popup.toggle(props.value)}
          aria-label={openPickerLabel()}
          aria-haspopup="dialog"
          aria-expanded={popup.isOpen()}
          aria-controls={popup.isOpen() ? dropdownId : undefined}
          aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
          aria-errormessage={props['aria-errormessage']}
        >
          <FiCalendar />
        </DropdownFieldTrigger>
      )}
    >
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
            days={daysGrid()}
            getDayClass={dayClass}
            isDayDisabled={isDayDisabled}
            getDayAriaLabel={(cell) => toIso(cell.year, cell.month, cell.day)}
            onSelectDay={selectDay}
          />
        </DropdownSurface>
      </Show>
    </DateTimeFieldTrigger>
  );
};

export default DatePicker;
