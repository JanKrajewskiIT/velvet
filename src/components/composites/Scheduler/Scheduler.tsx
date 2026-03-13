import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import { createEffect, createMemo, createSignal, For, type JSX, Show, splitProps } from 'solid-js';

import Card from '~/components/data-display/Card/Card';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import ConfirmDialog from '../../overlays/ConfirmDialog/ConfirmDialog';
import styles from './Scheduler.module.css';

interface SchedulerDayCell {
  iso: string;
  day: number;
  outside: boolean;
}

type SchedulerDragType = 'move' | 'resize-end';

export interface SchedulerEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  description?: string;
}

interface SchedulerOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  events: SchedulerEvent[];
  onEventsChange?: (events: SchedulerEvent[]) => void;
  selectedDate?: string;
  defaultSelectedDate?: string;
  onSelectedDateChange?: (date: string) => void;
  onMonthChange?: (monthIso: string) => void;
  locale?: string;
  showAdjacentDays?: boolean;
  draggableEvents?: boolean;
  emptyDayLabel?: string;
  dayNames?: string[];
}

const DAY_NAMES_DEFAULT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const pad = (value: number): string => String(value).padStart(2, '0');
const toIsoDate = (year: number, month: number, day: number): string => `${year}-${pad(month + 1)}-${pad(day)}`;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

const isoToDate = (iso: string): Date => {
  const [yearRaw, monthRaw, dayRaw] = iso.split('-');
  return new Date(Number(yearRaw), Number(monthRaw) - 1, Number(dayRaw));
};

const addDays = (iso: string, delta: number): string => {
  const date = isoToDate(iso);
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
  return toIsoDate(next.getFullYear(), next.getMonth(), next.getDate());
};

const getDateDiffInDays = (fromIso: string, toIso: string): number => {
  const from = isoToDate(fromIso);
  const to = isoToDate(toIso);
  return Math.round((to.getTime() - from.getTime()) / MS_IN_DAY);
};

const parseIsoDate = (isoDate?: string): { year: number; month: number; day: number } => {
  if (!isoDate) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }

  const [yearRaw, monthRaw, dayRaw] = isoDate.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw) - 1;
  const day = Number(dayRaw);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }
  return { year, month, day };
};

const buildMonthGrid = (year: number, month: number): SchedulerDayCell[] => {
  const firstWeekday = new Date(year, month, 1).getDay();
  const mondayOffset = (firstWeekday + 6) % 7;
  const daysInCurrent = new Date(year, month + 1, 0).getDate();
  const daysInPrevious = new Date(year, month, 0).getDate();
  const cells: SchedulerDayCell[] = [];

  for (let i = mondayOffset - 1; i >= 0; i--) {
    const day = daysInPrevious - i;
    const previousMonth = month === 0 ? 11 : month - 1;
    const previousYear = month === 0 ? year - 1 : year;
    cells.push({
      iso: toIsoDate(previousYear, previousMonth, day),
      day,
      outside: true,
    });
  }

  for (let day = 1; day <= daysInCurrent; day++) {
    cells.push({
      iso: toIsoDate(year, month, day),
      day,
      outside: false,
    });
  }

  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({
      iso: toIsoDate(nextYear, nextMonth, day),
      day,
      outside: true,
    });
  }

  return cells;
};

