import { createEffect, createUniqueId, type JSX, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

import useFocusTrap from '~/hooks/useFocusTrap';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Dialog.module.css';
import { DialogContext } from './DialogContext';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Dialog = (props: Props<DialogProps>) => {
  let dialogRef: HTMLDialogElement | undefined;
  const titleId = createUniqueId();

  useFocusTrap(
    () => dialogRef,
    () => props.open
  );

  const handleClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      props.onClose();
    }
  };

  const handleCancel: JSX.EventHandler<HTMLDialogElement, Event> = (e) => {
    e.preventDefault();
    props.onClose();
  };

  createEffect(() => {
    const el = dialogRef;
    if (!el) return;

    if (props.open) {
      if (!el.open) {
        el.showModal();
      }
      el.addEventListener('click', handleClick);
    } else {
      if (el.open) {
        el.close();
      }
      el.removeEventListener('click', handleClick);
    }

    onCleanup(() => {
      el.removeEventListener('click', handleClick);
      if (el.open) {
        el.close();
      }
    });
  });

  return (
    <Portal>
      <dialog
        ref={dialogRef}
        class={classNames(styles.dialog, props.class)}
        aria-labelledby={titleId}
        onCancel={handleCancel}
      >
        <DialogContext.Provider value={{ titleId }}>{props.children}</DialogContext.Provider>
      </dialog>
    </Portal>
  );
};

export default Dialog;
