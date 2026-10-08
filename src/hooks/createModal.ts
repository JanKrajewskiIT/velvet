import { type Accessor, createEffect, onCleanup } from 'solid-js';

import { createLayer } from './createLayer';

const FOCUSABLE =
  'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface ModalOptions {
  /** Called when Escape reaches this layer. Omit for a non-dismissible modal. */
  onEscape?: () => void;
  /** Selector for the element that receives focus on open. Defaults to `[autofocus]`, then the first focusable element, then the root. */
  initialFocus?: string;
}

/** Makes every body-level sibling branch of `root` inert and returns the function that restores them. */
const inertBackground = (root: HTMLElement): (() => void) => {
  const changed: HTMLElement[] = [];
  for (let node: HTMLElement | null = root; node && node !== document.body; node = node.parentElement) {
    for (const sibling of node.parentElement?.children ?? []) {
      if (sibling === node || !(sibling instanceof HTMLElement) || sibling.inert) continue;
      sibling.inert = true;
      changed.push(sibling);
    }
  }
  return () => changed.forEach((el) => (el.inert = false));
};

const focusInitial = (root: HTMLElement, selector?: string) => {
  const target =
    (selector && root.querySelector<HTMLElement>(selector)) ||
    root.querySelector<HTMLElement>('[autofocus]') ||
    root.querySelector<HTMLElement>(FOCUSABLE) ||
    root;
  target.focus({ preventScroll: true });
};

/**
 * Modal layer lifecycle while `open()` is true: focus moves into `root`, the rest of the page is inert (focus cannot leave,
 * no Tab handler needed), Escape goes through the shared layer stack, and focus returns to the previously focused element on close.
 * `root` must be rendered outside the elements it makes inert, e.g. through a `Portal`.
 */
export const createModal = (
  open: Accessor<boolean>,
  root: Accessor<HTMLElement | undefined>,
  options: ModalOptions = {},
): void => {
  createLayer(open, () => options.onEscape?.());
  createEffect(() => {
    const el = root();
    if (!open() || !el) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    const restoreBackground = inertBackground(el);
    focusInitial(el, options.initialFocus);
    onCleanup(() => {
      restoreBackground();
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    });
  });
};
