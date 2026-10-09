import { type I18nKey, useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, For, type JSX, mergeProps, onCleanup, onMount, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { addDays, fmtDate, minutesOfDay, sameDay, startOfDay } from '../../utils/date';
import { Polymorphic } from '../../utils/polymorphic';
import { Button } from '../actions/Button';
import { ButtonGroup } from '../actions/ButtonGroup';
import { IconButton } from '../actions/IconButton';
import { Weekday } from '../primitives/Weekday';
import { cssLength } from './rowData';
import { layoutEvents } from './schedulerLayout';

export type SchedulerView = 'day' | 'week';

export interface SchedulerEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  /** Status or label tone. @default 'brand' */
  tone?: string;
  /** Shown after the time — room, owner. */
  meta?: string;
}

export interface SchedulerProps {
  events?: SchedulerEvent[];
  view?: SchedulerView;
  /** @default 'week' */
  defaultView?: SchedulerView;
  onViewChange?: (view: SchedulerView) => void;
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** @default 8 */
  startHour?: number;
  /** @default 19 */
  endHour?: number;
  /** Initial scroll position of the grid — e.g. `startHour={0} endHour={24} scrollToHour={8}` shows the full day but opens on working hours. */
  scrollToHour?: number;
  /** Snap for slot clicks. @default 30 */
  slotMinutes?: number;
  /** px per hour. @default 52 */
  hourHeight?: number;
  /** 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: number;
  hideWeekends?: boolean;
  hour12?: boolean;
  /** @default the active i18n locale */
  locale?: string;
  /** Makes events buttons. */
  onEventClick?: (event: SchedulerEvent) => void;
  onSlotClick?: (start: Date, end: Date) => void;
  /** Scroll height of the grid. @default 520 */
  maxHeight?: number | string;
  class?: string;
}

const VIEWS: { value: SchedulerView; labelKey: I18nKey }[] = [
  { value: 'day', labelKey: 'velvet.data.scheduler.viewDay' },
  { value: 'week', labelKey: 'velvet.data.scheduler.viewWeek' },
];
const NOW_TICK_MS = 60_000;
const MINUTES_PER_DAY = 1440;
const MINUTE_MS = 60_000;
const MIN_EVENT_HEIGHT = 20;
const SHORT_EVENT_HEIGHT = 40;
const TIME_GUTTER_PX = 56;
const MIN_DAY_COLUMN_PX: Record<SchedulerView, number> = { day: 200, week: 96 };
const DEFAULT_CREATE_HOUR = 9;
const WEEKDAY_LONG: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

