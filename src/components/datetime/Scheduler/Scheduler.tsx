import { createEffect, createMemo, createSignal, For, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import ConfirmDialog from '~/components/overlays/ConfirmDialog/ConfirmDialog';
import Card from '~/components/surfaces/Card/Card';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import useEscapeKey from '~/hooks/useEscapeKey';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import type { DayCell } from '~/utils/datetime';
import { addDays, buildDaysGrid, getDateDiffInDays, parseDateParts, toIso } from '~/utils/datetime';

import styles from './Scheduler.module.css';
import SchedulerCalendar from './SchedulerCalendar/SchedulerCalendar';
import SchedulerEventForm from './SchedulerEventForm/SchedulerEventForm';
import SchedulerEventItem from './SchedulerEventItem/SchedulerEventItem';

type SchedulerDragType = 'move' | 'resize-end';

export interface SchedulerEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  description?: string;
}

interface SchedulerOwnProps extends Omit<DivCoreNativeProps, 'onChange'> {
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
  messages?: SchedulerMessages;
}

interface SchedulerMessages {
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  agendaTitle?: string;
  addEventLabel?: string;
  todayLabel?: string;
  eventTitlePlaceholder?: string;
  descriptionPlaceholder?: string;
  noEventsLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  saveChangesLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  moveLabel?: string;
  resizeEndLabel?: string;
  moveAriaLabel?: (eventTitle: string) => string;
  resizeEndAriaLabel?: (eventTitle: string) => string;
  deleteDialogTitle?: string;
  deleteDialogMessage?: string;
  deleteDialogConfirmLabel?: string;
  deleteDialogCancelLabel?: string;
}

