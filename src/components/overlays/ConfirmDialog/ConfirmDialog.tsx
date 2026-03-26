import { FiAlertTriangle, FiHelpCircle } from 'solid-icons/fi';

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
  cancelLabel: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog = (props: Props<ConfirmDialogProps>) => {
  const isDanger = () => (props.variant ?? 'primary') === 'danger';

  return (
    <Dialog open={props.open} onClose={props.onClose} class={props.class}>
      <DialogTitle label={props.label} />
      <DialogBody>
        <div class={classNames(styles.iconWrapper, isDanger() ? styles.iconDanger : styles.iconPrimary)}>
          {isDanger() ? <FiAlertTriangle /> : <FiHelpCircle />}
        </div>
        <Text as="p" variant="bodyMd" tone="muted">
          {props.message}
        </Text>
      </DialogBody>
      <DialogActions>
        <Button variant="ghost" onClick={() => props.onClose()} label={props.cancelLabel} />
        <Button variant={props.variant ?? 'primary'} onClick={() => props.onConfirm()} label={props.confirmLabel} />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
