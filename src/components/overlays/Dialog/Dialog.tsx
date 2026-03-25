import { createEffect, createUniqueId, type JSX, onCleanup, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import useFocusTrap from '~/hooks/useFocusTrap';
import type Props from '~/models/Props';
import { joinAriaIds } from '~/utils/aria';
import classNames from '~/utils/classNames';

import styles from './Dialog.module.css';
import { DialogContext } from './DialogContext';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Dialog = (props: Props<DialogProps>) => {
  const [local] = splitProps(props, ['open', 'onClose', 'children', 'class', 'aria-labelledby', 'aria-describedby']);
  let dialogRef: HTMLDialogElement | undefined;
  const titleId = createUniqueId();

  useFocusTrap(
    () => dialogRef,
    () => local.open
  );

  const handleClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      local.onClose();
    }
  };

  const handleCancel: JSX.EventHandler<HTMLDialogElement, Event> = (e) => {
    e.preventDefault();
    local.onClose();
  };

  createEffect(() => {
    const el = dialogRef;
    if (!el) return;

    if (local.open) {
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
        class={classNames(styles.dialog, local.class)}
        aria-labelledby={joinAriaIds(local['aria-labelledby'], titleId)}
        aria-describedby={local['aria-describedby']}
        onCancel={handleCancel}
      >
        <DialogContext.Provider value={{ titleId }}>{local.children}</DialogContext.Provider>
      </dialog>
    </Portal>
  );
};

export default Dialog;