const Scheduler = (props: Props<SchedulerOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'events',
    'onEventsChange',
    'selectedDate',
    'defaultSelectedDate',
    'onSelectedDateChange',
    'onMonthChange',
    'locale',
    'showAdjacentDays',
    'draggableEvents',
    'emptyDayLabel',
    'dayNames',
    'class',
  ]);
  const now = new Date();
  const [internalSelectedDate, setInternalSelectedDate] = createSignal(
    local.defaultSelectedDate ?? toIsoDate(now.getFullYear(), now.getMonth(), now.getDate())
  );
  const [viewYear, setViewYear] = createSignal(now.getFullYear());
  const [viewMonth, setViewMonth] = createSignal(now.getMonth());
  createEffect(() => {
    const parts = parseIsoDate(local.selectedDate ?? internalSelectedDate());
    setViewYear(parts.year);
    setViewMonth(parts.month);
  });

  const selectedDate = () => local.selectedDate ?? internalSelectedDate();
  const dayNames = () => local.dayNames ?? DAY_NAMES_DEFAULT;
  const showAdjacentDays = () => local.showAdjacentDays ?? true;
  const draggableEvents = () => local.draggableEvents ?? true;
  const canEditEvents = () => Boolean(local.onEventsChange);
  const [dragState, setDragState] = createSignal<{ eventId: string; type: SchedulerDragType } | null>(null);
  const [dragOverDate, setDragOverDate] = createSignal<string | null>(null);
  const [createOpen, setCreateOpen] = createSignal(false);
  const [draftTitle, setDraftTitle] = createSignal('');
  const [draftTime, setDraftTime] = createSignal('');
  const [draftEndDate, setDraftEndDate] = createSignal('');
  const [draftDescription, setDraftDescription] = createSignal('');
  const [editingEventId, setEditingEventId] = createSignal<string | null>(null);
  const [editTitle, setEditTitle] = createSignal('');
  const [editTime, setEditTime] = createSignal('');
  const [editEndDate, setEditEndDate] = createSignal('');
  const [editDescription, setEditDescription] = createSignal('');
  const [deleteConfirmEventId, setDeleteConfirmEventId] = createSignal<string | null>(null);
  let createTitleInputRef: HTMLInputElement | undefined;
  let editTitleInputRef: HTMLInputElement | undefined;

  const monthLabel = createMemo(() =>
    new Date(viewYear(), viewMonth(), 1).toLocaleString(local.locale ?? 'en', {
      month: 'long',
      year: 'numeric',
    })
  );

  const gridDays = createMemo(() => buildMonthGrid(viewYear(), viewMonth()));

  const eventsByDate = createMemo(() => {
    const map = new Map<string, SchedulerEvent[]>();
    for (const event of local.events) {
      const endDate = event.endDate ?? event.date;
      const startDate = event.date <= endDate ? event.date : endDate;
      const finishDate = event.date <= endDate ? endDate : event.date;
      const spanInDays = Math.max(0, getDateDiffInDays(startDate, finishDate));
      for (let offset = 0; offset <= spanInDays; offset += 1) {
        const dayIso = addDays(startDate, offset);
        if (!map.has(dayIso)) {
          map.set(dayIso, []);
        }
        map.get(dayIso)?.push(event);
      }
    }
    return map;
  });

  const selectedDayEvents = createMemo(() => eventsByDate().get(selectedDate()) ?? []);
  const todayIso = toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());

  const setSelectedDate = (nextDate: string) => {
    setInternalSelectedDate(nextDate);
    local.onSelectedDateChange?.(nextDate);
  };

  const goToPreviousMonth = () => {
    if (viewMonth() === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
      return;
    }
    setViewMonth((month) => month - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth() === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
      return;
    }
    setViewMonth((month) => month + 1);
  };

  const goToToday = () => {
    const today = new Date();
    const iso = toIsoDate(today.getFullYear(), today.getMonth(), today.getDate());
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(iso);
  };

  const resetDraft = () => {
    setDraftTitle('');
    setDraftTime('');
    setDraftEndDate('');
    setDraftDescription('');
  };

  const openCreateForDate = (date: string) => {
    if (!canEditEvents()) return;
    resetEdit();
    setSelectedDate(date);
    setCreateOpen(true);
    resetDraft();
  };

  const closeCreate = () => {
    setCreateOpen(false);
    resetDraft();
  };

  const resetEdit = () => {
    setEditingEventId(null);
    setEditTitle('');
    setEditTime('');
    setEditEndDate('');
    setEditDescription('');
  };

  const createEvent = (e: SubmitEvent) => {
    e.preventDefault();
    if (!local.onEventsChange) return;
    const title = draftTitle().trim();
    if (!title) return;

    const rawEndDate = draftEndDate();
    const selected = selectedDate();
    const normalizedEndDate =
      rawEndDate.length > 0 && rawEndDate >= selected && rawEndDate !== selected ? rawEndDate : undefined;
    const descriptionValue = draftDescription().trim();

    const nextEvent: SchedulerEvent = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `event-${Date.now()}`,
      title,
      date: selectedDate(),
      endDate: normalizedEndDate,
      time: draftTime() || undefined,
      description: descriptionValue || undefined,
    };
    local.onEventsChange([...local.events, nextEvent]);
    closeCreate();
  };

  const openEdit = (event: SchedulerEvent) => {
    if (!canEditEvents()) return;
    closeCreate();
    setEditingEventId(event.id);
    setEditTitle(event.title);
    setEditTime(event.time ?? '');
    setEditEndDate(event.endDate ?? '');
    setEditDescription(event.description ?? '');
  };

  const saveEdit = (eventId: string, e: SubmitEvent) => {
    e.preventDefault();
    if (!local.onEventsChange) return;
    const title = editTitle().trim();
    if (!title) return;
    const source = local.events.find((item) => item.id === eventId);
    if (!source) return;

    const rawEndDate = editEndDate();
    const normalizedEndDate =
      rawEndDate && rawEndDate >= source.date && rawEndDate !== source.date ? rawEndDate : undefined;
    const descriptionValue = editDescription().trim();

    const nextEvents = local.events.map((item) =>
      item.id === eventId
        ? {
            ...item,
            title,
            time: editTime() || undefined,
            endDate: normalizedEndDate,
            description: descriptionValue || undefined,
          }
        : item
    );
    local.onEventsChange(nextEvents);
    resetEdit();
  };

  const deleteEvent = (eventId: string) => {
    if (!local.onEventsChange) return;
    local.onEventsChange(local.events.filter((item) => item.id !== eventId));
    if (editingEventId() === eventId) {
      resetEdit();
    }
    setDeleteConfirmEventId(null);
  };

  const requestDeleteEvent = (eventId: string) => {
    if (!canEditEvents()) return;
    setDeleteConfirmEventId(eventId);
  };

  const moveEventToDate = (eventId: string, targetDate: string) => {
    const event = local.events.find((item) => item.id === eventId);
    if (!event) return;
    if (event.date === targetDate) return;

    const offset = getDateDiffInDays(event.date, targetDate);
    const nextStartDate = targetDate;
    const nextEndDate = event.endDate ? addDays(event.endDate, offset) : undefined;
    const nextEvents = local.events.map((item) =>
      item.id === eventId
        ? {
            ...item,
            date: nextStartDate,
            endDate: nextEndDate,
          }
        : item
    );
    local.onEventsChange?.(nextEvents);
  };

  const resizeEventEndDate = (eventId: string, targetDate: string) => {
    const event = local.events.find((item) => item.id === eventId);
    if (!event) return;
    const nextEndDate = targetDate < event.date ? event.date : targetDate;
    const nextEvents = local.events.map((item) =>
      item.id === eventId
        ? {
            ...item,
            endDate: nextEndDate === item.date ? undefined : nextEndDate,
          }
        : item
    );
    local.onEventsChange?.(nextEvents);
  };

  const dayButtonClass = (cell: SchedulerDayCell) =>
    classNames(
      styles.dayCell,
      cell.outside && styles.dayOutside,
      cell.iso === selectedDate() && styles.daySelected,
      cell.iso === todayIso && styles.dayToday,
      dragOverDate() === cell.iso && styles.dayDragOver
    );

  const eventLabel = (event: SchedulerEvent): string => {
    if (!event.endDate || event.endDate === event.date) return event.date;
    return `${event.date} - ${event.endDate}`;
  };

  const handleDayDragOver = (cell: SchedulerDayCell, e: DragEvent) => {
    if (!draggableEvents() || !local.onEventsChange) return;
    if (!dragState()) return;
    e.preventDefault();
    setDragOverDate(cell.iso);
  };

  const handleDayDrop = (cell: SchedulerDayCell, e: DragEvent) => {
    if (!draggableEvents() || !local.onEventsChange) return;
    e.preventDefault();
    const activeDrag = dragState();
    if (activeDrag?.eventId) {
      if (activeDrag.type === 'move') {
        moveEventToDate(activeDrag.eventId, cell.iso);
      } else {
        resizeEventEndDate(activeDrag.eventId, cell.iso);
      }
      setSelectedDate(cell.iso);
    }
    setDragState(null);
    setDragOverDate(null);
  };

  const handleDayDragLeave = (cell: SchedulerDayCell) => {
    if (dragOverDate() === cell.iso) {
      setDragOverDate(null);
    }
  };

  const handleEventDragStart = (eventId: string, type: SchedulerDragType, e: DragEvent) => {
    if (!draggableEvents() || !local.onEventsChange) return;
    setDragState({ eventId, type });
    e.dataTransfer?.setData('text/plain', eventId);
  };

  const handleEventDragEnd = () => {
    setDragState(null);
    setDragOverDate(null);
  };

  useEscapeKey(
    () => createOpen() || editingEventId() !== null,
    () => {
      if (editingEventId()) {
        resetEdit();
        return;
      }
      if (createOpen()) {
        closeCreate();
      }
    }
  );

  createEffect(() => {
    local.onMonthChange?.(`${viewYear()}-${pad(viewMonth() + 1)}`);
  });

  createEffect(() => {
    if (createOpen()) {
      queueMicrotask(() => {
        createTitleInputRef?.focus();
      });
    }
  });

  createEffect(() => {
    if (editingEventId()) {
      queueMicrotask(() => {
        editTitleInputRef?.focus();
      });
    }
  });

  return (
    <div {...rest} class={classNames(styles.scheduler, local.class)}>
      <Card class={styles.calendarPanel}>
        <header class={styles.calendarHeader}>
          <button type="button" class={styles.navButton} onClick={goToPreviousMonth} aria-label="Previous month">
            <FiChevronLeft />
          </button>
          <h3 class={styles.monthLabel}>{monthLabel()}</h3>
          <button type="button" class={styles.navButton} onClick={goToNextMonth} aria-label="Next month">
            <FiChevronRight />
          </button>
        </header>

        <div class={styles.weekHeader}>
          <For each={dayNames()}>{(dayName) => <span class={styles.weekDay}>{dayName}</span>}</For>
        </div>

        <div class={styles.grid}>
          <For each={gridDays()}>
            {(cell) => (
              <Show when={showAdjacentDays() || !cell.outside}>
                <button
                  type="button"
                  class={dayButtonClass(cell)}
                  onClick={() => setSelectedDate(cell.iso)}
                  onDblClick={() => openCreateForDate(cell.iso)}
                  onDragOver={(e) => handleDayDragOver(cell, e)}
                  onDrop={(e) => handleDayDrop(cell, e)}
                  onDragLeave={() => handleDayDragLeave(cell)}
                  aria-pressed={cell.iso === selectedDate()}
                  aria-label={cell.iso}
                >
                  <span>{cell.day}</span>
                  <Show when={(eventsByDate().get(cell.iso)?.length ?? 0) > 0}>
                    <span class={styles.dayBadge}>{eventsByDate().get(cell.iso)?.length}</span>
                  </Show>
                </button>
              </Show>
            )}
          </For>
        </div>
      </Card>

      <Card class={styles.eventsPanel}>
        <div class={styles.eventsHeader}>
          <h4 class={styles.eventsTitle}>Agenda</h4>
          <div class={styles.eventsHeaderActions}>
            <Show when={canEditEvents()}>
              <button type="button" class={styles.addButton} onClick={() => openCreateForDate(selectedDate())}>
                Add event
              </button>
            </Show>
            <button type="button" class={styles.todayButton} onClick={goToToday}>
              Today
            </button>
          </div>
        </div>
        <p class={styles.selectedDateLabel}>{selectedDate()}</p>
        <Show when={createOpen()}>
          <form class={styles.createForm} onSubmit={createEvent}>
            <input
              ref={createTitleInputRef}
              type="text"
              class={styles.createInput}
              placeholder="Event title"
              value={draftTitle()}
              onInput={(event) => setDraftTitle(event.currentTarget.value)}
              required
            />
            <div class={styles.createRow}>
              <input
                type="time"
                class={styles.createInput}
                value={draftTime()}
                onInput={(event) => setDraftTime(event.currentTarget.value)}
              />
              <input
                type="date"
                class={styles.createInput}
                min={selectedDate()}
                value={draftEndDate()}
                onInput={(event) => setDraftEndDate(event.currentTarget.value)}
              />
            </div>
            <textarea
              class={styles.createTextarea}
              placeholder="Description (optional)"
              value={draftDescription()}
              onInput={(event) => setDraftDescription(event.currentTarget.value)}
            />
            <div class={styles.createActions}>
              <button type="button" class={styles.eventAction} onClick={closeCreate}>
                Cancel
              </button>
              <button type="submit" class={styles.addButton}>
                Save
              </button>
            </div>
          </form>
        </Show>
        <div class={styles.eventsList}>
          <Show
            when={selectedDayEvents().length > 0}
            fallback={<p class={styles.emptyLabel}>{local.emptyDayLabel ?? 'No events scheduled for this day.'}</p>}
          >
            <For each={selectedDayEvents()}>
              {(event) => (
                <article
                  class={classNames(styles.eventItem, dragState()?.eventId === event.id && styles.eventDragging)}
                >
                  <Show
                    when={editingEventId() !== event.id}
                    fallback={
                      <form class={styles.createForm} onSubmit={(submitEvent) => saveEdit(event.id, submitEvent)}>
                        <input
                          ref={editTitleInputRef}
                          type="text"
                          class={styles.createInput}
                          value={editTitle()}
                          onInput={(inputEvent) => setEditTitle(inputEvent.currentTarget.value)}
                          required
                        />
                        <div class={styles.createRow}>
                          <input
                            type="time"
                            class={styles.createInput}
                            value={editTime()}
                            onInput={(inputEvent) => setEditTime(inputEvent.currentTarget.value)}
                          />
                          <input
                            type="date"
                            class={styles.createInput}
                            min={event.date}
                            value={editEndDate()}
                            onInput={(inputEvent) => setEditEndDate(inputEvent.currentTarget.value)}
                          />
                        </div>
                        <textarea
                          class={styles.createTextarea}
                          value={editDescription()}
                          onInput={(inputEvent) => setEditDescription(inputEvent.currentTarget.value)}
                        />
                        <div class={styles.createActions}>
                          <button type="button" class={styles.eventAction} onClick={resetEdit}>
                            Cancel
                          </button>
                          <button type="submit" class={styles.addButton}>
                            Save changes
                          </button>
                        </div>
                      </form>
                    }
                  >
                    <header class={styles.eventHeader}>
                      <strong class={styles.eventTitle}>{event.title}</strong>
                      <Show when={event.time}>
                        <span class={styles.eventTime}>{event.time}</span>
                      </Show>
                    </header>
                    <p class={styles.eventDate}>{eventLabel(event)}</p>
                    <Show when={event.description}>
                      <p class={styles.eventDescription}>{event.description}</p>
                    </Show>
                    <Show when={canEditEvents()}>
                      <div class={styles.eventActions}>
                        <button type="button" class={styles.eventAction} onClick={() => openEdit(event)}>
                          Edit
                        </button>
                        <button type="button" class={styles.deleteAction} onClick={() => requestDeleteEvent(event.id)}>
                          Delete
                        </button>
                      </div>
                    </Show>
                    <Show when={draggableEvents() && Boolean(local.onEventsChange)}>
                      <div class={styles.eventActions}>
                        <button
                          type="button"
                          class={styles.eventAction}
                          draggable
                          onDragStart={(e) => handleEventDragStart(event.id, 'move', e)}
                          onDragEnd={handleEventDragEnd}
                          aria-label={`Move ${event.title}`}
                        >
                          Move
                        </button>
                        <button
                          type="button"
                          class={styles.eventAction}
                          draggable
                          onDragStart={(e) => handleEventDragStart(event.id, 'resize-end', e)}
                          onDragEnd={handleEventDragEnd}
                          aria-label={`Resize ${event.title} end`}
                        >
                          Resize end
                        </button>
                      </div>
                    </Show>
                  </Show>
                </article>
              )}
            </For>
          </Show>
        </div>
      </Card>
      <ConfirmDialog
        open={deleteConfirmEventId() !== null}
        title="Delete event"
        message="Do you want to remove this event from the schedule?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onClose={() => setDeleteConfirmEventId(null)}
        onConfirm={() => {
          const eventId = deleteConfirmEventId();
          if (!eventId) return;
          deleteEvent(eventId);
        }}
      />
    </div>
  );
};

export default Scheduler;
