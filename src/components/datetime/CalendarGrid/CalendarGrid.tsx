import { For, type JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { DayCell } from '../shared/calendar';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  dayLabels: string[];
  days: DayCell[];
  weekdayLabelClass?: string;
  dayClass: (cell: DayCell) => string;
  isDayDisabled?: (cell: DayCell) => boolean;
  getDayAriaLabel: (cell: DayCell) => string;
  getDayContent?: (cell: DayCell) => JSX.Element;
  onSelectDay?: (cell: DayCell) => void;
  onDayDoubleClick?: (cell: DayCell) => void;
  onDayDragOver?: (cell: DayCell, event: DragEvent) => void;
  onDayDrop?: (cell: DayCell, event: DragEvent) => void;
  onDayDragLeave?: (cell: DayCell) => void;
  filterDay?: (cell: DayCell) => boolean;
  dayButtonType?: 'button' | 'submit' | 'reset';
  getDayAriaPressed?: (cell: DayCell) => boolean | undefined;
}

const CalendarGrid = (props: Props<CalendarGridProps>) => {
  return (
    <div class={classNames(styles.calendarGrid, props.class)}>
      <For each={props.dayLabels}>
        {(label) => <span class={classNames(styles.calendarDayHeader, props.weekdayLabelClass)}>{label}</span>}
      </For>
      <For each={props.days}>
        {(cell) => {
          if (props.filterDay && !props.filterDay(cell)) {
            return null;
          }

          return (
            <button
              type={props.dayButtonType ?? 'button'}
              class={classNames(styles.calendarDay, cell.outside && styles.calendarDayOutside, props.dayClass(cell))}
              disabled={props.isDayDisabled?.(cell)}
              onClick={() => props.onSelectDay?.(cell)}
              onDblClick={() => props.onDayDoubleClick?.(cell)}
              onDragOver={(event) => props.onDayDragOver?.(cell, event)}
              onDrop={(event) => props.onDayDrop?.(cell, event)}
              onDragLeave={() => props.onDayDragLeave?.(cell)}
              aria-label={props.getDayAriaLabel(cell)}
              aria-pressed={props.getDayAriaPressed?.(cell)}
            >
              {props.getDayContent?.(cell) ?? cell.day}
            </button>
          );
        }}
      </For>
    </div>
  );
};

export default CalendarGrid;
