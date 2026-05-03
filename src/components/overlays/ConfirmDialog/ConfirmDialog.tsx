import { FiAlertTriangle, FiHelpCircle } from 'solid-icons/fi';
import { createMemo, splitProps } from 'solid-js';

import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import Text from '../../typography/Text/Text';
import Dialog from '../Dialog/Dialog';
import DialogActions from '../Dialog/DialogActions/DialogActions';
import DialogBody from '../Dialog/DialogBody/DialogBody';
import DialogTitle from '../Dialog/DialogTitle/DialogTitle';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  label: string;
  message: string;
  confirmLabel: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog = (props: Props<ConfirmDialogProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'open',
    'label',
    'message',
    'confirmLabel',
    'variant',
    'onConfirm',
    'onClose',
    'class',
  ]);
  const isDanger = createMemo(() => (local.variant ?? 'primary') === 'danger');

  return (
    <Dialog {...rest} open={local.open} onClose={local.onClose} class={local.class}>
      <DialogTitle label={local.label} />
      <DialogBody class={styles.body}>
        <div class={classNames(styles.iconWrapper, isDanger() ? styles.iconDanger : styles.iconPrimary)}>
          {isDanger() ? <FiAlertTriangle /> : <FiHelpCircle />}
        </div>
        <Text as="p" variant="bodyMd" tone="muted" class={styles.message}>
          {local.message}
        </Text>
      </DialogBody>
      <DialogActions>
        <Button variant="ghost" onClick={local.onClose} label={ts('common.cancel')} />
        <Button variant={local.variant ?? 'primary'} onClick={local.onConfirm} label={local.confirmLabel} />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
