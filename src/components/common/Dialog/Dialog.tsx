import { createEffect, createUniqueId, type JSX, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

import type Props from '../../../models/Props';
import styles from './Dialog.module.css';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Dialog = (props: Props<DialogProps>) => {
  let dialogRef: HTMLDialogElement | undefined;
  const titleId = createUniqueId();

  const handleClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      props.onClose();
    }
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
  });

  onCleanup(() => {
    dialogRef?.removeEventListener('click', handleClick);
    dialogRef?.close();
  });

  return (
    <Portal>
      <dialog
        ref={dialogRef}
        class={`${styles.dialog} ${props.class ?? ''}`}
        aria-labelledby={titleId}
        data-dialog-title-id={titleId}
        onClose={() => props.onClose()}
      >
        {props.children}
      </dialog>
    </Portal>
  );
};

export default Dialog;
