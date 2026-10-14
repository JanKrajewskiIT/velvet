import { type Accessor, createEffect, createUniqueId, getOwner, onCleanup, onMount } from 'solid-js';

import { createMarqueeSnapshot } from './marqueeSnapshot';

/** The second lane mirrors presentation without mounting a Solid child under two parents. */
export const createMarqueeCopy = (
  source: () => HTMLElement,
  target: () => HTMLElement,
  version: Accessor<unknown>,
): void => {
  if (!getOwner()) throw new Error('createMarqueeCopy requires a Solid owner.');
  const snapshot = createMarqueeSnapshot(createUniqueId());
  onMount(() => {
    const original = source();
    const copy = target();
    let frame = 0;
    const sync = () => snapshot(original, copy);
    sync();
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(original, { attributes: true, childList: true, characterData: true, subtree: true });
    original.addEventListener('input', schedule);
    original.addEventListener('change', schedule);
    createEffect(() => {
      version();
      schedule();
    });
    onCleanup(() => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      original.removeEventListener('input', schedule);
      original.removeEventListener('change', schedule);
    });
  });
};
