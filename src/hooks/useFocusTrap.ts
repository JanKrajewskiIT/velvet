import type { Accessor } from 'solid-js';
import { createEffect, onCleanup } from 'solid-js';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null && !el.hasAttribute('aria-hidden')
  );

const focusFirst = (container: HTMLElement): void => {
  const focusable = getFocusableElements(container);
  focusable[0]?.focus();
};

const useFocusTrap = (
  containerRef: Accessor<HTMLElement | undefined>,
  isActive: Accessor<boolean>,
  options?: { restoreFocusRef?: Accessor<HTMLElement | undefined> }
): void => {
  let previousActive = false;
  let previouslyFocused: HTMLElement | null = null;

  createEffect(() => {
    if (typeof document === 'undefined') return;

    const container = containerRef();
    const active = isActive();

    if (!active) {
      if (previousActive && options?.restoreFocusRef?.()) {
        const el = options.restoreFocusRef();
        el?.focus();
      } else if (previousActive && previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
      previousActive = false;
      return;
    }

    previouslyFocused = document.activeElement as HTMLElement | null;
    previousActive = true;

    if (!container) return;

    const el = container;
    requestAnimationFrame(() => focusFirst(el));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements(el);
      if (focusable.length === 0) return;

      const current = document.activeElement as HTMLElement | null;
      const currentIndex = current ? focusable.indexOf(current) : -1;

      if (e.shiftKey) {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
        focusable[prevIndex]?.focus();
      } else {
        e.preventDefault();
        const nextIndex = currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1;
        focusable[nextIndex]?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  });
};

export default useFocusTrap;
