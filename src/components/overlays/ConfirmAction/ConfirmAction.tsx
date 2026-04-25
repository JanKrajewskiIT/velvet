import { createSignal, type JSX, splitProps } from 'solid-js';

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
  variant?: 'primary' | 'danger';
  onConfirm: () => void | Promise<void>;
  onClose?: () => void;
  children: (context: ConfirmActionRenderContext) => JSX.Element;
}

const ConfirmAction = (props: Props<ConfirmActionProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'label',
    'message',
    'confirmLabel',
    'variant',
    'onConfirm',
    'onClose',
    'children',
  ]);
  const [open, setOpen] = createSignal(false);

  const closeConfirm = () => {
    setOpen(false);
    local.onClose?.();
  };

  const openConfirm = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    void Promise.resolve(local.onConfirm()).finally(closeConfirm);
  };

  return (
    <>
      {local.children({
        openConfirm,
        closeConfirm,
        isConfirmOpen: open,
      })}
      <ConfirmDialog
        {...rest}
        class={local.class}
        open={open()}
        label={local.label}
        message={local.message}
        confirmLabel={local.confirmLabel}
        variant={local.variant}
        onConfirm={handleConfirm}
        onClose={closeConfirm}
      />
    </>
  );
};

export default ConfirmAction;
