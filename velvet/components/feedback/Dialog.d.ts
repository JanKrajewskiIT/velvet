import * as React from 'react';
/** Modal dialog or side drawer. Traps focus, restores it on close, Esc + backdrop click dismiss. Becomes a bottom sheet under 640px (center placement). */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** center = modal · right / left = full-height drawer sliding from that edge */
  placement?: 'center' | 'right' | 'left';
  dismissible?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
