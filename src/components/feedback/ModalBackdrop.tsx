import type { JSX } from 'solid-js';

import { isTopLayer } from '../../hooks/createLayer';

export interface ModalBackdropProps extends Pick<
  JSX.HTMLAttributes<HTMLDialogElement>,
  'aria-label' | 'aria-labelledby' | 'aria-describedby'
> {
  class: string;
  ref: (element: HTMLDialogElement) => void;
  /** Called on a mouse press that starts on the backdrop itself; omit to make the backdrop inert. */
  onDismiss?: (() => void) | undefined;
  children?: JSX.Element;
}

/** Pointer shortcut for dismissing a modal; keyboard dismissal is owned by `createModalRoot` (Escape). */
export const ModalBackdrop = (props: ModalBackdropProps) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- backdrop dismissal supplements the modal's Escape and close controls
  <dialog
    ref={props.ref}
    class={props.class}
    data-vui-modal
    aria-label={props['aria-label']}
    aria-labelledby={props['aria-labelledby']}
    aria-describedby={props['aria-describedby']}
    onMouseDown={(e) => {
      if (e.target === e.currentTarget && isTopLayer(e.currentTarget, e)) props.onDismiss?.();
    }}
  >
    {props.children}
  </dialog>
);
