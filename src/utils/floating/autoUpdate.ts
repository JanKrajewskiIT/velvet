import type { ReferenceElement } from './types';

export interface AutoUpdateOptions {
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  animationFrame?: boolean;
}

const getScrollableAncestors = (element: Element | null | undefined): (Element | Window)[] => {
  const result: (Element | Window)[] = [];
  let current: Element | null = element instanceof Element ? element : null;
  while (current) {
    const style = getComputedStyle(current);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const isScroll = /(auto|scroll|overlay)/u.test(overflowY + overflowX);
    if (isScroll) result.push(current);
    current = current.parentElement;
  }
  if (typeof window !== 'undefined') result.push(window);
  return result;
};

const getElementFromReference = (reference: ReferenceElement): Element | undefined => {
  if (reference instanceof Element) return reference;
  return reference.contextElement;
};

/**
 * Subscribes to events that should trigger position recalculation.
 * Returns an unsubscribe function.
 */
const autoUpdate = (
  reference: ReferenceElement,
  floating: HTMLElement,
  update: () => void,
  options: AutoUpdateOptions = {},
): (() => void) => {
  const ancestorScroll = options.ancestorScroll ?? true;
  const ancestorResize = options.ancestorResize ?? true;
  const elementResize = options.elementResize ?? true;
  const animationFrame = options.animationFrame ?? false;

  const refEl = getElementFromReference(reference);
  const ancestors = ancestorScroll || ancestorResize ? getScrollableAncestors(refEl ?? floating) : [];

  if (ancestorScroll) {
    ancestors.forEach((ancestor) => {
      ancestor.addEventListener('scroll', update, { passive: true });
    });
  }
  if (ancestorResize) {
    ancestors.forEach((ancestor) => {
      ancestor.addEventListener('resize', update, { passive: true });
    });
  }

  let resizeObserver: ResizeObserver | undefined;
  if (elementResize && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => update());
    if (refEl) resizeObserver.observe(refEl);
    resizeObserver.observe(floating);
  }

  let rafId: number | undefined;
  let lastRefRect: DOMRect | undefined;
  if (animationFrame) {
    const tick = (): void => {
      const rect = (refEl ?? floating).getBoundingClientRect();
      if (
        !lastRefRect ||
        lastRefRect.x !== rect.x ||
        lastRefRect.y !== rect.y ||
        lastRefRect.width !== rect.width ||
        lastRefRect.height !== rect.height
      ) {
        update();
        lastRefRect = rect;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  return () => {
    if (ancestorScroll) {
      ancestors.forEach((ancestor) => ancestor.removeEventListener('scroll', update));
    }
    if (ancestorResize) {
      ancestors.forEach((ancestor) => ancestor.removeEventListener('resize', update));
    }
    if (resizeObserver) resizeObserver.disconnect();
    if (rafId !== undefined) cancelAnimationFrame(rafId);
  };
};

export default autoUpdate;
