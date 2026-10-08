import * as React from 'react';
/** Short hint on hover/focus. Never put essential info or interactive content inside. */
export interface TooltipProps {
  content: React.ReactNode;
  /** @default 'top' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Keyboard shortcut hint, e.g. "⌘K" */
  shortcut?: string;
  /** Force visible (docs/demos) */
  open?: boolean;
  className?: string;
  children: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
