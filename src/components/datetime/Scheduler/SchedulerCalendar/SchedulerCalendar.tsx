import { Show } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import type { DayCell } from '~/utils/datetime';
import { toIso } from '~/utils/datetime';

import CalendarGrid from '../../Calendar/CalendarGrid/CalendarGrid';
import CalendarHeader from '../../Calendar/CalendarHeader/CalendarHeader';
import styles from './SchedulerCalendar.module.css';

interface SchedulerCalendarProps {
  monthLabel: string;
  dayNames: readonly string[];
  gridDays: readonly DayCell[];
  selectedDate: string;
  todayIso: string;
  dragOverDate: string | null;
  showAdjacentDays: boolean;
  eventsByDate: ReadonlyMap<string, readonly unknown[]>;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (iso: string) => void;
  onOpenCreateForDate: (iso: string) => void;
  onDayDragOver: (cell: DayCell, event: DragEvent) => void;
  onDayDrop: (cell: DayCell, event: DragEvent) => void;
  onDayDragLeave: (cell: DayCell) => void;
}

const SchedulerCalendar = (props: Props<SchedulerCalendarProps>) => {
  const cellIso = (cell: DayCell): string => toIso(cell.year, cell.month, cell.day);
  const getEventsCount = (iso: string) => props.eventsByDate.get(iso)?.length ?? 0;

  const dayButtonClass = (cell: DayCell): string => {
    const iso = cellIso(cell);

    return classNames(
      styles.dayCell,
      cell.outside && styles.dayOutside,
      iso === props.selectedDate && styles.daySelected,
      iso === props.todayIso && styles.dayToday,
      props.dragOverDate === iso && styles.dayDragOver,
    );
  };

  const getDayAriaPressed = (cell: DayCell) => cellIso(cell) === props.selectedDate;
  const handleSelectDay = (cell: DayCell) => props.onSelectDate(cellIso(cell));
  const handleDayDoubleClick = (cell: DayCell) => props.onOpenCreateForDate(cellIso(cell));
  const shouldRenderDay = (cell: DayCell) => props.showAdjacentDays || !cell.outside;

  const renderDayContent = (cell: DayCell) => {
    const iso = cellIso(cell);
    const eventsCount = getEventsCount(iso);

    return (
      <>
        <Text as="span" variant="caption" tone={cell.outside ? 'tertiary' : 'default'}>
          {cell.day}
        </Text>
        <Show when={eventsCount > 0}>
          <Text as="span" variant="caption" tone="primary" class={styles.dayBadge}>
            {eventsCount}
          </Text>
        </Show>
      </>
    );
  };

  return (
    <>
      <CalendarHeader
        class={styles.calendarHeader}
        monthLabel={props.monthLabel}
        onPrevious={props.onPreviousMonth}
        onNext={props.onNextMonth}
        titleContent={
          <Heading as="h3" level={3}>
            {props.monthLabel}
          </Heading>
        }
      />

      <CalendarGrid
        dayLabels={props.dayNames}
        days={props.gridDays}
        weekdayLabelClass={styles.weekdayLabel}
        dayClass={dayButtonClass}
        getDayAriaLabel={cellIso}
        getDayAriaPressed={getDayAriaPressed}
        onSelectDay={handleSelectDay}
        onDayDoubleClick={handleDayDoubleClick}
        onDayDragOver={props.onDayDragOver}
        onDayDrop={props.onDayDrop}
        onDayDragLeave={props.onDayDragLeave}
        filterDay={shouldRenderDay}
        getDayContent={renderDayContent}
      />
    </>
  );
};

export default SchedulerCalendar;
