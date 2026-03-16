import { createEffect, createSignal, on, Show } from 'solid-js';

import type Props from '~/models/Props';

import Button from '../../buttons/Button/Button';
import MarkdownRenderer from '../../data-display/MarkdownRenderer/MarkdownRenderer';
import FormField from '../../forms/FormField/FormField';
import TextArea from '../../inputs/TextArea/TextArea';
import Dialog from '../Dialog/Dialog';
import DialogActions from '../Dialog/DialogActions';
import DialogBody from '../Dialog/DialogBody';
import DialogTitle from '../Dialog/DialogTitle';
import styles from './MarkdownEditDialog.module.css';

interface MarkdownEditDialogProps {
  open: boolean;
  title: string;
  label: string;
  initialValue: string;
  previewLabel: string;
  saveLabel: string;
  cancelLabel: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

const MarkdownEditDialog = (props: Props<MarkdownEditDialogProps>) => {
  const [value, setValue] = createSignal(props.initialValue);

  createEffect(
    on(
      () => props.open,
      (isOpen) => {
        if (isOpen) {
          setValue(props.initialValue);
        }
      }
    )
  );

  const handleSave = () => {
    props.onSave(value());
    props.onClose();
  };

  const handleCancel = () => {
    setValue(props.initialValue);
    props.onClose();
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
    setValue(e.currentTarget.value);
  };

  return (
    <Show when={props.open}>
      <Dialog open={props.open} onClose={handleCancel} class={props.class}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogBody>
          <div class={styles.body}>
            <FormField label={props.label}>
              <TextArea rows={8} value={value()} onInput={handleInput} />
            </FormField>

            <FormField label={props.previewLabel}>
              <div class={styles.preview}>
                <MarkdownRenderer content={value()} />
              </div>
            </FormField>
          </div>
        </DialogBody>
        <DialogActions>
          <Button variant="ghost" onClick={handleCancel}>
            {props.cancelLabel}
          </Button>
          <Button onClick={handleSave}>{props.saveLabel}</Button>
        </DialogActions>
      </Dialog>
    </Show>
  );
};

export default MarkdownEditDialog;
