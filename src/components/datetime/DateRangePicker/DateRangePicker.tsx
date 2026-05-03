import { batch, createMemo, createSignal, createUniqueId, Show } from 'solid-js';

import DropdownFieldTrigger from '~/components/dropdowns/Dropdown/DropdownFieldTrigger/DropdownFieldTrigger';
import DropdownSurface from '~/components/dropdowns/Dropdown/DropdownSurface/DropdownSurface';
import Text from '~/components/typography/Text/Text';
import useCalendarPopupState from '~/hooks/useCalendarPopupState';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import type { AriaFieldProps, ComponentSize } from '~/models/Props';
import { joinAriaIds, resolveAriaInvalid } from '~/utils/aria';
import classNames from '~/utils/classNames';
import { buildDaysGrid, type DayCell, getTodayIso, toIso } from '~/utils/datetime';

import CalendarPanel from '../Calendar/CalendarPanel/CalendarPanel';
import styles from './DateRangePicker.module.css';

export interface DateRange {
  start: string;
  end: string;
}

export interface DateRangePickerProps extends AriaFieldProps {
  id?: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
  locale?: string;
  size?: ComponentSize;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const DateRangePicker = (props: Props<DateRangePickerProps>) => {
  const { ts } = useI18n();
  const [activeField, setActiveField] = createSignal<'start' | 'end'>('start');
  const [pendingStart, setPendingStart] = createSignal<string | null>(null);
  const dropdownId = createUniqueId();
  const startTriggerLabelId = createUniqueId();
  const endTriggerLabelId = createUniqueId();

  let wrapperRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;

  const popup = useCalendarPopupState({
    rootRef: () => wrapperRef,
    floatingRef: () => panelRef,
    selectedIso: () => props.value.start,
    isDisabled: () => Boolean(props.disabled),
    onClose: () => setPendingStart(null),
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
  const startLabel = () => ts('common.start');
  const endLabel = () => ts('common.end');
  const startAriaLabel = () => ts('datetime.startDate');
  const endAriaLabel = () => ts('datetime.endDate');
  const calendarLabel = () => ts('calendar.rangeLabel');

  const isDateDisabled = (iso: string): boolean => {
    if (props.min && iso < props.min) return true;
    if (props.max && iso > props.max) return true;
    return false;
  };

  const openCalendar = (field: 'start' | 'end') => {
    if (props.disabled) return;
    const dateStr = field === 'start' ? props.value.start : props.value.end;
    batch(() => {
      setActiveField(field);
      setPendingStart(null);
      popup.open(dateStr);
    });
  };

  const selectDay = (cell: DayCell) => {
    const iso = toIso(cell.year, cell.month, cell.day);
    if (isDateDisabled(iso)) return;

    batch(() => {
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
    });
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
      start && end && iso > start && iso < end && styles.inRange,
    );
  };

  const isDayDisabled = (cell: DayCell): boolean => isDateDisabled(toIso(cell.year, cell.month, cell.day));

  const startFieldClass = createMemo(() =>
    classNames(
      styles.field,
      popup.isOpen() && activeField() === 'start' && styles.fieldActive,
      props.disabled && styles.fieldDisabled,
    ),
  );

  const endFieldClass = createMemo(() =>
    classNames(
      styles.field,
      popup.isOpen() && activeField() === 'end' && styles.fieldActive,
      props.disabled && styles.fieldDisabled,
    ),
  );

  const handleOpenStart = () => openCalendar('start');
  const handleOpenEnd = () => openCalendar('end');
  const getDayAriaLabel = (cell: DayCell) => toIso(cell.year, cell.month, cell.day);

  return (
    <div
      ref={wrapperRef}
      class={classNames(styles.wrapper, props.class)}
      role="group"
      aria-labelledby={props['aria-labelledby']}
      aria-describedby={props['aria-describedby']}
    >
      <DropdownFieldTrigger
        id={props.id}
        class={startFieldClass()}
        size={props.size}
        label={props.value.start || startLabel()}
        labelId={startTriggerLabelId}
        labelTone={props.value.start ? 'default' : 'muted'}
        disabled={props.disabled}
        onClick={handleOpenStart}
        title={startAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={popup.isOpen() && activeField() === 'start'}
        aria-controls={popup.isOpen() ? dropdownId : undefined}
        aria-labelledby={joinAriaIds(props['aria-labelledby'], startTriggerLabelId)}
        aria-describedby={props['aria-describedby']}
        aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
        aria-errormessage={props['aria-errormessage']}
      />
      <Text as="span" variant="bodySm" tone="muted">
        {'\u2192'}
      </Text>
      <DropdownFieldTrigger
        class={endFieldClass()}
        size={props.size}
        label={props.value.end || endLabel()}
        labelId={endTriggerLabelId}
        labelTone={props.value.end ? 'default' : 'muted'}
        disabled={props.disabled}
        onClick={handleOpenEnd}
        title={endAriaLabel()}
        aria-haspopup="dialog"
        aria-expanded={popup.isOpen() && activeField() === 'end'}
        aria-controls={popup.isOpen() ? dropdownId : undefined}
        aria-labelledby={joinAriaIds(props['aria-labelledby'], endTriggerLabelId)}
        aria-describedby={props['aria-describedby']}
        aria-invalid={resolveAriaInvalid(undefined, props['aria-invalid'])}
        aria-errormessage={props['aria-errormessage']}
      />
      <Show when={popup.isOpen()}>
        <DropdownSurface
          ref={(el) => {
            panelRef = el;
          }}
          id={dropdownId}
          class={styles.dropdown}
          align="left"
          origin="topLeft"
          anchor={() => wrapperRef}
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
    </div>
  );
};

export default DateRangePicker;
