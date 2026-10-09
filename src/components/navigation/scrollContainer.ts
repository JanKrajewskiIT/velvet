/** Scroll container: element, selector, or accessor returning the element. Omit to use the window. */
export type ScrollContainer = string | HTMLElement | (() => HTMLElement | null | undefined);

/** Browser-only: call from effects and event handlers. */
export const resolveScrollContainer = (container: ScrollContainer | undefined): HTMLElement | null => {
  if (typeof container === 'string') return document.querySelector<HTMLElement>(container);
  if (typeof container === 'function') return container() ?? null;
  return container ?? null;
};
