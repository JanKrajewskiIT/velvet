import type { JSX } from 'solid-js';

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: JSX.Element;
  /** Accessible name when there is no title. */
  label?: string;
  description?: JSX.Element;
  footer?: JSX.Element;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** center = modal · right / left = full-height drawer sliding from that edge. @default 'center' */
  placement?: 'center' | 'right' | 'left';
  /** Escape, backdrop click and the close button dismiss. @default true */
  dismissible?: boolean;
  /** Accessible name of the close button. @default localized "Close" */
  closeLabel?: string;
  /** Selector within the dialog for its initial focus target. */
  initialFocus?: string;
  /** Logical fallback when the element that opened the dialog no longer exists. */
  restoreFocus?: () => HTMLElement | undefined;
  class?: string;
  children?: JSX.Element;
}

export type ResolvedDialogProps = DialogProps & Required<Pick<DialogProps, 'size' | 'placement' | 'dismissible'>>;