const Scheduler = (props: Props<SchedulerOwnProps>) => {
  const { locale: currentLocale, t } = useI18n();
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
    'messages',
    'class',
  ]);
  const now = new Date();
  const [internalSelectedDate, setInternalSelectedDate] = createSignal(
    local.defaultSelectedDate ?? toIso(now.getFullYear(), now.getMonth(), now.getDate())
  );
  const [viewYear, setViewYear] = createSignal(now.getFullYear());
  const [viewMonth, setViewMonth] = createSignal(now.getMonth());
  createEffect(() => {
    const parts = parseDateParts(local.selectedDate ?? internalSelectedDate());
    setViewYear(parts.year);
    setViewMonth(parts.month);
  });

  const selectedDate = () => local.selectedDate ?? internalSelectedDate();
  const dayNames = () =>
    local.dayNames ?? [
      t('calendar.day.mo'),
      t('calendar.day.tu'),
      t('calendar.day.we'),
      t('calendar.day.th'),
      t('calendar.day.fr'),
      t('calendar.day.sa'),
      t('calendar.day.su'),
    ];
  const messages = () => local.messages ?? {};
  const previousMonthLabel = () => messages().previousMonthLabel ?? t('calendar.prevMonth');
  const nextMonthLabel = () => messages().nextMonthLabel ?? t('calendar.nextMonth');
  const agendaTitle = () => messages().agendaTitle ?? t('scheduler.agenda');
  const addEventLabel = () => messages().addEventLabel ?? t('scheduler.addEvent');
  const todayLabel = () => messages().todayLabel ?? t('common.today');
  const eventTitlePlaceholder = () => messages().eventTitlePlaceholder ?? t('scheduler.eventTitle');
  const descriptionPlaceholder = () => messages().descriptionPlaceholder ?? t('scheduler.descriptionOptional');
  const noEventsLabel = () => messages().noEventsLabel ?? t('scheduler.noEventsForDay');
  const cancelLabel = () => messages().cancelLabel ?? t('common.cancel');
  const saveLabel = () => messages().saveLabel ?? t('common.save');
  const saveChangesLabel = () => messages().saveChangesLabel ?? t('common.saveChanges');
  const editLabel = () => messages().editLabel ?? t('common.edit');
  const deleteLabel = () => messages().deleteLabel ?? t('common.delete');
  const moveLabel = () => messages().moveLabel ?? t('scheduler.move');
  const resizeEndLabel = () => messages().resizeEndLabel ?? t('scheduler.resizeEnd');
  const moveAriaLabel = (eventTitle: string) =>
    messages().moveAriaLabel?.(eventTitle) ?? t('scheduler.moveEvent', { title: eventTitle });
  const resizeEndAriaLabel = (eventTitle: string) =>
    messages().resizeEndAriaLabel?.(eventTitle) ?? t('scheduler.resizeEventEnd', { title: eventTitle });
  const deleteDialogTitle = () => messages().deleteDialogTitle ?? t('scheduler.deleteEvent');
  const deleteDialogMessage = () => messages().deleteDialogMessage ?? t('scheduler.deleteEventMessage');
  const deleteDialogConfirmLabel = () => messages().deleteDialogConfirmLabel ?? t('common.delete');
  const deleteDialogCancelLabel = () => messages().deleteDialogCancelLabel ?? t('common.cancel');
  const showAdjacentDays = () => local.showAdjacentDays ?? true;
  const draggableEvents = () => local.draggableEvents ?? true;
  const canEditEvents = () => Boolean(local.onEventsChange);
  const [dragState, setDragState] = createSignal<{ eventId: string; type: SchedulerDragType } | null>(null);
  const [dragOverDate, setDragOverDate] = createSignal<string | null>(null);
  const [createOpen, setCreateOpen] = createSignal(false);
  const [draftTitle, setDraftTitle] = createSignal('');
  const [draftTime, setDraftTime] = createSignal('');
  const [draftDescription, setDraftDescription] = createSignal('');
  const [editingEventId, setEditingEventId] = createSignal<string | null>(null);
  const [editDate, setEditDate] = createSignal('');
  const [editTitle, setEditTitle] = createSignal('');
  const [editTime, setEditTime] = createSignal('');
  const [editDescription, setEditDescription] = createSignal('');
  const [deleteConfirmEventId, setDeleteConfirmEventId] = createSignal<string | null>(null);
  let createTitleInputRef: HTMLInputElement | undefined;
  let editTitleInputRef: HTMLInputElement | undefined;

  const monthLabel = createMemo(() =>
    new Date(viewYear(), viewMonth(), 1).toLocaleString(local.locale ?? currentLocale(), {
      month: 'long',
      year: 'numeric',
    })
  );

  const gridDays = createMemo(() => buildDaysGrid(viewYear(), viewMonth()));

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
  const todayIso = toIso(now.getFullYear(), now.getMonth(), now.getDate());

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
    const iso = toIso(today.getFullYear(), today.getMonth(), today.getDate());
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(iso);
  };

  const resetDraft = () => {
    setDraftTitle('');
    setDraftTime('');
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
    setEditDate('');
    setEditTitle('');
    setEditTime('');
    setEditDescription('');
  };

  const createEvent = (e: SubmitEvent) => {
    e.preventDefault();
    if (!local.onEventsChange) return;
    const title = draftTitle().trim();
    if (!title) return;

    const descriptionValue = draftDescription().trim();

    const nextEvent: SchedulerEvent = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `event-${Date.now()}`,
      title,
      date: selectedDate(),
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
    setEditDate(event.date);
    setEditTitle(event.title);
    setEditTime(event.time ?? '');
    setEditDescription(event.description ?? '');
  };

  const saveEdit = (eventId: string, e: SubmitEvent) => {
    e.preventDefault();
    if (!local.onEventsChange) return;
    const title = editTitle().trim();
    if (!title) return;
    const source = local.events.find((item) => item.id === eventId);
    if (!source) return;

    const nextDate = editDate() || source.date;
    const dateOffset = getDateDiffInDays(source.date, nextDate);
    const nextEndDate = source.endDate ? addDays(source.endDate, dateOffset) : undefined;
    const descriptionValue = editDescription().trim();

    const nextEvents = local.events.map((item) =>
      item.id === eventId
        ? {
            ...item,
            date: nextDate,
            title,
            time: editTime() || undefined,
            endDate: nextEndDate,
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

  const eventLabel = (event: SchedulerEvent): string => {
    if (!event.endDate || event.endDate === event.date) return event.date;
    return `${event.date} - ${event.endDate}`;
  };

  const handleDayDragOver = (cell: DayCell, e: DragEvent) => {
    if (!draggableEvents() || !local.onEventsChange) return;
    if (!dragState()) return;
    e.preventDefault();
    setDragOverDate(toIso(cell.year, cell.month, cell.day));
  };

  const handleDayDrop = (cell: DayCell, e: DragEvent) => {
    if (!draggableEvents() || !local.onEventsChange) return;
    e.preventDefault();
    const activeDrag = dragState();
    const targetIso = toIso(cell.year, cell.month, cell.day);
    if (activeDrag?.eventId) {
      if (activeDrag.type === 'move') {
        moveEventToDate(activeDrag.eventId, targetIso);
      } else {
        resizeEventEndDate(activeDrag.eventId, targetIso);
      }
      setSelectedDate(targetIso);
    }
    setDragState(null);
    setDragOverDate(null);
  };

  const handleDayDragLeave = (cell: DayCell) => {
    if (dragOverDate() === toIso(cell.year, cell.month, cell.day)) {
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
    local.onMonthChange?.(toIso(viewYear(), viewMonth(), 1).slice(0, 7));
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
      <Card class={styles.calendarPanel} style={{ overflow: 'visible', position: 'relative', 'z-index': 1 }}>
        <SchedulerCalendar
          monthLabel={monthLabel()}
          previousMonthLabel={previousMonthLabel()}
          nextMonthLabel={nextMonthLabel()}
          dayNames={dayNames()}
          gridDays={gridDays()}
          selectedDate={selectedDate()}
          todayIso={todayIso}
          dragOverDate={dragOverDate()}
          showAdjacentDays={showAdjacentDays()}
          eventsByDate={eventsByDate()}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onSelectDate={setSelectedDate}
          onOpenCreateForDate={openCreateForDate}
          onDayDragOver={handleDayDragOver}
          onDayDrop={handleDayDrop}
          onDayDragLeave={handleDayDragLeave}
        />
      </Card>

      <Card class={styles.eventsPanel} style={{ overflow: 'visible', position: 'relative', 'z-index': 2 }}>
        <div class={styles.eventsHeader}>
          <Heading as="h4" level={4} variant="titleMd">
            {agendaTitle()}
          </Heading>
          <div class={styles.eventsHeaderActions}>
            <Show when={canEditEvents()}>
              <Button size="sm" variant="primary" onClick={() => openCreateForDate(selectedDate())}>
                {addEventLabel()}
              </Button>
            </Show>
            <Button size="sm" variant="ghost" onClick={goToToday}>
              {todayLabel()}
            </Button>
          </div>
        </div>
        <Text as="p" variant="bodySm" tone="secondary">
          {selectedDate()}
        </Text>
        <Show when={createOpen()}>
          <SchedulerEventForm
            titleRef={(element) => {
              createTitleInputRef = element;
            }}
            title={draftTitle()}
            onTitleChange={setDraftTitle}
            date={selectedDate()}
            time={draftTime()}
            onDateTimeChange={(date, time) => {
              if (date) setSelectedDate(date);
              setDraftTime(time);
            }}
            description={draftDescription()}
            onDescriptionChange={setDraftDescription}
            titlePlaceholder={eventTitlePlaceholder()}
            descriptionPlaceholder={descriptionPlaceholder()}
            cancelLabel={cancelLabel()}
            submitLabel={saveLabel()}
            onCancel={closeCreate}
            onSubmit={createEvent}
          />
        </Show>
        <div class={styles.eventsList}>
          <Show
            when={selectedDayEvents().length > 0}
            fallback={
              <Text as="p" variant="bodySm" tone="muted">
                {local.emptyDayLabel ?? noEventsLabel()}
              </Text>
            }
          >
            <For each={selectedDayEvents()}>
              {(event) => (
                <SchedulerEventItem
                  event={event}
                  isDragging={dragState()?.eventId === event.id}
                  isEditing={editingEventId() === event.id}
                  canEditEvents={canEditEvents()}
                  canDragEvents={draggableEvents() && Boolean(local.onEventsChange)}
                  editLabel={editLabel()}
                  deleteLabel={deleteLabel()}
                  moveLabel={moveLabel()}
                  resizeEndLabel={resizeEndLabel()}
                  moveAriaLabel={moveAriaLabel(event.title)}
                  resizeEndAriaLabel={resizeEndAriaLabel(event.title)}
                  cancelLabel={cancelLabel()}
                  saveChangesLabel={saveChangesLabel()}
                  editTitle={editTitle()}
                  editDate={editDate()}
                  editTime={editTime()}
                  editDescription={editDescription()}
                  onOpenEdit={() => openEdit(event)}
                  onRequestDelete={() => requestDeleteEvent(event.id)}
                  onMoveDragStart={(e) => handleEventDragStart(event.id, 'move', e)}
                  onResizeDragStart={(e) => handleEventDragStart(event.id, 'resize-end', e)}
                  onDragEnd={handleEventDragEnd}
                  onEditTitleChange={setEditTitle}
                  onEditDateTimeChange={(date, time) => {
                    if (date) setEditDate(date);
                    setEditTime(time);
                  }}
                  onEditDescriptionChange={setEditDescription}
                  onCancelEdit={resetEdit}
                  onSaveEdit={(submitEvent) => saveEdit(event.id, submitEvent)}
                  editTitleRef={(element) => {
                    editTitleInputRef = element;
                  }}
                  eventLabel={eventLabel(event)}
                />
              )}
            </For>
          </Show>
        </div>
      </Card>
      <ConfirmDialog
        open={deleteConfirmEventId() !== null}
        label={deleteDialogTitle()}
        message={deleteDialogMessage()}
        confirmLabel={deleteDialogConfirmLabel()}
        cancelLabel={deleteDialogCancelLabel()}
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
