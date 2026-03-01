import { type JSX, onCleanup, onMount } from 'solid-js';
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

  const handleClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      props.onClose();
    }
  };

  onMount(() => {
    if (props.open && dialogRef) {
      dialogRef.showModal();
      dialogRef.addEventListener('click', handleClick);
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
        onClose={() => props.onClose()}
      >
        {props.children}
      </dialog>
    </Portal>
  );
};

export default Dialog;
