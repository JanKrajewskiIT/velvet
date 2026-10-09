import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
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
  const dayEvents = () => layoutEvents(config().events.filter((e) => sameDay(e.start, props.day)));
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
      role={config().onSlotClick ? 'button' : undefined}
      tabIndex={config().onSlotClick ? 0 : undefined}
      aria-label={
        config().onSlotClick
          ? translate('velvet.data.scheduler.addEventOn', {
              date: fmtDate(props.day, props.scheduler.locale(), WEEKDAY_LONG),
            })
          : undefined
      }
      onClick={(e) => slots.onClick(props.day, e)}
      onKeyDown={(e) => config().onSlotClick && slots.onKeyDown(props.day, e)}
    >
      <For each={dayEvents()}>
        {({ event, lane, lanes }) => (
          <SchedulerEventBlock scheduler={props.scheduler} event={event} lane={lane} lanes={lanes} />
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
