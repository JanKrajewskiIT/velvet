import { createSignal, type JSX } from 'solid-js';

import type Props from '~/models/Props';

import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

export interface ConfirmActionRenderContext {
  openConfirm: () => void;
  closeConfirm: () => void;
  isConfirmOpen: () => boolean;
}

export interface ConfirmActionProps {
  label: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => void | Promise<void>;
  onClose?: () => void;
  children: (context: ConfirmActionRenderContext) => JSX.Element;
}

const ConfirmAction = (props: Props<ConfirmActionProps>) => {
  const [open, setOpen] = createSignal(false);

  const closeConfirm = () => {
    setOpen(false);
    props.onClose?.();
  };

  const openConfirm = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    void Promise.resolve(props.onConfirm()).finally(closeConfirm);
  };

  return (
    <>
      {props.children({
        openConfirm,
        closeConfirm,
        isConfirmOpen: open,
      })}
      <ConfirmDialog
        class={props.class}
        open={open()}
        label={props.label}
        message={props.message}
        confirmLabel={props.confirmLabel}
        cancelLabel={props.cancelLabel}
        variant={props.variant}
        onConfirm={handleConfirm}
        onClose={closeConfirm}
      />
    </>
  );
};

export default ConfirmAction;
