import { For, type JSX } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import type { DayCell } from '~/utils/datetime';

import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  dayLabels: readonly string[];
  days: readonly DayCell[];
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
  const shouldRenderDay = (cell: DayCell) => !props.filterDay || props.filterDay(cell);

  return (
    <div class={classNames(styles.calendarGrid, props.class)}>
      <For each={props.dayLabels}>
        {(label) => (
          <Text
            as="span"
            variant="caption"
            tone="muted"
            class={classNames(styles.calendarDayHeader, props.weekdayLabelClass)}
          >
            {label}
          </Text>
        )}
      </For>
      <For each={props.days}>
        {(cell) => {
          if (!shouldRenderDay(cell)) {
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
