import { createSignal, type JSX, mergeProps, onCleanup } from 'solid-js';

import { createTrigger } from '../../hooks/createTrigger';
import { Button } from '../actions/Button';
import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

export interface ConfirmActionProps extends Omit<ConfirmDialogProps, 'open' | 'onCancel'> {
  /** Label, a native interactive element, or a render function receiving the open callback. */
  trigger: JSX.Element | ((open: () => void) => JSX.Element);
}

/** Owns the confirmation dialog's open state and closes after confirmation resolves. */
export const ConfirmAction = (props: ConfirmActionProps) => {
  const [open, setOpen] = createSignal(false);
  let disposed = false;
  onCleanup(() => {
    disposed = true;
  });
  const show = () => setOpen(true);
  const trigger = createTrigger(
    () => {
      const value = props.trigger;
      return typeof value === 'function' ? () => value(show) : value;
    },
    {
      onClick: show,
      'aria-haspopup': 'dialog' as const,
      get 'aria-expanded'() {
        return open();
      },
    },
    (content, attributes) => (
      <Button variant="secondary" {...attributes}>
        {content}
      </Button>
    ),
  );
  const rest = mergeProps(props, {
    get open() {
      return open();
    },
    onCancel: () => setOpen(false),
    onConfirm: async () => {
      await props.onConfirm?.();
      if (!disposed) setOpen(false);
    },
  });

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- delegates activation from the supplied native trigger without nesting buttons */}
      <span class="vui-confirm-action" onClick={trigger.onClick}>
        {trigger.content}
      </span>
      <ConfirmDialog {...rest} />
    </>
  );
};
