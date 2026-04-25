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

export interface DatePickerProps extends AriaFieldProps {
  value?: string;
  onChange: (value: string) => void;
  locale?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  size?: ComponentSize;
}

const DatePicker = (props: Props<DatePickerProps>) => {
  const { ts } = useI18n();
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
    }),
  );
  const dayLabels = createMemo(() => [
    ts('calendar.day.mo'),
    ts('calendar.day.tu'),
    ts('calendar.day.we'),
    ts('calendar.day.th'),
    ts('calendar.day.fr'),
    ts('calendar.day.sa'),
    ts('calendar.day.su'),
  ]);
  const placeholder = () => ts('date.yyyymmdd');
  const openPickerLabel = () => ts('datetime.openDatePicker');
  const calendarLabel = () => ts('calendar.label');

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

  const handleToggle = () => popup.toggle(props.value);
  const getDayAriaLabel = (cell: DayCell) => toIso(cell.year, cell.month, cell.day);

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
          onClick={handleToggle}
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
          align="left"
          origin="topLeft"
          role="dialog"
          aria-modal="false"
          aria-label={calendarLabel()}
          scrollable={false}
        >
          <CalendarPanel
            monthLabel={monthName()}
            onPrevious={popup.prevMonth}
            onNext={popup.nextMonth}
            days={daysGrid()}
            getDayClass={dayClass}
            isDayDisabled={isDayDisabled}
            getDayAriaLabel={getDayAriaLabel}
            onSelectDay={selectDay}
            dayLabels={dayLabels()}
          />
        </DropdownSurface>
      </Show>
    </DateTimeFieldTrigger>
  );
};

export default DatePicker;
