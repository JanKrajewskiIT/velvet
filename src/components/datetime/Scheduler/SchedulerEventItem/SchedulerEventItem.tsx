import { Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { SchedulerEvent } from '../Scheduler';
import SchedulerEventForm from '../SchedulerEventForm/SchedulerEventForm';
import styles from './SchedulerEventItem.module.css';

interface SchedulerEventItemProps {
  event: SchedulerEvent;
  isDragging: boolean;
  isEditing: boolean;
  canEditEvents: boolean;
  canDragEvents: boolean;
  editLabel: string;
  deleteLabel: string;
  moveLabel: string;
  resizeEndLabel: string;
  moveAriaLabel: string;
  resizeEndAriaLabel: string;
  cancelLabel: string;
  saveChangesLabel: string;
  editTitle: string;
  editDate: string;
  editTime: string;
  editDescription: string;
  onOpenEdit: () => void;
  onRequestDelete: () => void;
  onMoveDragStart: (event: DragEvent) => void;
  onResizeDragStart: (event: DragEvent) => void;
  onDragEnd: () => void;
  onEditTitleChange: (value: string) => void;
  onEditDateTimeChange: (date: string, time: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (event: SubmitEvent) => void;
  editTitleRef?: (element: HTMLInputElement) => void;
  eventLabel: string;
}

const SchedulerEventItem = (props: Props<SchedulerEventItemProps>) => {
  const handleMoveDragStart = (event: DragEvent) => {
    props.onMoveDragStart(event);
  };

  const handleResizeDragStart = (event: DragEvent) => {
    props.onResizeDragStart(event);
  };

  return (
    <article class={classNames(styles.eventItem, props.isDragging && styles.eventDragging)}>
      <Show
        when={!props.isEditing}
        fallback={
          <SchedulerEventForm
            titleRef={props.editTitleRef}
            title={props.editTitle}
            onTitleChange={props.onEditTitleChange}
            date={props.editDate}
            time={props.editTime}
            onDateTimeChange={props.onEditDateTimeChange}
            description={props.editDescription}
            onDescriptionChange={props.onEditDescriptionChange}
            cancelLabel={props.cancelLabel}
            submitLabel={props.saveChangesLabel}
            onCancel={props.onCancelEdit}
            onSubmit={props.onSaveEdit}
          />
        }
      >
        <header class={styles.eventHeader}>
          <Text as="span" variant="labelMd">
            {props.event.title}
          </Text>
          <Show when={props.event.time}>
            <Text as="span" variant="caption" tone="primary">
              {props.event.time}
            </Text>
          </Show>
        </header>
        <Text as="p" variant="caption" tone="secondary" class={styles.eventDate}>
          {props.eventLabel}
        </Text>
        <Show when={props.event.description}>
          <Text as="p" variant="bodySm" tone="muted" class={styles.eventDescription}>
            {props.event.description}
          </Text>
        </Show>
        <Show when={props.canEditEvents || props.canDragEvents}>
          <div class={styles.eventActions}>
            <Show when={props.canEditEvents}>
              <>
                <Button size="sm" variant="ghost" onClick={props.onOpenEdit}>
                  {props.editLabel}
                </Button>
                <Button size="sm" variant="danger" onClick={props.onRequestDelete}>
                  {props.deleteLabel}
                </Button>
              </>
            </Show>
            <Show when={props.canDragEvents}>
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  class={styles.dragAction}
                  draggable
                  onDragStart={handleMoveDragStart}
                  onDragEnd={props.onDragEnd}
                  aria-label={props.moveAriaLabel}
                >
                  {props.moveLabel}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  class={styles.dragAction}
                  draggable
                  onDragStart={handleResizeDragStart}
                  onDragEnd={props.onDragEnd}
                  aria-label={props.resizeEndAriaLabel}
                >
                  {props.resizeEndLabel}
                </Button>
              </>
            </Show>
          </div>
        </Show>
      </Show>
    </article>
  );
};

export default SchedulerEventItem;
