import { createEffect, createSignal, on, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import ColorTagCloud, { type ColorTagCloudItem } from '~/components/composites/ColorTagCloud/ColorTagCloud';
import Dialog from '~/components/overlays/Dialog/Dialog';
import DialogActions from '~/components/overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '~/components/overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '~/components/overlays/Dialog/DialogTitle/DialogTitle';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';

import styles from './ColorTagSelectionDialog.module.css';

interface ColorTagSelectionDialogProps {
  open: boolean;
  title: string;
  description?: string;
  items: readonly ColorTagCloudItem[];
  value: readonly string[];
  label?: string;
  emptyMessage?: string;
  emptyHint?: string;
  confirmLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onSubmit: (value: string[]) => void | Promise<void>;
}

const ColorTagSelectionDialog = (props: Props<ColorTagSelectionDialogProps>) => {
  const [selectedIds, setSelectedIds] = createSignal<string[]>([]);
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  createEffect(
    on(
      () => props.open,
      (open) => {
        if (open) {
          setSelectedIds([...props.value]);
          setIsSubmitting(false);
        }
      }
    )
  );

  const handleClose = () => {
    if (isSubmitting()) return;
    props.onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await props.onSubmit(selectedIds());
      props.onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Show when={props.open}>
      <Dialog open={props.open} onClose={handleClose} class={props.class}>
        <DialogTitle label={props.title} />
        <DialogBody>
          <Show when={props.description}>
            <Text as="p" variant="bodyMd" tone="muted" class={styles.description}>
              {props.description}
            </Text>
          </Show>
          <ColorTagCloud
            items={props.items}
            selectedIds={selectedIds()}
            label={props.label}
            emptyMessage={props.emptyMessage}
            emptyHint={props.emptyHint}
            onChange={setSelectedIds}
            disabled={isSubmitting()}
          />
        </DialogBody>
        <DialogActions>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting()} label={props.cancelLabel} />
          <Button onClick={() => void handleSubmit()} loading={isSubmitting()} label={props.confirmLabel} />
        </DialogActions>
      </Dialog>
    </Show>
  );
};

export type { ColorTagSelectionDialogProps };
export default ColorTagSelectionDialog;
