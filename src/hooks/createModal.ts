import { type Accessor, createEffect, onCleanup } from 'solid-js';

import { createLayer, isTopLayer } from './createLayer';

const FOCUSABLE =
  'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface ModalOptions {
  onEscape?: () => void;
  initialFocus?: string | undefined;
  restoreFocus?: (() => HTMLElement | undefined) | undefined;
}

interface ScrollLock {
  count: number;
  overflow: string;
}

const scrollLocks = new WeakMap<Document, ScrollLock>();

const lockScroll = (document: Document): (() => void) => {
  const root = document.documentElement;
  const lock = scrollLocks.get(document) ?? { count: 0, overflow: root.style.overflow };
  lock.count += 1;
  scrollLocks.set(document, lock);
  root.style.overflow = 'hidden';
  return () => {
    lock.count -= 1;
    if (lock.count) return;
    root.style.overflow = lock.overflow;
    scrollLocks.delete(document);
  };
};

const focusInitial = (root: HTMLDialogElement, selector?: string) => {
  const target =
    (selector && root.querySelector<HTMLElement>(selector)) ||
    root.querySelector<HTMLElement>('[autofocus]') ||
    root.querySelector<HTMLElement>(FOCUSABLE) ||
    root.querySelector<HTMLElement>('[data-vui-focus-fallback]');
  target?.focus({ preventScroll: true });
};

/** Native modality owns focus containment and background inertness; the shared layer stack owns dismissal. */
export const createModal = (
  open: Accessor<boolean>,
  root: Accessor<HTMLDialogElement | undefined>,
  options: ModalOptions = {},
): void => {
  createLayer(open, () => options.onEscape?.(), { root });
  createEffect(() => {
    const dialog = root();
    if (!open() || !dialog) return;
    const document = dialog.ownerDocument;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    const onCancel = (event: Event) => {
      event.preventDefault();
      if (isTopLayer(dialog)) options.onEscape?.();
    };
    dialog.addEventListener('cancel', onCancel);
    dialog.showModal();
    const unlock = lockScroll(document);
    focusInitial(dialog, options.initialFocus);
    onCleanup(() => {
      dialog.removeEventListener('cancel', onCancel);
      dialog.close();
      unlock();
      const target = previouslyFocused?.isConnected ? previouslyFocused : options.restoreFocus?.();
      if (target?.isConnected && !target.closest('[inert]') && !target.closest('dialog:not([open])')) {
        target.focus({ preventScroll: true });
      }
    });
  });
};
