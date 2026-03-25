import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import CalendarGrid from '../CalendarGrid/CalendarGrid';
import type { DayCell } from '../shared/calendar';
import { toIso } from '../shared/calendar';
import styles from './Scheduler.module.css';

interface SchedulerCalendarProps {
  monthLabel: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  dayNames: string[];
  gridDays: DayCell[];
  selectedDate: string;
  todayIso: string;
  dragOverDate: string | null;
  showAdjacentDays: boolean;
  eventsByDate: Map<string, unknown[]>;
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

  const dayButtonClass = (cell: DayCell): string => {
    const iso = cellIso(cell);
    return classNames(
      styles.dayCell,
      cell.outside && styles.dayOutside,
      iso === props.selectedDate && styles.daySelected,
      iso === props.todayIso && styles.dayToday,
      props.dragOverDate === iso && styles.dayDragOver
    );
  };

  return (
    <>
      <header class={styles.calendarHeader}>
        <IconButton
          icon={<FiChevronLeft />}
          label={props.previousMonthLabel}
          size="sm"
          variant="outline"
          onClick={props.onPreviousMonth}
        />
        <Heading as="h3" level={3}>
          {props.monthLabel}
        </Heading>
        <IconButton
          icon={<FiChevronRight />}
          label={props.nextMonthLabel}
          size="sm"
          variant="outline"
          onClick={props.onNextMonth}
        />
      </header>

      <div class={styles.grid}>
        <CalendarGrid
          dayLabels={props.dayNames}
          days={props.gridDays}
          weekdayLabelClass={styles.weekdayLabel}
          dayClass={dayButtonClass}
          getDayAriaLabel={cellIso}
          getDayAriaPressed={(cell) => cellIso(cell) === props.selectedDate}
          onSelectDay={(cell) => props.onSelectDate(cellIso(cell))}
          onDayDoubleClick={(cell) => props.onOpenCreateForDate(cellIso(cell))}
          onDayDragOver={props.onDayDragOver}
          onDayDrop={props.onDayDrop}
          onDayDragLeave={props.onDayDragLeave}
          filterDay={(cell) => props.showAdjacentDays || !cell.outside}
          getDayContent={(cell) => {
            const iso = cellIso(cell);
            const eventsCount = props.eventsByDate.get(iso)?.length ?? 0;

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
          }}
        />
      </div>
    </>
  );
};

export default SchedulerCalendar;
