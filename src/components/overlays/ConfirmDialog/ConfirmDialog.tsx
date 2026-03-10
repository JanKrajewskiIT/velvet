import { FiAlertTriangle, FiHelpCircle } from 'solid-icons/fi';

import type Props from '~/models/Props';

import Button from '../../inputs/Button/Button';
import Dialog from '../Dialog/Dialog';
import DialogActions from '../Dialog/DialogActions';
import DialogBody from '../Dialog/DialogBody';
import DialogTitle from '../Dialog/DialogTitle';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
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
      <DialogTitle>{props.title}</DialogTitle>
      <DialogBody>
        <div
          class={`${styles.iconWrapper} ${isDanger() ? styles.iconDanger : styles.iconPrimary}`}
        >
          {isDanger() ? <FiAlertTriangle /> : <FiHelpCircle />}
        </div>
        <p class={styles.message}>{props.message}</p>
      </DialogBody>
      <DialogActions>
        <Button variant="ghost" onClick={() => props.onClose()}>
          {props.cancelLabel}
        </Button>
        <Button
          variant={props.variant ?? 'primary'}
          onClick={() => props.onConfirm()}
        >
          {props.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
