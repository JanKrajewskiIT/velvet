import type { IconTypes } from 'solid-icons';
import { FiCalendar, FiClock, FiEdit2, FiMapPin, FiTrash2 } from 'solid-icons/fi';
import { createEffect, createMemo, createSignal, type JSX, on, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import MarkdownEditDialog from '~/components/composites/MarkdownEditDialog/MarkdownEditDialog';
import MarkdownRenderer from '~/components/composites/MarkdownRenderer/MarkdownRenderer';
import type { SelectOption } from '~/components/dropdowns/Select/Select';
import Select from '~/components/dropdowns/Select/Select';
import Chip from '~/components/feedback/Chip/Chip';
import FormField from '~/components/forms/FormField/FormField';
import FormLayout from '~/components/forms/FormLayout/FormLayout';
import Input from '~/components/inputs/Input/Input';
import ConfirmAction from '~/components/overlays/ConfirmAction/ConfirmAction';
import Dialog from '~/components/overlays/Dialog/Dialog';
import DialogActions from '~/components/overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '~/components/overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '~/components/overlays/Dialog/DialogTitle/DialogTitle';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './InterviewSessionCard.module.css';

type InterviewSessionChipVariant = 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';
type InterviewSessionIcon = IconTypes | JSX.Element;

interface InterviewSessionOption {
  value: string;
  label: string;
  icon?: InterviewSessionIcon;
  chipVariant?: InterviewSessionChipVariant;
}

interface InterviewSessionCardValue {
  id: string;
  stage: string;
  status: string;
  scheduledAt: string | null;
  duration: string;
  location: string;
  notes: string;
  isCalendarSynced?: boolean;
}

interface InterviewSessionCardLabels {
  stage: string;
  status: string;
  scheduledAt: string;
  duration: string;
  location: string;
  notes: string;
  editLabel: string;
  deleteLabel: string;
  editDialogLabel: string;
  deleteDialogLabel: string;
  deleteDialogMessage: string;
  deleteConfirmLabel: string;
  deleteCancelLabel: string;
  editNotesLabel: string;
  saveLabel: string;
  cancelLabel: string;
  syncedLabel: string;
  notScheduledLabel: string;
}

interface InterviewSessionCardProps {
  value: InterviewSessionCardValue;
  labels: InterviewSessionCardLabels;
  stageOptions: readonly InterviewSessionOption[];
  statusOptions: readonly InterviewSessionOption[];
  onSave: (value: InterviewSessionCardValue) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
  calendarAction?: JSX.Element;
  formatDate?: (value: string) => string;
  formatTime?: (value: string) => string | null | undefined;
  formatDuration?: (value: string) => string;
}

const toLocalDatetime = (value: string | null): string => {
  if (!value) return '';

  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const defaultFormatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const defaultFormatTime = (value: string): string =>
  new Date(value).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

const defaultFormatDuration = (value: string): string => `${value} min`;

const InterviewSessionCard = (props: Props<InterviewSessionCardProps>) => {
  const [editOpen, setEditOpen] = createSignal(false);
  const [notesDialogOpen, setNotesDialogOpen] = createSignal(false);
  const [isSaving, setIsSaving] = createSignal(false);
  const [editStage, setEditStage] = createSignal('');
  const [editStatus, setEditStatus] = createSignal('');
  const [editScheduledAt, setEditScheduledAt] = createSignal('');
  const [editDuration, setEditDuration] = createSignal('');
  const [editLocation, setEditLocation] = createSignal('');
  const [editNotes, setEditNotes] = createSignal('');

  createEffect(
    on(
      () => props.value,
      (value) => {
        if (!editOpen()) {
          setEditStage(value.stage);
          setEditStatus(value.status);
          setEditScheduledAt(toLocalDatetime(value.scheduledAt));
          setEditDuration(value.duration);
          setEditLocation(value.location);
          setEditNotes(value.notes);
        }
      },
      { defer: true }
    )
  );

  const selectedStage = createMemo(() => props.stageOptions.find((option) => option.value === props.value.stage));
  const selectedStatus = createMemo(() => props.statusOptions.find((option) => option.value === props.value.status));
  const displayedDate = createMemo(() => {
    if (!props.value.scheduledAt) return props.labels.notScheduledLabel;
    return (props.formatDate ?? defaultFormatDate)(props.value.scheduledAt);
  });
  const displayedTime = createMemo(() => {
    if (!props.value.scheduledAt) return null;
    return (props.formatTime ?? defaultFormatTime)(props.value.scheduledAt) ?? null;
  });
  const displayedDuration = createMemo(() => {
    if (!props.value.duration.trim()) return null;
    return (props.formatDuration ?? defaultFormatDuration)(props.value.duration);
  });
  const stageSelectOptions = createMemo<SelectOption[]>(() =>
    props.stageOptions.map((option) => ({ value: option.value, label: option.label }))
  );
  const statusSelectOptions = createMemo<SelectOption[]>(() =>
    props.statusOptions.map((option) => ({ value: option.value, label: option.label }))
  );

  const resetEditor = (): void => {
    setEditStage(props.value.stage);
    setEditStatus(props.value.status);
    setEditScheduledAt(toLocalDatetime(props.value.scheduledAt));
    setEditDuration(props.value.duration);
    setEditLocation(props.value.location);
    setEditNotes(props.value.notes);
  };

  const handleEditOpen = (): void => {
    resetEditor();
    setEditOpen(true);
  };

  const handleEditClose = (): void => {
    if (isSaving()) return;
    setEditOpen(false);
  };

  const handleEditSave = async (): Promise<void> => {
    setIsSaving(true);

    try {
      await props.onSave({
        ...props.value,
        stage: editStage(),
        status: editStatus(),
        scheduledAt: editScheduledAt() ? new Date(editScheduledAt()).toISOString() : null,
        duration: editDuration(),
        location: editLocation(),
        notes: editNotes(),
      });
      setEditOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const stageIcon = () => {
    const icon = selectedStage()?.icon;
    if (!icon) return null;
    return typeof icon === 'function' ? icon({}) : icon;
  };

  return (
    <ConfirmAction
      label={props.labels.deleteDialogLabel}
      message={props.labels.deleteDialogMessage}
      confirmLabel={props.labels.deleteConfirmLabel}
      cancelLabel={props.labels.deleteCancelLabel}
      variant="danger"
      onConfirm={props.onDelete}
    >
      {({ openConfirm }) => (
        <div class={classNames(styles.card, props.class)}>
          <Show when={stageIcon()}>{(icon) => <div class={styles.stageIcon}>{icon()}</div>}</Show>

          <div class={styles.body}>
            <div class={styles.header}>
              <Text as="p" variant="bodyMd" tone="default" class={styles.stageName}>
                {selectedStage()?.label ?? props.value.stage}
              </Text>
              <Show when={selectedStatus()}>
                {(status) => <Chip label={status().label} variant={status().chipVariant ?? 'subtle'} size="sm" />}
              </Show>
            </div>

            <div class={styles.meta}>
              <Text as="span" variant="bodySm" tone="muted" class={styles.metaItem}>
                <span class={styles.metaIcon}>
                  <FiCalendar />
                </span>
                {displayedDate()}
                <Show when={displayedTime()}>{(time) => <>, {time()}</>}</Show>
              </Text>

              <Show when={props.value.isCalendarSynced}>
                <Chip label={props.labels.syncedLabel} variant="success" size="sm" />
              </Show>

              <Show when={props.value.location.trim()}>
                <Text as="span" variant="bodySm" tone="muted" class={styles.metaItem}>
                  <span class={styles.metaIcon}>
                    <FiMapPin />
                  </span>
                  {props.value.location}
                </Text>
              </Show>

              <Show when={displayedDuration()}>
                {(duration) => (
                  <Text as="span" variant="bodySm" tone="muted" class={styles.metaItem}>
                    <span class={styles.metaIcon}>
                      <FiClock />
                    </span>
                    {duration()}
                  </Text>
                )}
              </Show>
            </div>

            <Show when={props.value.notes.trim()}>
              <div class={styles.notes}>
                <MarkdownRenderer content={props.value.notes} />
              </div>
            </Show>
          </div>

          <div class={styles.actions}>
            <div class={styles.actionButtons}>
              <Show when={props.calendarAction}>{props.calendarAction}</Show>
              <IconButton icon={FiEdit2} label={props.labels.editLabel} onClick={handleEditOpen} size="sm" />
              <IconButton icon={FiTrash2} label={props.labels.deleteLabel} onClick={openConfirm} size="sm" />
            </div>
          </div>

          <Show when={editOpen()}>
            <Dialog open={editOpen()} onClose={handleEditClose}>
              <DialogTitle label={props.labels.editDialogLabel} />
              <DialogBody>
                <FormLayout>
                  <FormField label={props.labels.stage}>
                    {(controlProps) => (
                      <Select
                        {...controlProps}
                        value={editStage()}
                        onChange={(event) => {
                          setEditStage(event.currentTarget.value);
                        }}
                        options={stageSelectOptions()}
                      />
                    )}
                  </FormField>

                  <FormField label={props.labels.status}>
                    {(controlProps) => (
                      <Select
                        {...controlProps}
                        value={editStatus()}
                        onChange={(event) => {
                          setEditStatus(event.currentTarget.value);
                        }}
                        options={statusSelectOptions()}
                      />
                    )}
                  </FormField>

                  <FormField label={props.labels.scheduledAt}>
                    {(controlProps) => (
                      <Input
                        {...controlProps}
                        type="datetime-local"
                        value={editScheduledAt()}
                        onInput={(event) => {
                          setEditScheduledAt(event.currentTarget.value);
                        }}
                      />
                    )}
                  </FormField>

                  <FormField label={props.labels.duration}>
                    {(controlProps) => (
                      <Input
                        {...controlProps}
                        type="number"
                        min={0}
                        step={15}
                        value={editDuration()}
                        onInput={(event) => {
                          setEditDuration(event.currentTarget.value);
                        }}
                      />
                    )}
                  </FormField>

                  <FormField label={props.labels.location}>
                    {(controlProps) => (
                      <Input
                        {...controlProps}
                        type="text"
                        value={editLocation()}
                        onInput={(event) => {
                          setEditLocation(event.currentTarget.value);
                        }}
                      />
                    )}
                  </FormField>

                  <FormField label={props.labels.notes}>
                    <Button
                      variant="ghost"
                      onClick={() => setNotesDialogOpen(true)}
                      label={props.labels.editNotesLabel}
                    />
                    <Show when={editNotes().trim()}>
                      <div class={styles.notesPreview}>
                        <MarkdownRenderer content={editNotes()} />
                      </div>
                    </Show>
                  </FormField>
                </FormLayout>
              </DialogBody>
              <DialogActions>
                <Button
                  variant="ghost"
                  onClick={handleEditClose}
                  disabled={isSaving()}
                  label={props.labels.cancelLabel}
                />
                <Button onClick={() => void handleEditSave()} loading={isSaving()} label={props.labels.saveLabel} />
              </DialogActions>
            </Dialog>
          </Show>

          <MarkdownEditDialog
            open={notesDialogOpen()}
            label={props.labels.editNotesLabel}
            initialValue={editNotes()}
            saveLabel={props.labels.saveLabel}
            cancelLabel={props.labels.cancelLabel}
            onSave={setEditNotes}
            onClose={() => {
              setNotesDialogOpen(false);
            }}
          />
        </div>
      )}
    </ConfirmAction>
  );
};

export type {
  InterviewSessionCardLabels,
  InterviewSessionCardProps,
  InterviewSessionCardValue,
  InterviewSessionOption,
};
export default InterviewSessionCard;
