import * as React from 'react';
/** Transient status message. With `duration` it auto-dismisses via a countdown bar that pauses on hover/focus. With `onUndo` it becomes the undo pattern — prefer this over a confirm dialog for reversible destructive actions. */
export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Icon name; null hides it. Defaults per tone. */
  icon?: string | null;
  /** Called on dismiss click and when the countdown ends */
  onClose?: () => void;
  /** Auto-dismiss after N ms (shows countdown bar). Suggested: 5000, or 6000 with undo. */
  duration?: number;
  /** Renders an Undo button */
  onUndo?: () => void;
  undoLabel?: string;
}
export declare function Toast(props: ToastProps): JSX.Element;
/** Fixed bottom-right stack (full-width bottom on mobile). New toasts spring in. */
export interface ToastRegionProps { children?: React.ReactNode; className?: string }
export declare function ToastRegion(props: ToastRegionProps): JSX.Element;
