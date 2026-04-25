import { batch, createEffect, createMemo, createSignal, on, onCleanup, splitProps } from 'solid-js';

import ConfirmDialog from '~/components/overlays/ConfirmDialog/ConfirmDialog';
import Card from '~/components/surfaces/Card/Card';
import useEscapeKey from '~/hooks/useEscapeKey';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import type { DayCell } from '~/utils/datetime';
import { buildDaysGrid, parseDateParts, toIso } from '~/utils/datetime';

import styles from './Scheduler.module.css';
import {
  buildSchedulerEventsByDate,
  createSchedulerEvent,
  deleteSchedulerEvent,
  getSchedulerEventLabel,
  moveSchedulerEvent,
  resizeSchedulerEventEnd,
  saveSchedulerEventEdit,
} from './Scheduler.utils';
import SchedulerCalendar from './SchedulerCalendar/SchedulerCalendar';
import SchedulerEventsPanel from './SchedulerEventsPanel';

type SchedulerDragType = 'move' | 'resize-end';

const DEFAULT_DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

export interface SchedulerEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  description?: string;
}

export interface SchedulerProps extends Omit<DivCoreNativeProps, 'onChange'> {
  events: SchedulerEvent[];
  onEventsChange?: (events: SchedulerEvent[]) => void;
  selectedDate?: string;
  defaultSelectedDate?: string;
  onSelectedDateChange?: (date: string) => void;
  onMonthChange?: (monthIso: string) => void;
  locale?: string;
  draggableEvents?: boolean;
  dayNames?: string[];
}

