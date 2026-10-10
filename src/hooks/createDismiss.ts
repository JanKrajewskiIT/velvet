import type { Accessor } from 'solid-js';

import { createLayer } from './createLayer';

export type DismissReason = 'outside' | 'escape';

export interface DismissOptions {
  /** Dismiss on a mousedown outside the root. @default true */
  outside?: boolean;
  /** Dismiss on Escape (topmost layer only). @default true */
  escape?: boolean;
  /** Selector inside the root that receives focus after Escape — the trigger. @default '[aria-expanded]' */
  refocus?: string | false;
}

/** Closes a popover-like surface on outside mousedown and Escape while `open()` is true. */
export const createDismiss = (
  open: Accessor<boolean>,
  onDismiss: (reason: DismissReason) => void,
  root: Accessor<HTMLElement | undefined>,
  { outside = true, escape = true, refocus = '[aria-expanded]' }: DismissOptions = {},
): void => {
  createLayer(
    open,
    () => {
      onDismiss('escape');
      if (refocus) root()?.querySelector<HTMLElement>(refocus)?.focus();
    },
    { root, escape, onOutside: () => outside && onDismiss('outside') },
  );
};
