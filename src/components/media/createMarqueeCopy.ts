import { type Accessor, createEffect, createUniqueId, getOwner, onSettled } from 'solid-js';

import { createMarqueeSnapshot } from './marqueeSnapshot';

/** The second lane mirrors presentation without mounting a Solid child under two parents. */
export const createMarqueeCopy = (
  source: () => HTMLElement,
  target: () => HTMLElement,
  version: Accessor<unknown>,
): void => {
  if (!getOwner()) throw new Error('createMarqueeCopy requires a Solid owner.');
  const snapshot = createMarqueeSnapshot(createUniqueId());
  let schedule: (() => void) | undefined;
  createEffect(version, () => schedule?.(), { defer: true });
  onSettled(() => {
    const original = source();
    const copy = target();
    let frame = 0;
    const sync = () => snapshot(original, copy);
    sync();
    const requestSnapshot = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    schedule = requestSnapshot;
    const observer = new MutationObserver(requestSnapshot);
    observer.observe(original, { attributes: true, childList: true, characterData: true, subtree: true });
    original.addEventListener('input', requestSnapshot);
    original.addEventListener('change', requestSnapshot);
    return () => {
      schedule = undefined;
      observer.disconnect();
      cancelAnimationFrame(frame);
      original.removeEventListener('input', requestSnapshot);
      original.removeEventListener('change', requestSnapshot);
    };
  });
};
