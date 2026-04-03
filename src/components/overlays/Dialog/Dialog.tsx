import { createEffect, createMemo, createUniqueId, type JSX, on, onCleanup, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import useFocusTrap from '~/hooks/useFocusTrap';
import type Props from '~/models/Props';
import { joinAriaIds } from '~/utils/aria';
import classNames from '~/utils/classNames';

import Surface from '../../surfaces/Surface/Surface';
import styles from './Dialog.module.css';
import { DialogContext } from './DialogContext';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Dialog = (props: Props<DialogProps>) => {
  const [local, rest] = splitProps(props, [
    'open',
    'onClose',
    'children',
    'class',
    'aria-labelledby',
    'aria-describedby',
  ]);
  let dialogRef: HTMLDialogElement | undefined;
  const titleId = createUniqueId();
  const labelledBy = createMemo(() => joinAriaIds(local['aria-labelledby'], titleId));

  useFocusTrap(
    () => dialogRef,
    () => local.open,
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
    const element = dialogRef;
    if (!element) return;

    element.addEventListener('click', handleClick);

    onCleanup(() => {
      element.removeEventListener('click', handleClick);
      if (element.open) {
        element.close();
      }
    });
  });

  createEffect(
    on(
      () => local.open,
      (open) => {
        const el = dialogRef;
        if (!el) return;

        if (open) {
          if (!el.open) {
            el.showModal();
          }
          return;
        }

        if (el.open) {
          el.close();
        }
      },
    ),
  );

  return (
    <Portal>
      <dialog
        ref={dialogRef}
        {...rest}
        class={styles.dialog}
        aria-modal="true"
        aria-labelledby={labelledBy()}
        aria-describedby={local['aria-describedby']}
        onCancel={handleCancel}
      >
        <Surface class={classNames(styles.panel, local.class)} elevation="dialog">
          <DialogContext.Provider value={{ titleId }}>{local.children}</DialogContext.Provider>
        </Surface>
      </dialog>
    </Portal>
  );
};

export default Dialog;
