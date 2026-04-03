import { For, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Card from '~/components/surfaces/Card/Card';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';

import type { SchedulerEvent } from './Scheduler';
import styles from './Scheduler.module.css';
import SchedulerEventForm from './SchedulerEventForm/SchedulerEventForm';
import SchedulerEventItem from './SchedulerEventItem/SchedulerEventItem';

interface SchedulerEventsPanelProps {
  agendaTitle: string;
  canEditEvents: boolean;
  addEventLabel: string;
  todayLabel: string;
  selectedDate: string;
  onOpenCreate: () => void;
  onGoToToday: () => void;
  createOpen: boolean;
  draftTitle: string;
  onDraftTitleChange: (value: string) => void;
  draftDate: string;
  draftTime: string;
  onDraftDateTimeChange: (date: string, time: string) => void;
  draftDescription: string;
  onDraftDescriptionChange: (value: string) => void;
  cancelLabel: string;
  saveLabel: string;
  onCancelCreate: () => void;
  onCreateSubmit: (event: SubmitEvent) => void;
  titleRef?: (element: HTMLInputElement) => void;
  events: readonly SchedulerEvent[];
  emptyDayLabel: string;
  isDraggingEventId: string | null;
  editingEventId: string | null;
  canDragEvents: boolean;
  editLabel: string;
  deleteLabel: string;
  moveLabel: string;
  resizeEndLabel: string;
  getMoveAriaLabel: (eventTitle: string) => string;
  getResizeEndAriaLabel: (eventTitle: string) => string;
  saveChangesLabel: string;
  editTitle: string;
  editDate: string;
  editTime: string;
  editDescription: string;
  onOpenEdit: (event: SchedulerEvent) => void;
  onRequestDelete: (eventId: string) => void;
  onMoveDragStart: (eventId: string, event: DragEvent) => void;
  onResizeDragStart: (eventId: string, event: DragEvent) => void;
  onDragEnd: () => void;
  onEditTitleChange: (value: string) => void;
  onEditDateTimeChange: (date: string, time: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (eventId: string, event: SubmitEvent) => void;
  editTitleRef?: (element: HTMLInputElement) => void;
  getEventLabel: (event: SchedulerEvent) => string;
}

const SchedulerEventsPanel = (props: Props<SchedulerEventsPanelProps>) => {
  return (
    <Card class={styles.eventsPanel} style={{ overflow: 'visible', position: 'relative', 'z-index': 2 }}>
      <div class={styles.eventsHeader}>
        <Heading as="h4" level={4} variant="titleMd">
          {props.agendaTitle}
        </Heading>
        <div class={styles.eventsHeaderActions}>
          <Show when={props.canEditEvents}>
            <Button size="sm" variant="primary" onClick={props.onOpenCreate}>
              {props.addEventLabel}
            </Button>
          </Show>
          <Button size="sm" variant="ghost" onClick={props.onGoToToday}>
            {props.todayLabel}
          </Button>
        </div>
      </div>

      <Text as="p" variant="bodySm" tone="secondary">
        {props.selectedDate}
      </Text>

      <Show when={props.createOpen}>
        <SchedulerEventForm
          titleRef={props.titleRef}
          title={props.draftTitle}
          onTitleChange={props.onDraftTitleChange}
          date={props.draftDate}
          time={props.draftTime}
          onDateTimeChange={props.onDraftDateTimeChange}
          description={props.draftDescription}
          onDescriptionChange={props.onDraftDescriptionChange}
          cancelLabel={props.cancelLabel}
          submitLabel={props.saveLabel}
          onCancel={props.onCancelCreate}
          onSubmit={props.onCreateSubmit}
        />
      </Show>

      <div class={styles.eventsList}>
        <Show
          when={props.events.length > 0}
          fallback={
            <Text as="p" variant="bodySm" tone="muted">
              {props.emptyDayLabel}
            </Text>
          }
        >
          <For each={props.events}>
            {(event) => (
              <SchedulerEventItem
                event={event}
                isDragging={props.isDraggingEventId === event.id}
                isEditing={props.editingEventId === event.id}
                canEditEvents={props.canEditEvents}
                canDragEvents={props.canDragEvents}
                editLabel={props.editLabel}
                deleteLabel={props.deleteLabel}
                moveLabel={props.moveLabel}
                resizeEndLabel={props.resizeEndLabel}
                moveAriaLabel={props.getMoveAriaLabel(event.title)}
                resizeEndAriaLabel={props.getResizeEndAriaLabel(event.title)}
                cancelLabel={props.cancelLabel}
                saveChangesLabel={props.saveChangesLabel}
                editTitle={props.editTitle}
                editDate={props.editDate}
                editTime={props.editTime}
                editDescription={props.editDescription}
                onOpenEdit={() => props.onOpenEdit(event)}
                onRequestDelete={() => props.onRequestDelete(event.id)}
                onMoveDragStart={(dragEvent) => props.onMoveDragStart(event.id, dragEvent)}
                onResizeDragStart={(dragEvent) => props.onResizeDragStart(event.id, dragEvent)}
                onDragEnd={props.onDragEnd}
                onEditTitleChange={props.onEditTitleChange}
                onEditDateTimeChange={props.onEditDateTimeChange}
                onEditDescriptionChange={props.onEditDescriptionChange}
                onCancelEdit={props.onCancelEdit}
                onSaveEdit={(submitEvent) => props.onSaveEdit(event.id, submitEvent)}
                editTitleRef={props.editTitleRef}
                eventLabel={props.getEventLabel(event)}
              />
            )}
          </For>
        </Show>
      </div>
    </Card>
  );
};

export default SchedulerEventsPanel;
