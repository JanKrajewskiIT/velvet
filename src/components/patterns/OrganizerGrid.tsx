import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { fmtDate, sameDay, ymd } from '../../utils/date';
import { Text } from '../primitives/Text';
import { Weekday } from '../primitives/Weekday';
import type { OrganizerCalendar } from './createOrganizerCalendar';
import type { OrganizerDrag } from './createOrganizerDrag';
import type { OrganizerEvent } from './organizerEvents';
import styles from './OrganizerGrid.module.css';
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
      <div class={styles.organizerPartWd} aria-hidden="true">
        <For each={props.calendar.weekdays()}>{(name) => <Weekday>{name}</Weekday>}</For>
      </div>
      <div
        ref={props.calendar.setGrid}
        role="grid"
        tabIndex={-1}
        aria-label={props.calendar.monthLabel()}
        class={styles.organizerPartGrid}
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
                  styles.organizerPartDay,
                  !sameMonth(d, props.calendar.view()) && styles.organizerPartDayVariantOut,
                  on() && styles.organizerPartDayVariantSel,
                  sameDay(d, props.calendar.today()) && styles.organizerPartDayVariantToday,
                  props.drag.dropKey() === ymd(d) && styles.organizerPartDayVariantDrop,
                )}
                onClick={() => props.calendar.pick(d)}
                onDragOver={(e) => props.drag.dragOverDay(e, d)}
                onDragLeave={() => props.drag.dragLeaveDay(d)}
                onDrop={(e) => props.drag.dropOnDay(e, d)}
              >
                <Text as="span" variant="label-sm" tone="inherit" class={styles.organizerPartNum}>
                  {d.getDate()}
                </Text>
                <span class={styles.organizerPartChips}>
                  <For each={list().slice(0, props.maxChips)}>
                    {(event) => (
                      <Text
                        as="span"
                        variant="overline"
                        tone="inherit"
                        class={styles.organizerPartChip}
                        style={{ '--ec': event.color ?? 'var(--dv-1)' }}
                      >
                        <Show when={event.time}>
                          <Text as="b" variant="overline" tone="inherit">
                            {event.time}
                          </Text>
                        </Show>
                        {event.title}
                      </Text>
                    )}
                  </For>
                  <Show when={list().length > props.maxChips}>
                    <Text as="span" variant="overline" tone="inherit" class={styles.organizerPartMore}>
                      {translate('velvet.patterns.calendarOrganizer.more', {
                        count: list().length - props.maxChips,
                      })}
                    </Text>
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
