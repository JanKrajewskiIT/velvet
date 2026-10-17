import type { FloatingBox } from './floating';

const CLIPPING_OVERFLOW = /^(auto|scroll|hidden|clip)$/u;

/** Top-layer panels must still respect the visible portion of their anchor's scroll containers. */
export const isFloatingAnchorVisible = (box: FloatingBox, context: Element | undefined): boolean => {
  if (
    context &&
    (!context.isConnected ||
      context.getClientRects().length === 0 ||
      getComputedStyle(context).visibility !== 'visible')
  )
    return false;
  let left = 0;
  let top = 0;
  let right = document.documentElement.clientWidth;
  let bottom = document.documentElement.clientHeight;

  for (let node = context?.parentElement; node && node !== document.documentElement; node = node.parentElement) {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    if (CLIPPING_OVERFLOW.test(style.overflowX)) {
      left = Math.max(left, rect.left + node.clientLeft);
      right = Math.min(right, rect.left + node.clientLeft + node.clientWidth);
    }
    if (CLIPPING_OVERFLOW.test(style.overflowY)) {
      top = Math.max(top, rect.top + node.clientTop);
      bottom = Math.min(bottom, rect.top + node.clientTop + node.clientHeight);
    }
  }

  return (
    right > left &&
    bottom > top &&
    box.left + box.width > left &&
    box.left < right &&
    box.top + box.height > top &&
    box.top < bottom
  );
};
