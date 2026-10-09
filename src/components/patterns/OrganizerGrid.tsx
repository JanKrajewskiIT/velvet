import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { fmtDate, sameDay, ymd } from '../../utils/date';
import { Weekday } from '../primitives/Weekday';
import type { OrganizerCalendar } from './createOrganizerCalendar';
import type { OrganizerDrag } from './createOrganizerDrag';
import type { OrganizerEvent } from './organizerEvents';
import { sameMonth } from './organizerMonth';

export interface OrganizerGridProps {
  calendar: OrganizerCalendar;
  drag: OrganizerDrag;
  eventsOn: (day: Date) => OrganizerEvent[];
  /** Chips per cell. */
  maxChips: number;
}

/** Weekday header and the month's day grid with event chips; arrow keys move between days. */
export const OrganizerGrid = (props: OrganizerGridProps) => {
  const translate = useTranslate();
  return (
    <>
      <div class="vui-organizer__wd" aria-hidden="true">
        <For each={props.calendar.weekdays()}>{(name) => <Weekday>{name}</Weekday>}</For>
      </div>
      <div
        role="grid"
        tabIndex={-1}
        aria-label={props.calendar.monthLabel()}
        class="vui-organizer__grid"
        onKeyDown={(e) => props.calendar.onGridKeyDown(e)}
      >
        <For each={props.calendar.days()}>
          {(d) => {
            const list = () => props.eventsOn(d);
            const on = () => sameDay(d, props.calendar.selected());
            const label = () => {
              const count = list().length;
              const date = fmtDate(d, props.calendar.locale(), { weekday: 'long', month: 'long', day: 'numeric' });
              return count ? translate('velvet.patterns.calendarOrganizer.dayEvents', { date, count }) : date;
            };
            return (
              <button
                type="button"
                role="gridcell"
                data-k={ymd(d)}
                tabIndex={ymd(d) === props.calendar.tabStop() ? 0 : -1}
                aria-selected={on()}
                aria-label={label()}
                class={cx(
                  'vui-organizer__day',
                  !sameMonth(d, props.calendar.view()) && 'vui-organizer__day--out',
                  on() && 'vui-organizer__day--sel',
                  sameDay(d, props.calendar.today()) && 'vui-organizer__day--today',
                  props.drag.dropKey() === ymd(d) && 'vui-organizer__day--drop',
                )}
                onClick={() => props.calendar.pick(d)}
                onDragOver={(e) => props.drag.dragOverDay(e, d)}
                onDragLeave={() => props.drag.dragLeaveDay(d)}
                onDrop={(e) => props.drag.dropOnDay(e, d)}
              >
                <span class="vui-organizer__num">{d.getDate()}</span>
                <span class="vui-organizer__chips">
                  <For each={list().slice(0, props.maxChips)}>
                    {(event) => (
                      <span class="vui-organizer__chip" style={{ '--ec': event.color ?? 'var(--dv-1)' }}>
                        <Show when={event.time}>
                          <b>{event.time}</b>
                        </Show>
                        {event.title}
                      </span>
                    )}
                  </For>
                  <Show when={list().length > props.maxChips}>
                    <span class="vui-organizer__more">
                      {translate('velvet.patterns.calendarOrganizer.more', {
                        count: list().length - props.maxChips,
                      })}
                    </span>
                  </Show>
                </span>
              </button>
            );
          }}
        </For>
      </div>
    </>
  );
};