/** Day / week time grid for bookings, shifts and meetings. Overlapping events split into lanes, a now-line marks the current time, clicking an empty slot reports the slot (snap to `slotMinutes`) so you can open a create dialog. Use EventCalendar for a month overview, Timeline for sequences without a clock. */
export const Scheduler = (props: SchedulerProps): JSX.Element => {
  const p = mergeProps(
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
  const i18n = useI18n();
  const locale = () => p.locale ?? i18n.locale();
  const [view, setView] = createControllable<SchedulerView>({
    value: () => p.view,
    defaultValue: p.defaultView,
    onChange: (v) => p.onViewChange?.(v),
  });
  const [date, setDate] = createControllable<Date>({
    value: () => (p.date ? startOfDay(p.date) : undefined),
    defaultValue: startOfDay(p.defaultDate ?? new Date()),
    onChange: (d) => p.onDateChange?.(d),
  });
  const [now, setNow] = createSignal(new Date());
  let frame!: HTMLDivElement;

  onMount(() => {
    const timer = setInterval(() => setNow(new Date()), NOW_TICK_MS);
    onCleanup(() => clearInterval(timer));
  });

  createEffect(() => {
    view();
    const hour = p.scrollToHour;
    if (hour != null) frame.scrollTop = Math.max(0, (hour - p.startHour) * p.hourHeight);
  });

  const timeFormat = createMemo(
    () =>
      new Intl.DateTimeFormat(locale(), {
        hour: p.hour12 ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: p.hour12,
      }),
  );
  const formatTime = (d: Date) => timeFormat().format(d);

  const days = createMemo(() => {
    const current = date();
    if (view() === 'day') return [current];
    const weekStart = addDays(current, -((current.getDay() - p.weekStartsOn + 7) % 7));
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).filter((d) => !p.hideWeekends || !isWeekend(d));
  });
  const step = () => (view() === 'day' ? 1 : 7);
  const hours = () => p.endHour - p.startHour;
  const pxPerMinute = () => p.hourHeight / 60;
  const gridHeight = () => hours() * p.hourHeight;

  const range = () => {
    const [first] = days();
    const last = days()[days().length - 1];
    if (view() === 'day' || !first || !last) return fmtDate(date(), locale(), { ...WEEKDAY_LONG, year: 'numeric' });
    const sameMonth = first.getMonth() === last.getMonth();
    const start = fmtDate(first, locale(), { month: 'short', day: 'numeric' });
    const end = fmtDate(last, locale(), { month: sameMonth ? undefined : 'short', day: 'numeric', year: 'numeric' });
    return `${start} – ${end}`;
  };

  const createSlot = (day: Date, minutes: number) => {
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(minutes / 60), minutes % 60);
    p.onSlotClick?.(start, new Date(+start + p.slotMinutes * MINUTE_MS));
  };

  const onSlotClick = (day: Date, e: MouseEvent & { currentTarget: HTMLElement }) => {
    if (!p.onSlotClick || (e.target instanceof Element && e.target.closest('.vui-sched__evt'))) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = Math.floor((e.clientY - rect.top) / pxPerMinute() / p.slotMinutes) * p.slotMinutes;
    createSlot(day, offset + p.startHour * 60);
  };

  const onSlotKey = (day: Date, e: KeyboardEvent & { currentTarget: HTMLElement }) => {
    if (e.target !== e.currentTarget || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    const hour = sameDay(day, now())
      ? Math.min(p.endHour - 1, Math.max(p.startHour, now().getHours() + 1))
      : Math.max(p.startHour, DEFAULT_CREATE_HOUR);
    createSlot(day, hour * 60);
  };

  const eventStyle = (e: SchedulerEvent, lane: number, lanes: number) => {
    const startMinutes = minutesOfDay(e.start);
    const top = Math.max(0, (startMinutes - p.startHour * 60) * pxPerMinute());
    const visibleEnd = Math.min(minutesOfDay(e.end) || MINUTES_PER_DAY, p.endHour * 60);
    const height = Math.max(
      MIN_EVENT_HEIGHT,
      (visibleEnd - Math.max(startMinutes, p.startHour * 60)) * pxPerMinute() - 2,
    );
    const style: JSX.CSSProperties = {
      top: `${top}px`,
      height: `${height}px`,
      left: `calc(${(lane / lanes) * 100}% + 2px)`,
      width: `calc(${100 / lanes}% - 4px)`,
    };
    return { style, short: height < SHORT_EVENT_HEIGHT };
  };

  return (
    <div class={cx('vui-sched', p.class)}>
      <div class="vui-sched__bar">
        <Button variant="secondary" size="sm" onClick={() => setDate(startOfDay(new Date()))}>
          {translate('velvet.common.today')}
        </Button>
        <ButtonGroup label={translate('velvet.data.scheduler.navigateLabel')}>
          <IconButton
            icon="chevron-left"
            label={translate(
              view() === 'day' ? 'velvet.data.scheduler.previousDay' : 'velvet.data.scheduler.previousWeek',
            )}
            variant="secondary"
            size="sm"
            onClick={() => setDate(addDays(date(), -step()))}
          />
          <IconButton
            icon="chevron-right"
            label={translate(view() === 'day' ? 'velvet.data.scheduler.nextDay' : 'velvet.data.scheduler.nextWeek')}
            variant="secondary"
            size="sm"
            onClick={() => setDate(addDays(date(), step()))}
          />
        </ButtonGroup>
        <h3 class="vui-sched__range" aria-live="polite">
          {range()}
        </h3>
        <ButtonGroup label={translate('velvet.data.scheduler.viewLabel')}>
          <For each={VIEWS}>
            {(option) => (
              <Button
                variant="secondary"
                size="sm"
                aria-pressed={view() === option.value}
                onClick={() => setView(option.value)}
              >
                {translate(option.labelKey)}
              </Button>
            )}
          </For>
        </ButtonGroup>
      </div>
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
            'grid-template-columns': `${TIME_GUTTER_PX}px repeat(${days().length}, minmax(${MIN_DAY_COLUMN_PX[view()]}px, 1fr))`,
          }}
        >
          <div class="vui-sched__corner" />
          <For each={days()}>
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
          <For each={days()}>
            {(day) => {
              const dayEvents = () => layoutEvents(p.events.filter((e) => sameDay(e.start, day)));
              const nowMinutes = () => minutesOfDay(now()) - p.startHour * 60;
              const showNow = () => sameDay(day, now()) && nowMinutes() >= 0 && nowMinutes() <= hours() * 60;
              return (
                <div
                  class={cx(
                    'vui-sched__col',
                    isWeekend(day) && 'vui-sched__col--weekend',
                    p.onSlotClick && 'vui-sched__col--click',
                  )}
                  style={{ height: `${gridHeight()}px`, 'background-size': `100% ${p.hourHeight}px` }}
                  role={p.onSlotClick ? 'button' : undefined}
                  tabIndex={p.onSlotClick ? 0 : undefined}
                  aria-label={
                    p.onSlotClick
                      ? translate('velvet.data.scheduler.addEventOn', { date: fmtDate(day, locale(), WEEKDAY_LONG) })
                      : undefined
                  }
                  onClick={(e) => onSlotClick(day, e)}
                  onKeyDown={(e) => p.onSlotClick && onSlotKey(day, e)}
                >
                  <For each={dayEvents()}>
                    {({ event, lane, lanes }) => {
                      const geometry = () => eventStyle(event, lane, lanes);
                      return (
                        <Polymorphic
                          tag={p.onEventClick ? 'button' : 'div'}
                          type={p.onEventClick ? 'button' : undefined}
                          data-tone={event.tone ?? 'brand'}
                          class={cx('vui-sched__evt', geometry().short && 'vui-sched__evt--short')}
                          style={geometry().style}
                          onClick={p.onEventClick ? () => p.onEventClick?.(event) : undefined}
                          aria-label={translate('velvet.data.scheduler.eventLabel', {
                            title: event.title,
                            start: formatTime(event.start),
                            end: formatTime(event.end),
                          })}
                        >
                          <span class="vui-sched__et">{event.title}</span>
                          <span class="vui-sched__em">
                            {`${formatTime(event.start)} – ${formatTime(event.end)}`}
                            {event.meta && !geometry().short ? ` · ${event.meta}` : ''}
                          </span>
                        </Polymorphic>
                      );
                    }}
                  </For>
                  <Show when={showNow()}>
                    <span
                      class="vui-sched__now"
                      style={{ top: `${nowMinutes() * pxPerMinute()}px` }}
                      aria-hidden="true"
                    />
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};
