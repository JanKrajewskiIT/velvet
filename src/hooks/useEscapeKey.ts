import type { Accessor } from 'solid-js';
import { createEffect, onCleanup } from 'solid-js';

export default function useEscapeKey(
  isActive: Accessor<boolean>,
  onEscape: () => void
): void {
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      onEscape();
    }
  };

  createEffect(() => {
    if (isActive()) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
}
