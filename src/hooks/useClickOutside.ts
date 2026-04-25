import type { Accessor } from 'solid-js';
import { createEffect, onCleanup } from 'solid-js';

type FloatingRefs = Accessor<HTMLElement | undefined> | Array<Accessor<HTMLElement | undefined>>;

const collectFloating = (refs: FloatingRefs | undefined): HTMLElement[] => {
  if (!refs) return [];
  const accessors = Array.isArray(refs) ? refs : [refs];
  return accessors.map((accessor) => accessor()).filter((el): el is HTMLElement => el instanceof HTMLElement);
};

export default function useClickOutside(
  ref: Accessor<HTMLElement | undefined>,
  isActive: Accessor<boolean>,
  onClickOutside: () => void,
  floatingRef?: FloatingRefs,
): void {
  const handleClick = (e: PointerEvent): void => {
    const el = ref();
    const target = e.target as Node;
    if (el && !el.contains(target)) {
      const floatings = collectFloating(floatingRef);
      if (floatings.some((floating) => floating.contains(target))) return;
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
