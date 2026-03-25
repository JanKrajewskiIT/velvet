import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';

import CalendarGrid from '../CalendarGrid/CalendarGrid';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import type { DayCell } from '../shared/calendar';

interface CalendarPanelProps {
  monthLabel: string;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  days: DayCell[];
  getDayClass: (cell: DayCell) => string;
  isDayDisabled?: (cell: DayCell) => boolean;
  getDayAriaLabel: (cell: DayCell) => string;
  onSelectDay: (cell: DayCell) => void;
}

const CalendarPanel = (props: Props<CalendarPanelProps>) => {
  const { t } = useI18n();
  const dayLabels = () => [
    t('calendar.day.mo'),
    t('calendar.day.tu'),
    t('calendar.day.we'),
    t('calendar.day.th'),
    t('calendar.day.fr'),
    t('calendar.day.sa'),
    t('calendar.day.su'),
  ];

  return (
    <div class={props.class}>
      <CalendarHeader
        monthLabel={props.monthLabel}
        previousLabel={props.previousLabel}
        nextLabel={props.nextLabel}
        onPrevious={props.onPrevious}
        onNext={props.onNext}
      />
      <CalendarGrid
        dayLabels={dayLabels()}
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
