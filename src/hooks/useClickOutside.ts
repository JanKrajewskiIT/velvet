import type { Accessor } from 'solid-js';
import { createEffect, onCleanup } from 'solid-js';

export default function useClickOutside(
  ref: Accessor<HTMLElement | undefined>,
  isActive: Accessor<boolean>,
  onClickOutside: () => void
): void {
  const handleClick = (e: MouseEvent): void => {
    const el = ref();
    if (el && !el.contains(e.target as Node)) {
      onClickOutside();
    }
  };

  createEffect(() => {
    if (isActive()) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }

    onCleanup(() => {
      document.removeEventListener('mousedown', handleClick);
    });
  });
}
