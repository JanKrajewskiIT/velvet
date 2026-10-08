import { createEffect, createSignal, onCleanup } from 'solid-js';

const MIN_WIDTH = 120;

/**
 * Tracks the content width of an element. Attach `ref` to the host; `width` starts at `initial`
 * (server render and first paint) and follows a ResizeObserver, which is disconnected on cleanup.
 */
export const createWidth = (initial = 600) => {
  const [width, setWidth] = createSignal(initial);
  const [host, setHost] = createSignal<HTMLElement>();

  createEffect(() => {
    const element = host();
    if (!element) return;
    setWidth(element.clientWidth || initial);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.max(MIN_WIDTH, entry.contentRect.width));
    });
    observer.observe(element);
    onCleanup(() => observer.disconnect());
  });

  const ref = (element: HTMLElement) => setHost(element);
  return { ref, width } as const;
};
