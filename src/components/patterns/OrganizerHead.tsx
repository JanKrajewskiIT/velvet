import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import type { OrganizerCalendar } from './createOrganizerCalendar';
import { countInMonth, type OrganizerEvent } from './organizerEvents';

export interface OrganizerHeadProps {
  calendar: OrganizerCalendar;
  events: OrganizerEvent[];
}

/** Month title with event count and the today, previous and next controls. */
export const OrganizerHead = (props: OrganizerHeadProps) => {
  const translate = useTranslate();
  return (
    <div class="vui-organizer__head">
      <div>
        <div class="vui-organizer__month">{props.calendar.monthLabel()}</div>
        <div class="vui-organizer__sub">
          {translate('velvet.patterns.calendarOrganizer.monthEvents', {
            count: countInMonth(props.events, props.calendar.view()),
          })}
        </div>
      </div>
      <div class="vui-organizer__nav">
        <Button variant="secondary" size="sm" onClick={props.calendar.goToday}>
          {translate('velvet.common.today')}
        </Button>
        <IconButton
          icon="chevron-left"
          label={translate('velvet.patterns.calendarOrganizer.previousMonth')}
          size="sm"
          onClick={() => props.calendar.shiftMonth(-1)}
        />
        <IconButton
          icon="chevron-right"
          label={translate('velvet.patterns.calendarOrganizer.nextMonth')}
          size="sm"
          onClick={() => props.calendar.shiftMonth(1)}
        />
      </div>
    </div>
  );
};
