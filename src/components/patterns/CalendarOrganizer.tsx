import { useI18n } from '@jankrajewskiit/i18n';
import { createMemo, mergeProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { ymd } from '../../utils/date';
import { createOrganizerCalendar } from './createOrganizerCalendar';
import { createOrganizerDrag } from './createOrganizerDrag';
import { createOrganizerEditing } from './createOrganizerEditing';
import { OrganizerDayPanel } from './OrganizerDayPanel';
import { eventsByDay, type OrganizerEvent } from './organizerEvents';
import { OrganizerGrid } from './OrganizerGrid';
import { OrganizerHead } from './OrganizerHead';

export interface CalendarOrganizerProps {
  events: OrganizerEvent[];
  /** Enables add, edit, delete and drag-to-move. */
  onEventsChange?: (events: OrganizerEvent[]) => void;
  onEventClick?: (event: OrganizerEvent) => void;
  defaultMonth?: Date;
  /** Called with the first day of the month the grid now shows. */
  onMonthChange?: (month: Date) => void;
  /** Controlled selected day. */
  selectedDate?: Date;
  defaultSelectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;
  /** Reference API aliases; selectedDate and its callback take precedence. */
  selected?: Date | string;
  defaultSelected?: Date;
  onSelectedChange?: (date: Date) => void;
  /** Ask inline before deleting an event. @default true */
  confirmDelete?: boolean;
  /** Drag an event from the day panel onto a day to move it. Needs `onEventsChange`. @default true */
  draggableEvents?: boolean;
  /** 0 = Sunday. @default 1 */
  weekStartsOn?: number;
  /** @default the active i18n locale */
  locale?: string;
  /** Chips per cell. @default 2 */
  maxChips?: number;
  class?: string;
}

/** Month planner: day grid with event chips beside a detail panel for the selected day, with quick add, edit, delete and drag-to-move. Multi-day events span their days. Arrow keys move between days. */
export const CalendarOrganizer = (props: CalendarOrganizerProps) => {
  const p = mergeProps(
    {
      weekStartsOn: 1,
      maxChips: 2,
      draggableEvents: true,
      confirmDelete: true,
    } satisfies Partial<CalendarOrganizerProps>,
    props,
  );
  const i18n = useI18n();
  const locale = () => p.locale ?? i18n.locale();
  const calendar = createOrganizerCalendar(p, locale);
  const drag = createOrganizerDrag(p);
  const editing = createOrganizerEditing(p, calendar);

  const canEdit = () => !!p.onEventsChange;
  const byDay = createMemo(() => eventsByDay(p.events));
  const eventsOn = (d: Date): OrganizerEvent[] => byDay().get(ymd(d)) ?? [];

  return (
    <div class={cx('vui-organizer', p.class)}>
      <div class="vui-organizer__main">
        <OrganizerHead calendar={calendar} events={p.events} />
        <OrganizerGrid calendar={calendar} drag={drag} eventsOn={eventsOn} maxChips={p.maxChips} />
      </div>
      <OrganizerDayPanel
        calendar={calendar}
        editing={editing}
        drag={drag}
        events={eventsOn(calendar.selected())}
        editable={canEdit()}
        draggableEvents={p.draggableEvents}
        confirmDelete={p.confirmDelete}
        onEventClick={p.onEventClick}
      />
    </div>
  );
};
