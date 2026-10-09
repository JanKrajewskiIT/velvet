import type { JSX } from 'solid-js';

export interface ModalBackdropProps {
  class: string;
  /** Called on a mouse press that starts on the backdrop itself; omit to make the backdrop inert. */
  onDismiss?: (() => void) | undefined;
  children?: JSX.Element;
}

/** Pointer shortcut for dismissing a modal; keyboard dismissal is owned by `createModalRoot` (Escape). */
export const ModalBackdrop = (props: ModalBackdropProps) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- backdrop click is a pointer shortcut; keyboard dismissal is handled by createModal (Escape)
  <div
    class={props.class}
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) props.onDismiss?.();
    }}
  >
    {props.children}
  </div>
);
