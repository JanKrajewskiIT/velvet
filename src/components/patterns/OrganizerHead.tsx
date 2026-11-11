import { useTranslate } from '../../i18n/useTranslate';
import { PeriodNav } from '../navigation/PeriodNav';
import { Text } from '../primitives/Text';
import type { OrganizerCalendar } from './createOrganizerCalendar';
import { countInMonth, type OrganizerEvent } from './organizerEvents';
import styles from './OrganizerHead.module.css';

export interface OrganizerHeadProps {
  calendar: OrganizerCalendar;
  events: OrganizerEvent[];
}

/** Month title with event count and the today, previous and next controls. */
export const OrganizerHead = (props: OrganizerHeadProps) => {
  const translate = useTranslate();
  return (
    <div class={styles.organizerPartHead}>
      <div>
        <Text as="div" variant="h4" class="vui-organizer__month">
          {props.calendar.monthLabel()}
        </Text>
        <Text as="div" variant="caption" tone="tertiary" class={styles.organizerPartSub}>
          {translate('velvet.patterns.calendarOrganizer.monthEvents', {
            count: countInMonth(props.events, props.calendar.view()),
          })}
        </Text>
      </div>
      <PeriodNav
        onToday={() => props.calendar.goToday()}
        onPrev={() => props.calendar.shiftMonth(-1)}
        onNext={() => props.calendar.shiftMonth(1)}
        prevLabel={translate('velvet.patterns.calendarOrganizer.previousMonth')}
        nextLabel={translate('velvet.patterns.calendarOrganizer.nextMonth')}
      />
    </div>
  );
};
