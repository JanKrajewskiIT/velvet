import { batch, createEffect, createSignal, on, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import SelectableChips, { type SelectableChipItem } from '~/components/feedback/SelectableChips/SelectableChips';
import Dialog from '~/components/overlays/Dialog/Dialog';
import DialogActions from '~/components/overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '~/components/overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '~/components/overlays/Dialog/DialogTitle/DialogTitle';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';

import styles from './ColorLabelSelectionDialog.module.css';

interface ColorLabelSelectionDialogProps {
  open: boolean;
  label: string;
  description?: string;
  items: readonly SelectableChipItem[];
  value: readonly string[];
  chipsLabel?: string;
  cancelLabel: string;
  onClose: () => void;
  onSubmit: (value: string[]) => void | Promise<void>;
}

const ColorLabelSelectionDialog = (props: Props<ColorLabelSelectionDialogProps>) => {
  const { ts } = useI18n();
  const [selectedIds, setSelectedIds] = createSignal<string[]>([]);
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  createEffect(
    on(
      () => props.open,
      (open) => {
        if (!open) return;
        batch(() => {
          setSelectedIds([...props.value]);
          setIsSubmitting(false);
        });
      },
      { defer: true },
    ),
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

  const handleSubmitClick = () => {
    void handleSubmit();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} class={props.class}>
      <DialogTitle label={props.label} />
      <DialogBody>
        <Show when={props.description}>
          <Text as="p" variant="bodySm" tone="muted" class={styles.description}>
            {props.description}
          </Text>
        </Show>
        <SelectableChips
          items={props.items}
          value={selectedIds()}
          label={props.chipsLabel}
          onChange={setSelectedIds}
          disabled={isSubmitting()}
        />
      </DialogBody>
      <DialogActions>
        <Button variant="ghost" onClick={handleClose} disabled={isSubmitting()} label={props.cancelLabel} />
        <Button onClick={handleSubmitClick} loading={isSubmitting()} label={ts('common.confirm')} />
      </DialogActions>
    </Dialog>
  );
};

export type { ColorLabelSelectionDialogProps };
export default ColorLabelSelectionDialog;
