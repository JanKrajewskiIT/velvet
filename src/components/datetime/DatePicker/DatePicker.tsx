import { FiCalendar } from 'solid-icons/fi';
import { createMemo, createUniqueId, Show } from 'solid-js';

import DropdownFieldTrigger from '~/components/dropdowns/Dropdown/DropdownFieldTrigger/DropdownFieldTrigger';
import DropdownSurface from '~/components/dropdowns/Dropdown/DropdownSurface/DropdownSurface';
import Icon from '~/components/media/Icon/Icon';
import useCalendarPopupState from '~/hooks/useCalendarPopupState';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import { joinAriaIds, resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';
import { buildDaysGrid, type DayCell, getTodayIso, toIso } from '~/utils/datetime';

import CalendarPanel from '../Calendar/CalendarPanel/CalendarPanel';
import DateTimeFieldTrigger from '../DateTimeFieldTrigger/DateTimeFieldTrigger';
import styles from './DatePicker.module.css';

export interface DatePickerMessages {
  placeholder?: string;
  openPickerLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  dayLabels?: readonly string[];
}

export interface DatePickerProps extends AriaFieldProps {
  value?: string;
  onChange: (value: string) => void;
  locale?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  size?: ComponentSize;
  openPickerLabel?: string;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  messages?: DatePickerMessages;
}

const DatePicker = (props: Props<DatePickerProps>) => {
  const { t } = useI18n();
  const dropdownId = createUniqueId();
  const triggerLabelId = createUniqueId();

  let wrapperRef: HTMLDivElement | undefined;

  const popup = useCalendarPopupState({
    rootRef: () => wrapperRef,
    selectedIso: () => props.value,
    isDisabled: () => Boolean(props.disabled),
  });

  const daysGrid = createMemo(() => buildDaysGrid(popup.viewYear(), popup.viewMonth()));
  const todayIso = getTodayIso();
  const locale = createMemo(() => props.locale ?? Intl.DateTimeFormat().resolvedOptions().locale);

  const monthName = createMemo(() =>
    new Date(popup.viewYear(), popup.viewMonth()).toLocaleString(locale(), {
      month: 'long',
      year: 'numeric',
    })
  );
  const dayLabels = createMemo(
    () =>
      props.messages?.dayLabels ?? [
        t('calendar.day.mo'),
        t('calendar.day.tu'),
        t('calendar.day.we'),
        t('calendar.day.th'),
        t('calendar.day.fr'),
        t('calendar.day.sa'),
        t('calendar.day.su'),
      ]
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
          id={props.id}
          label={props.value || placeholder()}
          labelId={triggerLabelId}
          labelTone={props.value ? 'default' : 'muted'}
          class={triggerClass}
          disabled={props.disabled}
          onClick={() => popup.toggle(props.value)}
          title={openPickerLabel()}
          aria-haspopup="dialog"
          aria-expanded={popup.isOpen()}
          aria-controls={popup.isOpen() ? dropdownId : undefined}
          aria-labelledby={joinAriaIds(props['aria-labelledby'], triggerLabelId)}
          aria-describedby={props['aria-describedby']}
          aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
          aria-errormessage={props['aria-errormessage']}
        >
          <Icon icon={FiCalendar} />
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
            dayLabels={dayLabels()}
          />
        </DropdownSurface>
      </Show>
    </DateTimeFieldTrigger>
  );
};

export default DatePicker;
