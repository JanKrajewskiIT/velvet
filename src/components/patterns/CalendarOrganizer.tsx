import { useI18n } from '@jankrajewskiit/i18n';
import { batch, createMemo, createSignal, For, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { addDays, fmtDate, sameDay, startOfDay, weekdayNames, ymd } from '../../utils/date';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { ConfirmDialog } from '../feedback/ConfirmDialog';
import { EmptyText } from '../primitives/EmptyText';
import { Weekday } from '../primitives/Weekday';
import { OrganizerEventForm } from './OrganizerEventForm';
import { OrganizerEventRow } from './OrganizerEventRow';
import {
  applyDraft,
  countInMonth,
  createEventId,
  draftFromEvent,
  type EventDraft,
  eventsByDay,
  moveEvent,
  type OrganizerEvent,
} from './organizerEvents';
import { OrganizerQuickAdd } from './OrganizerQuickAdd';

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

const DAYS_PER_WEEK = 7;
const SERIES_COUNT = 8;
const KEY_STEP: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -DAYS_PER_WEEK,
  ArrowDown: DAYS_PER_WEEK,
};
const MONTH_YEAR: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };

const firstOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);
const sameMonth = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Month planner: day grid with event chips beside a detail panel for the selected day, with quick add, edit, delete and drag-to-move. Multi-day events span their days. Arrow keys move between days. */
export const CalendarOrganizer = (props: CalendarOrganizerProps) => {
  const p = mergeProps(
    { weekStartsOn: 1, maxChips: 2, draggableEvents: true } satisfies Partial<CalendarOrganizerProps>,
    props,
  );
  const i18n = useI18n();
  const translate = useTranslate();
  const locale = () => p.locale ?? i18n.locale();
  const today = () => startOfDay(new Date());
  const [view, setView] = createSignal(firstOfMonth(p.defaultMonth ?? today()));
  const [selected, setSelected] = createControllable({
    value: () => (p.selectedDate ? startOfDay(p.selectedDate) : undefined),
    defaultValue: startOfDay(p.defaultSelectedDate ?? today()),
    onChange: (date) => p.onSelectedDateChange?.(date),
  });
  const [draft, setDraft] = createSignal<EventDraft>();
  const [pendingDelete, setPendingDelete] = createSignal<OrganizerEvent>();
  const [dragId, setDragId] = createSignal<OrganizerEvent['id']>();
  const [dropKey, setDropKey] = createSignal<string>();
  let grid: HTMLDivElement | undefined;

  const canEdit = () => !!p.onEventsChange;
  const byDay = createMemo(() => eventsByDay(p.events));
  const eventsOn = (d: Date): OrganizerEvent[] => byDay().get(ymd(d)) ?? [];

  const offset = () => (view().getDay() - p.weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  const days = createMemo(() => {
    const first = view();
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells = Math.ceil((offset() + daysInMonth) / DAYS_PER_WEEK) * DAYS_PER_WEEK;
    const start = addDays(first, -offset());
    return Array.from({ length: cells }, (_, i) => addDays(start, i));
  });
  const weekdays = () => weekdayNames(locale(), p.weekStartsOn);
  const monthLabel = () => fmtDate(view(), locale(), MONTH_YEAR);
  const selectedEvents = () => eventsOn(selected());
  /** The grid keeps one tab stop: the selected day, or the first of the month when the selection is off-screen. */
  const tabStop = () => (sameMonth(selected(), view()) ? ymd(selected()) : ymd(view()));

  const showMonth = (month: Date) => {
    const first = firstOfMonth(month);
    setView(first);
    p.onMonthChange?.(first);
  };
  const pick = (d: Date) =>
    batch(() => {
      setSelected(d);
      if (!sameMonth(d, view())) showMonth(d);
    });
  const goToday = () =>
    batch(() => {
      showMonth(today());
      setSelected(today());
    });

  const onGridKeyDown = (e: KeyboardEvent) => {
    const step = KEY_STEP[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const next = addDays(selected(), step);
    pick(next);
    grid?.querySelector<HTMLElement>(`[data-k="${ymd(next)}"]`)?.focus();
  };

  const addEvent = (title: string, time: string) => {
    const color = `var(--dv-${(p.events.length % SERIES_COUNT) + 1})`;
    p.onEventsChange?.([...p.events, { id: createEventId(), date: selected(), title, time: time || undefined, color }]);
  };
  const patchDraft = (patch: Partial<EventDraft>) => setDraft((current) => current && { ...current, ...patch });
  const saveDraft = () => {
    const current = draft();
    const applied = current && applyDraft(p.events, current);
    if (!applied) return;
    p.onEventsChange?.(applied.events);
    batch(() => {
      setDraft(undefined);
      pick(applied.date);
    });
  };
  const confirmDelete = () => {
    const target = pendingDelete();
    setPendingDelete(undefined);
    if (target) p.onEventsChange?.(p.events.filter((event) => event.id !== target.id));
  };

  const endDrag = () =>
    batch(() => {
      setDragId(undefined);
      setDropKey(undefined);
    });
  const dropOn = (day: Date) => {
    const id = dragId();
    const moved = id === undefined ? undefined : moveEvent(p.events, id, day);
    if (moved) p.onEventsChange?.(moved);
    endDrag();
  };
  const startDrag = (id: OrganizerEvent['id'], dataTransfer: DataTransfer | null) => {
    setDragId(id);
    dataTransfer?.setData('text/plain', String(id));
    if (dataTransfer) dataTransfer.effectAllowed = 'move';
  };

  return (
    <div class={cx('vui-organizer', p.class)}>
      <div class="vui-organizer__main">
        <div class="vui-organizer__head">
          <div>
            <div class="vui-organizer__month">{monthLabel()}</div>
            <div class="vui-organizer__sub">
              {translate('velvet.patterns.calendarOrganizer.monthEvents', { count: countInMonth(p.events, view()) })}
            </div>
          </div>
          <div class="vui-organizer__nav">
            <Button variant="secondary" size="sm" onClick={goToday}>
              {translate('velvet.common.today')}
            </Button>
            <IconButton
              icon="chevron-left"
              label={translate('velvet.patterns.calendarOrganizer.previousMonth')}
              size="sm"
              onClick={() => showMonth(new Date(view().getFullYear(), view().getMonth() - 1, 1))}
            />
            <IconButton
              icon="chevron-right"
              label={translate('velvet.patterns.calendarOrganizer.nextMonth')}
              size="sm"
              onClick={() => showMonth(new Date(view().getFullYear(), view().getMonth() + 1, 1))}
            />
          </div>
        </div>
        <div class="vui-organizer__wd" aria-hidden="true">
          <For each={weekdays()}>{(name) => <Weekday>{name}</Weekday>}</For>
        </div>
        <div
          ref={grid}
          role="grid"
          tabIndex={-1}
          aria-label={monthLabel()}
          class="vui-organizer__grid"
          onKeyDown={onGridKeyDown}
        >
          <For each={days()}>
            {(d) => {
              const list = () => eventsOn(d);
              const on = () => sameDay(d, selected());
              const label = () => {
                const count = list().length;
                const date = fmtDate(d, locale(), { weekday: 'long', month: 'long', day: 'numeric' });
                return count ? translate('velvet.patterns.calendarOrganizer.dayEvents', { date, count }) : date;
              };
              return (
                <button
                  type="button"
                  role="gridcell"
                  data-k={ymd(d)}
                  tabIndex={ymd(d) === tabStop() ? 0 : -1}
                  aria-selected={on()}
                  aria-label={label()}
                  class={cx(
                    'vui-organizer__day',
                    !sameMonth(d, view()) && 'vui-organizer__day--out',
                    on() && 'vui-organizer__day--sel',
                    sameDay(d, today()) && 'vui-organizer__day--today',
                    dropKey() === ymd(d) && 'vui-organizer__day--drop',
                  )}
                  onClick={() => pick(d)}
                  onDragOver={(e) => {
                    if (dragId() === undefined) return;
                    e.preventDefault();
                    setDropKey(ymd(d));
                  }}
                  onDragLeave={() => dropKey() === ymd(d) && setDropKey(undefined)}
                  onDrop={(e) => {
                    e.preventDefault();
                    dropOn(d);
                  }}
                >
                  <span class="vui-organizer__num">{d.getDate()}</span>
                  <span class="vui-organizer__chips">
                    <For each={list().slice(0, p.maxChips)}>
                      {(event) => (
                        <span class="vui-organizer__chip" style={{ '--ec': event.color ?? 'var(--dv-1)' }}>
                          <Show when={event.time}>
                            <b>{event.time}</b>
                          </Show>
                          {event.title}
                        </span>
                      )}
                    </For>
                    <Show when={list().length > p.maxChips}>
                      <span class="vui-organizer__more">
                        {translate('velvet.patterns.calendarOrganizer.more', { count: list().length - p.maxChips })}
                      </span>
                    </Show>
                  </span>
                </button>
              );
            }}
          </For>
        </div>
      </div>
      <aside class="vui-organizer__panel" aria-live="polite">
        <div class="vui-organizer__pday">{fmtDate(selected(), locale(), { weekday: 'long' })}</div>
        <div class="vui-organizer__pdate">{fmtDate(selected(), locale(), { month: 'long', day: 'numeric' })}</div>
        <Show
          when={selectedEvents().length > 0}
          fallback={
            <EmptyText icon="sun" class="vui-organizer__empty">
              <b>{translate('velvet.patterns.calendarOrganizer.emptyTitle')}</b>
              <span>{translate('velvet.patterns.calendarOrganizer.emptyDescription')}</span>
            </EmptyText>
          }
        >
          <ul class="vui-organizer__list">
            <For each={selectedEvents()}>
              {(event) => (
                <Show
                  when={draft()?.id === event.id ? draft() : undefined}
                  fallback={
                    <OrganizerEventRow
                      event={event}
                      locale={locale()}
                      editable={canEdit()}
                      draggable={canEdit() && p.draggableEvents}
                      dragging={dragId() === event.id}
                      onSelect={() => p.onEventClick?.(event)}
                      onEdit={() => setDraft(draftFromEvent(event))}
                      onDelete={() => setPendingDelete(event)}
                      onDragStart={(dataTransfer) => startDrag(event.id, dataTransfer)}
                      onDragEnd={endDrag}
                    />
                  }
                >
                  {(current) => (
                    <OrganizerEventForm
                      draft={current()}
                      color={event.color}
                      onChange={patchDraft}
                      onSave={saveDraft}
                      onCancel={() => setDraft(undefined)}
                    />
                  )}
                </Show>
              )}
            </For>
          </ul>
        </Show>
        <Show when={canEdit()}>
          <OrganizerQuickAdd onAdd={addEvent} />
        </Show>
      </aside>
      <ConfirmDialog
        open={pendingDelete() !== undefined}
        tone="danger"
        title={translate('velvet.patterns.calendarOrganizer.deleteTitle')}
        description={translate('velvet.patterns.calendarOrganizer.deleteMessage', {
          title: pendingDelete()?.title ?? '',
        })}
        confirmLabel={translate('velvet.common.delete')}
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
