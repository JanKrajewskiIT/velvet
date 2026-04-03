import type Props from '~/models/Props';
import type { DayCell } from '~/utils/datetime';

import CalendarGrid from '../CalendarGrid/CalendarGrid';
import CalendarHeader from '../CalendarHeader/CalendarHeader';

const DEFAULT_DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

interface CalendarPanelProps {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  days: DayCell[];
  getDayClass: (cell: DayCell) => string;
  isDayDisabled?: (cell: DayCell) => boolean;
  getDayAriaLabel: (cell: DayCell) => string;
  onSelectDay: (cell: DayCell) => void;
  dayLabels?: readonly string[];
}

const CalendarPanel = (props: Props<CalendarPanelProps>) => {
  return (
    <div class={props.class}>
      <CalendarHeader monthLabel={props.monthLabel} onPrevious={props.onPrevious} onNext={props.onNext} />
      <CalendarGrid
        dayLabels={props.dayLabels ?? DEFAULT_DAY_LABELS}
        days={props.days}
        dayClass={props.getDayClass}
        isDayDisabled={props.isDayDisabled}
        getDayAriaLabel={props.getDayAriaLabel}
        onSelectDay={props.onSelectDay}
      />
    </div>
  );
};

export default CalendarPanel;
