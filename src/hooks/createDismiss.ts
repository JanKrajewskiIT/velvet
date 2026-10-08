import { type Accessor, createEffect, onCleanup } from 'solid-js';

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
    () => open() && escape,
    () => {
      onDismiss('escape');
      if (refocus) root()?.querySelector<HTMLElement>(refocus)?.focus();
    },
  );
  createEffect(() => {
    if (!open() || !outside) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = root();
      if (el && e.target instanceof Node && !el.contains(e.target)) onDismiss('outside');
    };
    document.addEventListener('mousedown', onPointerDown);
    onCleanup(() => document.removeEventListener('mousedown', onPointerDown));
  });
};
