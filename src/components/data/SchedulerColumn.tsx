import { createMemo, For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { clipDayInterval } from '../../utils/calendarInterval';
import { cx } from '../../utils/cx';
import { fmtDate, minutesOfDay, sameDay } from '../../utils/date';
import { createSchedulerSlots } from './createSchedulerSlots';
import type { SchedulerController } from './schedulerController';
import { SchedulerEventBlock } from './SchedulerEventBlock';
import { isWeekend, layoutEvents, WEEKDAY_LONG } from './schedulerLayout';

export interface SchedulerColumnProps {
  scheduler: SchedulerController;
  day: Date;
}

export const SchedulerColumn = (props: SchedulerColumnProps) => {
  const translate = useTranslate();
  const slots = createSchedulerSlots(() => props.scheduler);
  const config = () => props.scheduler.config;
  const dayEvents = createMemo(() =>
    layoutEvents(
      config().events.flatMap((event) => {
        const segment = clipDayInterval(event.start, event.end, props.day, config().startHour, config().endHour);
        return segment ? [{ ...event, ...segment, original: event }] : [];
      }),
    ),
  );
  const nowMinutes = () => minutesOfDay(props.scheduler.now()) - config().startHour * 60;
  const showNow = () =>
    sameDay(props.day, props.scheduler.now()) && nowMinutes() >= 0 && nowMinutes() <= props.scheduler.hours() * 60;

  return (
    <div
      class={cx(
        'vui-sched__col',
        isWeekend(props.day) && 'vui-sched__col--weekend',
        config().onSlotClick && 'vui-sched__col--click',
      )}
      style={{ height: `${props.scheduler.gridHeight()}px`, 'background-size': `100% ${config().hourHeight}px` }}
      role={config().onSlotClick ? 'group' : undefined}
      aria-label={
        config().onSlotClick
          ? translate('velvet.data.scheduler.addEventOn', {
              date: fmtDate(props.day, props.scheduler.locale(), WEEKDAY_LONG),
            })
          : undefined
      }
      tabIndex={config().onSlotClick ? 0 : undefined}
      onClick={(e) => slots.onClick(props.day, e)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || !config().onSlotClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          slots.createSlot(props.day, slots.minutes(props.day));
        }
      }}
    >
      <Show when={config().onSlotClick}>
        <button
          type="button"
          class="vui-sched__slot"
          style={{
            top: `${(slots.minutes(props.day) - config().startHour * 60) * props.scheduler.pxPerMinute()}px`,
            height: `${config().slotMinutes * props.scheduler.pxPerMinute()}px`,
          }}
          aria-label={translate('velvet.data.scheduler.slotLabel', {
            time: props.scheduler.formatTime(slots.dateAt(props.day)),
            date: fmtDate(props.day, props.scheduler.locale(), WEEKDAY_LONG),
          })}
          onKeyDown={(event) => slots.onKeyDown(props.day, event)}
          onClick={(event) => {
            event.stopPropagation();
            slots.createSlot(props.day, slots.minutes(props.day));
          }}
        />
      </Show>
      <For each={dayEvents()}>
        {({ event, lane, lanes }) => (
          <SchedulerEventBlock
            scheduler={props.scheduler}
            event={event}
            originalEvent={event.original}
            lane={lane}
            lanes={lanes}
          />
        )}
      </For>
      <Show when={showNow()}>
        <span
          class="vui-sched__now"
          style={{ top: `${nowMinutes() * props.scheduler.pxPerMinute()}px` }}
          aria-hidden="true"
        />
      </Show>
    </div>
  );
};
