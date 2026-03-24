import { createEffect, createSignal, on, Show } from 'solid-js';

import type Props from '~/models/Props';

import Button from '../../buttons/Button/Button';
import TextArea from '../../inputs/TextArea/TextArea';
import Dialog from '../../overlays/Dialog/Dialog';
import DialogActions from '../../overlays/DialogActions/DialogActions';
import DialogBody from '../../overlays/DialogBody/DialogBody';
import DialogTitle from '../../overlays/DialogTitle/DialogTitle';
import Card from '../../surfaces/Card/Card';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import styles from './MarkdownEditDialog.module.css';

interface MarkdownEditDialogProps {
  open: boolean;
  title: string;
  initialValue: string;
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
            <TextArea rows={8} value={value()} onInput={handleInput} />
            <Card padding="none" class={styles.preview}>
              <MarkdownRenderer content={value()} />
            </Card>
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
