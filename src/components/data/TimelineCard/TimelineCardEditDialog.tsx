import { createEffect, createMemo, createSignal, on, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import MarkdownEditDialog from '~/components/composites/MarkdownEditDialog/MarkdownEditDialog';
import MarkdownRenderer from '~/components/composites/MarkdownRenderer/MarkdownRenderer';
import type { SelectOption } from '~/components/dropdowns/Select/Select';
import Select from '~/components/dropdowns/Select/Select';
import FormField from '~/components/forms/FormField/FormField';
import FormLayout from '~/components/forms/FormLayout/FormLayout';
import Input from '~/components/inputs/Input/Input';
import Dialog from '~/components/overlays/Dialog/Dialog';
import DialogActions from '~/components/overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '~/components/overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '~/components/overlays/Dialog/DialogTitle/DialogTitle';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';

import type { TimelineCardData, TimelineCardLabels, TimelineCardOption } from './TimelineCard';
import styles from './TimelineCardEditDialog.module.css';

interface TimelineCardEditDialogProps {
  open: boolean;
  loading?: boolean;
  value: TimelineCardData;
  labels: TimelineCardLabels;
  categoryOptions: readonly TimelineCardOption[];
  statusOptions: readonly TimelineCardOption[];
  onClose: () => void;
  onSave: (value: TimelineCardData) => void | Promise<void>;
}

const toLocalDatetime = (value: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const TimelineCardEditDialog = (props: Props<TimelineCardEditDialogProps>) => {
  const { ts } = useI18n();
  const [notesDialogOpen, setNotesDialogOpen] = createSignal(false);
  const [editCategory, setEditCategory] = createSignal('');
  const [editStatus, setEditStatus] = createSignal('');
  const [editDateTime, setEditDateTime] = createSignal('');
  const [editDuration, setEditDuration] = createSignal('');
  const [editLocation, setEditLocation] = createSignal('');
  const [editNotes, setEditNotes] = createSignal('');

  createEffect(
    on(
      () => [props.open, props.value] as const,
      ([open]) => {
        if (!open) return;
        setEditCategory(props.value.category);
        setEditStatus(props.value.status);
        setEditDateTime(toLocalDatetime(props.value.dateTime));
        setEditDuration(props.value.duration);
        setEditLocation(props.value.location);
        setEditNotes(props.value.notes);
      },
      { defer: true },
    ),
  );

  const categorySelectOptions = createMemo<SelectOption[]>(() =>
    props.categoryOptions.map((option) => ({ value: option.value, label: option.label })),
  );
  const statusSelectOptions = createMemo<SelectOption[]>(() =>
    props.statusOptions.map((option) => ({ value: option.value, label: option.label })),
  );

  const handleSave = async (): Promise<void> => {
    await props.onSave({
      ...props.value,
      category: editCategory(),
      status: editStatus(),
      dateTime: editDateTime() ? new Date(editDateTime()).toISOString() : null,
      duration: editDuration(),
      location: editLocation(),
      notes: editNotes(),
    });
  };

  return (
    <>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle label={props.labels.editDialogLabel} />
        <DialogBody>
          <FormLayout>
            <FormField label={props.labels.category}>
              {(controlProps) => (
                <Select
                  {...controlProps}
                  value={editCategory()}
                  onChange={(event) => setEditCategory(event.currentTarget.value)}
                  options={categorySelectOptions()}
                />
              )}
            </FormField>
            <FormField label={props.labels.status}>
              {(controlProps) => (
                <Select
                  {...controlProps}
                  value={editStatus()}
                  onChange={(event) => setEditStatus(event.currentTarget.value)}
                  options={statusSelectOptions()}
                />
              )}
            </FormField>
            <FormField label={props.labels.dateTime}>
              {(controlProps) => (
                <Input
                  {...controlProps}
                  type="datetime-local"
                  value={editDateTime()}
                  onInput={(event) => setEditDateTime(event.currentTarget.value)}
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
                  onInput={(event) => setEditDuration(event.currentTarget.value)}
                />
              )}
            </FormField>
            <FormField label={props.labels.location}>
              {(controlProps) => (
                <Input
                  {...controlProps}
                  type="text"
                  value={editLocation()}
                  onInput={(event) => setEditLocation(event.currentTarget.value)}
                />
              )}
            </FormField>
            <FormField label={props.labels.notes}>
              <Button variant="ghost" onClick={() => setNotesDialogOpen(true)} label={ts('common.edit')} />
              <Show when={editNotes().trim()}>
                <div class={styles.notesPreview}>
                  <MarkdownRenderer content={editNotes()} />
                </div>
              </Show>
            </FormField>
          </FormLayout>
        </DialogBody>
        <DialogActions>
          <Button variant="ghost" onClick={props.onClose} disabled={props.loading} label={ts('common.cancel')} />
          <Button onClick={() => void handleSave()} loading={props.loading} label={ts('common.save')} />
        </DialogActions>
      </Dialog>
      <MarkdownEditDialog
        open={notesDialogOpen()}
        label={props.labels.editDialogLabel}
        initialValue={editNotes()}
        onSave={setEditNotes}
        onClose={() => setNotesDialogOpen(false)}
      />
    </>
  );
};

export type { TimelineCardEditDialogProps };
export default TimelineCardEditDialog;
