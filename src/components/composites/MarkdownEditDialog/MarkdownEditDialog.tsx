import { createEffect, createSignal, on, Show } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';

import Button from '../../buttons/Button/Button';
import TextArea from '../../inputs/TextArea/TextArea';
import Dialog from '../../overlays/Dialog/Dialog';
import DialogActions from '../../overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '../../overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '../../overlays/Dialog/DialogTitle/DialogTitle';
import Card from '../../surfaces/Card/Card';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import styles from './MarkdownEditDialog.module.css';

interface MarkdownEditDialogProps {
  open: boolean;
  label: string;
  initialValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

const MarkdownEditDialog = (props: Props<MarkdownEditDialogProps>) => {
  const { ts } = useI18n();
  const [value, setValue] = createSignal(props.initialValue);

  createEffect(
    on(
      () => props.open,
      (isOpen) => {
        if (isOpen) {
          setValue(props.initialValue);
        }
      },
    ),
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
        <DialogTitle label={props.label} />
        <DialogBody>
          <div class={styles.body}>
            <TextArea rows={8} value={value()} onInput={handleInput} />
            <Card class={styles.preview}>
              <MarkdownRenderer content={value()} />
            </Card>
          </div>
        </DialogBody>
        <DialogActions>
          <Button variant="ghost" onClick={handleCancel} label={ts('common.cancel')} />
          <Button onClick={handleSave} label={ts('common.save')} />
        </DialogActions>
      </Dialog>
    </Show>
  );
};

export default MarkdownEditDialog;