const Scheduler = (props: Props<SchedulerProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'events',
    'onEventsChange',
    'selectedDate',
    'defaultSelectedDate',
    'onSelectedDateChange',
    'onMonthChange',
    'locale',
    'draggableEvents',
    'dayNames',
    'class',
  ]);
  const resolvedLocale = createMemo(() => local.locale ?? Intl.DateTimeFormat().resolvedOptions().locale);
  const now = new Date();
  const [internalSelectedDate, setInternalSelectedDate] = createSignal(
    local.defaultSelectedDate ?? toIso(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  const [viewYear, setViewYear] = createSignal(now.getFullYear());
  const [viewMonth, setViewMonth] = createSignal(now.getMonth());

  createEffect(
    on(
      () => local.selectedDate ?? internalSelectedDate(),
      (iso) => {
        const parts = parseDateParts(iso);
        batch(() => {
          setViewYear(parts.year);
          setViewMonth(parts.month);
        });
      },
      { defer: true },
    ),
  );

  const selectedDate = () => local.selectedDate ?? internalSelectedDate();
  const dayNames = () => local.dayNames ?? DEFAULT_DAY_NAMES;
  const agendaTitle = () => ts('scheduler.agenda');
  const addEventLabel = () => ts('scheduler.addEvent');
  const todayLabel = () => ts('common.today');
  const noEventsLabel = () => ts('scheduler.noEventsForDay');
  const cancelLabel = () => ts('common.cancel');
  const saveLabel = () => ts('common.save');
  const saveChangesLabel = () => ts('common.saveChanges');
  const editLabel = () => ts('common.edit');
  const deleteLabel = () => ts('common.delete');
  const moveLabel = () => ts('scheduler.move');
  const resizeEndLabel = () => ts('scheduler.resizeEnd');
  const moveAriaLabel = (eventTitle: string) => ts('scheduler.moveEvent', { title: eventTitle });
  const resizeEndAriaLabel = (eventTitle: string) => ts('scheduler.resizeEventEnd', { title: eventTitle });
  const deleteDialogTitle = () => ts('scheduler.deleteEvent');
  const deleteDialogMessage = () => ts('scheduler.deleteEventMessage');
  const deleteDialogConfirmLabel = () => ts('common.delete');
  const draggableEvents = () => local.draggableEvents !== false;
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
    new Date(viewYear(), viewMonth(), 1).toLocaleString(resolvedLocale(), {
      month: 'long',
      year: 'numeric',
    }),
  );

  const gridDays = createMemo(() => buildDaysGrid(viewYear(), viewMonth()));
  const eventsByDate = createMemo(() => buildSchedulerEventsByDate(local.events));

  const selectedDayEvents = createMemo(() => eventsByDate().get(selectedDate()) ?? []);
  const todayIso = toIso(now.getFullYear(), now.getMonth(), now.getDate());

  const setSelectedDate = (nextDate: string) => {
    setInternalSelectedDate(nextDate);
    local.onSelectedDateChange?.(nextDate);
  };

  const goToPreviousMonth = () => {
    batch(() => {
      if (viewMonth() === 0) {
        setViewMonth(11);
        setViewYear((year) => year - 1);
        return;
      }
      setViewMonth((month) => month - 1);
    });
  };

  const goToNextMonth = () => {
    batch(() => {
      if (viewMonth() === 11) {
        setViewMonth(0);
        setViewYear((year) => year + 1);
        return;
      }
      setViewMonth((month) => month + 1);
    });
  };

  const goToToday = () => {
    const today = new Date();
    const iso = toIso(today.getFullYear(), today.getMonth(), today.getDate());
    batch(() => {
      setViewYear(today.getFullYear());
      setViewMonth(today.getMonth());
      setSelectedDate(iso);
    });
  };

  const resetDraft = () => {
    batch(() => {
      setDraftTitle('');
      setDraftTime('');
      setDraftDescription('');
    });
  };

  const openCreateForDate = (date: string) => {
    if (!canEditEvents()) return;
    batch(() => {
      resetEdit();
      setSelectedDate(date);
      setCreateOpen(true);
      resetDraft();
    });
  };

  const closeCreate = () => {
    batch(() => {
      setCreateOpen(false);
      resetDraft();
    });
  };

  const resetEdit = () => {
    batch(() => {
      setEditingEventId(null);
      setEditDate('');
      setEditTitle('');
      setEditTime('');
      setEditDescription('');
    });
  };

  const createEvent = (e: SubmitEvent) => {
    e.preventDefault();
    if (!local.onEventsChange) return;
    const title = draftTitle().trim();
    if (!title) return;

    const descriptionValue = draftDescription().trim();

    const nextEvent = createSchedulerEvent({
      title,
      date: selectedDate(),
      time: draftTime(),
      description: descriptionValue,
    });
    local.onEventsChange([...local.events, nextEvent]);
    closeCreate();
  };

  const openEdit = (event: SchedulerEvent) => {
    if (!canEditEvents()) return;
    batch(() => {
      closeCreate();
      setEditingEventId(event.id);
      setEditDate(event.date);
      setEditTitle(event.title);
      setEditTime(event.time ?? '');
      setEditDescription(event.description ?? '');
    });
  };

  const saveEdit = (eventId: string, e: SubmitEvent) => {
    e.preventDefault();
    if (!local.onEventsChange) return;
    const title = editTitle().trim();
    if (!title) return;
    const source = local.events.find((item) => item.id === eventId);
    if (!source) return;

    const descriptionValue = editDescription().trim();
    const nextEvents = saveSchedulerEventEdit(local.events, eventId, {
      date: editDate() || source.date,
      title,
      time: editTime(),
      description: descriptionValue,
    });
    local.onEventsChange(nextEvents);
    resetEdit();
  };

  const deleteEvent = (eventId: string) => {
    if (!local.onEventsChange) return;
    batch(() => {
      local.onEventsChange?.(deleteSchedulerEvent(local.events, eventId));
      if (editingEventId() === eventId) {
        resetEdit();
      }
      setDeleteConfirmEventId(null);
    });
  };

  const requestDeleteEvent = (eventId: string) => {
    if (!canEditEvents()) return;
    setDeleteConfirmEventId(eventId);
  };

  const moveEventToDate = (eventId: string, targetDate: string) => {
    local.onEventsChange?.(moveSchedulerEvent(local.events, eventId, targetDate));
  };

  const resizeEventEndDate = (eventId: string, targetDate: string) => {
    local.onEventsChange?.(resizeSchedulerEventEnd(local.events, eventId, targetDate));
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
    batch(() => {
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
    });
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
    batch(() => {
      setDragState(null);
      setDragOverDate(null);
    });
  };

  const handleOpenCreateForSelected = () => openCreateForDate(selectedDate());

  const handleDraftDateTimeChange = (date: string, time: string) => {
    if (date) setSelectedDate(date);
    setDraftTime(time);
  };

  const handleEditDateTimeChange = (date: string, time: string) => {
    if (date) setEditDate(date);
    setEditTime(time);
  };

  const handleMoveDragStart = (eventId: string, event: DragEvent) => handleEventDragStart(eventId, 'move', event);

  const handleResizeDragStart = (eventId: string, event: DragEvent) =>
    handleEventDragStart(eventId, 'resize-end', event);

  const handleCreateTitleRef = (element: HTMLInputElement) => {
    createTitleInputRef = element;
  };

  const handleEditTitleRef = (element: HTMLInputElement) => {
    editTitleInputRef = element;
  };

  const closeDeleteConfirm = () => setDeleteConfirmEventId(null);

  const handleConfirmDelete = () => {
    const eventId = deleteConfirmEventId();
    if (!eventId) return;
    deleteEvent(eventId);
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
    },
  );

  createEffect(
    on(
      () => [viewYear(), viewMonth()] as const,
      ([year, month]) => {
        local.onMonthChange?.(toIso(year, month, 1).slice(0, 7));
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      createOpen,
      (open) => {
        if (!open) return;
        let cancelled = false;
        queueMicrotask(() => {
          if (cancelled) return;
          createTitleInputRef?.focus();
        });
        onCleanup(() => {
          cancelled = true;
        });
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      editingEventId,
      (id) => {
        if (!id) return;
        let cancelled = false;
        queueMicrotask(() => {
          if (cancelled) return;
          editTitleInputRef?.focus();
        });
        onCleanup(() => {
          cancelled = true;
        });
      },
      { defer: true },
    ),
  );

  return (
    <div {...rest} class={classNames(styles.scheduler, local.class)}>
      <Card class={styles.calendarPanel}>
        <SchedulerCalendar
          monthLabel={monthLabel()}
          dayNames={dayNames()}
          gridDays={gridDays()}
          selectedDate={selectedDate()}
          todayIso={todayIso}
          dragOverDate={dragOverDate()}
          showAdjacentDays={true}
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

      <SchedulerEventsPanel
        agendaTitle={agendaTitle()}
        canEditEvents={canEditEvents()}
        addEventLabel={addEventLabel()}
        todayLabel={todayLabel()}
        selectedDate={selectedDate()}
        onOpenCreate={handleOpenCreateForSelected}
        onGoToToday={goToToday}
        createOpen={createOpen()}
        draftTitle={draftTitle()}
        onDraftTitleChange={setDraftTitle}
        draftDate={selectedDate()}
        draftTime={draftTime()}
        onDraftDateTimeChange={handleDraftDateTimeChange}
        draftDescription={draftDescription()}
        onDraftDescriptionChange={setDraftDescription}
        cancelLabel={cancelLabel()}
        saveLabel={saveLabel()}
        onCancelCreate={closeCreate}
        onCreateSubmit={createEvent}
        titleRef={handleCreateTitleRef}
        events={selectedDayEvents()}
        emptyDayLabel={noEventsLabel()}
        isDraggingEventId={dragState()?.eventId ?? null}
        editingEventId={editingEventId()}
        canDragEvents={draggableEvents() && Boolean(local.onEventsChange)}
        editLabel={editLabel()}
        deleteLabel={deleteLabel()}
        moveLabel={moveLabel()}
        resizeEndLabel={resizeEndLabel()}
        getMoveAriaLabel={moveAriaLabel}
        getResizeEndAriaLabel={resizeEndAriaLabel}
        saveChangesLabel={saveChangesLabel()}
        editTitle={editTitle()}
        editDate={editDate()}
        editTime={editTime()}
        editDescription={editDescription()}
        onOpenEdit={openEdit}
        onRequestDelete={requestDeleteEvent}
        onMoveDragStart={handleMoveDragStart}
        onResizeDragStart={handleResizeDragStart}
        onDragEnd={handleEventDragEnd}
        onEditTitleChange={setEditTitle}
        onEditDateTimeChange={handleEditDateTimeChange}
        onEditDescriptionChange={setEditDescription}
        onCancelEdit={resetEdit}
        onSaveEdit={saveEdit}
        editTitleRef={handleEditTitleRef}
        getEventLabel={getSchedulerEventLabel}
      />
      <ConfirmDialog
        open={deleteConfirmEventId() !== null}
        label={deleteDialogTitle()}
        message={deleteDialogMessage()}
        confirmLabel={deleteDialogConfirmLabel()}
        variant="danger"
        onClose={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Scheduler;
