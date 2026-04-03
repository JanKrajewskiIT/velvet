import type { Accessor } from 'solid-js';
import { createEffect, onCleanup } from 'solid-js';

export default function useClickOutside(
  ref: Accessor<HTMLElement | undefined>,
  isActive: Accessor<boolean>,
  onClickOutside: () => void,
): void {
  const handleClick = (e: PointerEvent): void => {
    const el = ref();
    if (el && !el.contains(e.target as Node)) {
      onClickOutside();
    }
  };

  createEffect(() => {
    if (typeof document === 'undefined') return;

    if (isActive()) {
      document.addEventListener('pointerdown', handleClick);
    } else {
      document.removeEventListener('pointerdown', handleClick);
    }

    onCleanup(() => {
      document.removeEventListener('pointerdown', handleClick);
    });
  });
}
