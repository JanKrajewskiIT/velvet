import { type Accessor, createSignal } from 'solid-js';

import { createTypeahead } from '../utils/createTypeahead';
import { createFrameFocus } from './createFrameFocus';
import { ownsLayerEvent } from './createLayer';

/** Roving focus for menus whose actions are native buttons. Native buttons own Enter and Space activation. */
export const createMenuNavigation = (
  root: Accessor<HTMLElement | undefined>,
  count: Accessor<number>,
  onClose: (refocus: boolean) => void,
) => {
  const [index, setIndex] = createSignal(0);
  const active = () => (count() ? Math.min(index(), count() - 1) : -1);
  const focusFrame = createFrameFocus(root);
  const search = createTypeahead();
  const nodes = () => Array.from(root()?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
  const focus = (next: number) => {
    setIndex(Math.max(0, Math.min(next, count() - 1)));
    focusFrame('[role="menuitem"][tabindex="0"]');
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!count() || event.defaultPrevented) return;
    let next: number | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = (active() + 1) % count();
        break;
      case 'ArrowUp':
        next = (active() - 1 + count()) % count();
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count() - 1;
        break;
      case 'Escape': {
        const surface = root();
        if (surface && !ownsLayerEvent(surface)) return;
        event.preventDefault();
        onClose(true);
        return;
      }
      case 'Tab':
        // Restore the trigger before native Tab computes the next stop.
        onClose(true);
        return;
      default:
        if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const found = search(
            event.key,
            nodes().map((node) => node.getAttribute('aria-label') ?? node.textContent ?? ''),
            active(),
          );
          if (found >= 0) next = found;
        }
    }
    if (next === undefined) return;
    event.preventDefault();
    focus(next);
  };
  return { active, focus, onFocus: setIndex, onKeyDown };
};
