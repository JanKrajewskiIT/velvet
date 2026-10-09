import { createEffect, For, type JSX, mergeProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { fmtDate, sameDay } from '../../utils/date';
import { Weekday } from '../primitives/Weekday';
import { createSchedulerCalendar } from './createSchedulerCalendar';
import { createSchedulerFormat } from './createSchedulerFormat';
import { createSchedulerNow } from './createSchedulerNow';
import { cssLength } from './rowData';
import { SchedulerColumn } from './SchedulerColumn';
import type { SchedulerController } from './schedulerController';
import { SchedulerToolbar } from './SchedulerToolbar';
import type { SchedulerConfig, SchedulerProps, SchedulerView } from './schedulerTypes';

export type { SchedulerEvent, SchedulerProps, SchedulerView } from './schedulerTypes';

const TIME_GUTTER_PX = 56;
const MIN_DAY_COLUMN_PX: Record<SchedulerView, number> = { day: 200, week: 96 };

/** Day / week time grid for bookings, shifts and meetings. Overlapping events split into lanes, a now-line marks the current time, clicking an empty slot reports the slot (snap to `slotMinutes`) so you can open a create dialog. Use EventCalendar for a month overview, Timeline for sequences without a clock. */
export const Scheduler = (props: SchedulerProps): JSX.Element => {
  const p: SchedulerConfig = mergeProps(
    {
      events: [],
      defaultView: 'week',
      startHour: 8,
      endHour: 19,
      slotMinutes: 30,
      hourHeight: 52,
      weekStartsOn: 1,
      hideWeekends: false,
      hour12: false,
      maxHeight: 520,
    } satisfies Partial<SchedulerProps>,
    props,
  );
  const translate = useTranslate();
  const { locale, formatTime } = createSchedulerFormat(p);
  const calendar = createSchedulerCalendar(p, locale);
  const now = createSchedulerNow();
  const hours = () => p.endHour - p.startHour;
  const pxPerMinute = () => p.hourHeight / 60;
  const gridHeight = () => hours() * p.hourHeight;
  const scheduler: SchedulerController = {
    config: p,
    calendar,
    now,
    locale,
    formatTime,
    hours,
    pxPerMinute,
    gridHeight,
  };
  let frame!: HTMLDivElement;

  createEffect(() => {
    calendar.view();
    const hour = p.scrollToHour;
    if (hour != null) frame.scrollTop = Math.max(0, (hour - p.startHour) * p.hourHeight);
  });

  return (
    <div class={cx('vui-sched', p.class)}>
      <SchedulerToolbar scheduler={scheduler} />
      <div
        ref={frame}
        class="vui-sched__frame"
        style={{ 'max-height': cssLength(p.maxHeight) }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable schedule region must be focusable so keyboard users can scroll it
        tabIndex={0}
        aria-label={translate('velvet.data.scheduler.scheduleLabel')}
      >
        <div
          class="vui-sched__grid"
          style={{
            'grid-template-columns': `${TIME_GUTTER_PX}px repeat(${calendar.days().length}, minmax(${MIN_DAY_COLUMN_PX[calendar.view()]}px, 1fr))`,
          }}
        >
          <div class="vui-sched__corner" />
          <For each={calendar.days()}>
            {(day) => (
              <div class={cx('vui-sched__dayhead', sameDay(day, now()) && 'vui-sched__dayhead--today')}>
                <Weekday today={sameDay(day, now())} class="vui-sched__wd">
                  {fmtDate(day, locale(), { weekday: 'short' })}
                </Weekday>
                <span class="vui-sched__dn">{day.getDate()}</span>
              </div>
            )}
          </For>
          <div class="vui-sched__gutter" style={{ height: `${gridHeight()}px` }}>
            <For each={Array.from({ length: hours() }, (_, i) => i)}>
              {(i) => (
                <span class="vui-sched__hour" style={{ top: `${i * p.hourHeight}px` }}>
                  {i === 0 ? '' : formatTime(new Date(2000, 0, 1, p.startHour + i))}
                </span>
              )}
            </For>
          </div>
          <For each={calendar.days()}>{(day) => <SchedulerColumn scheduler={scheduler} day={day} />}</For>
        </div>
      </div>
    </div>
  );
};
