import { type Accessor, createEffect, createMemo, createSignal, type JSX, onCleanup } from 'solid-js';

import { fixedOrigin, type FloatingAlign, type FloatingSide, placeFloating, type Placement } from '../utils/floating';

const DEFAULT_OFFSET_PX = 6;
const DEFAULT_PADDING_PX = 8;

export interface FloatingAnchor {
  getBoundingClientRect: () => DOMRect;
  /** Element whose size changes invalidate a virtual anchor, such as a textarea caret. */
  contextElement?: Element;
}

export interface FloatingOptions {
  /** Preferred side; flips to the opposite one when that leaves more room. @default 'bottom' */
  side?: Accessor<FloatingSide>;
  /** @default 'start' */
  align?: Accessor<FloatingAlign>;
  /** Gap between anchor and panel, px. @default 6 */
  offset?: number;
  /** Distance kept from the viewport edge, px. @default 8 */
  padding?: number;
  /** Give the panel the anchor's width. @default false */
  matchWidth?: boolean;
  /** Keep a content-sized panel at least as wide as its anchor. @default false */
  minWidth?: boolean;
}

export interface Floating {
  /** Pass to the panel's `ref`. */
  ref: (element: HTMLElement) => void;
  /** Inline style for the panel; `undefined` until the first measurement. */
  style: Accessor<JSX.CSSProperties | undefined>;
  /** Side the panel ended up on after flipping, or the preferred one before measurement. */
  side: Accessor<FloatingSide>;
}

/**
 * Places a panel in DOM order using fixed coordinates and the native manual popover top layer when available.
 * Older browsers use containing-block compensation; transformed clipping ancestors can still clip that fallback.
 */
export const createFloating = (
  open: Accessor<boolean>,
  anchor: Accessor<FloatingAnchor | undefined>,
  options: FloatingOptions = {},
): Floating => {
  const { offset = DEFAULT_OFFSET_PX, padding = DEFAULT_PADDING_PX, matchWidth = false, minWidth = false } = options;
  const preferred = () => options.side?.() ?? 'bottom';
  const [panel, setPanel] = createSignal<HTMLElement>();
  const [placement, setPlacement] = createSignal<Placement & { anchorWidth: number }>();
  const ref = (element: HTMLElement) => {
    element.setAttribute('data-vui-floating', '');
    if (typeof element.showPopover === 'function') element.popover = 'manual';
    setPanel(element);
  };

  createEffect(() => {
    if (!open() || !panel() || !anchor()) {
      setPlacement(undefined);
      return;
    }
    const side = preferred();
    const align = options.align?.() ?? 'start';
    const openedPanel = panel();
    if (!openedPanel) return;
    let frame = 0;

    const measure = () => {
      const element = panel();
      const reference = anchor();
      if (!element || !reference || !element.isConnected) return;
      const dialog = element.closest('dialog[data-vui-modal]');
      if (dialog && !dialog.hasAttribute('open')) return;
      if (element.popover === 'manual' && !element.matches(':popover-open')) element.showPopover();
      const box = reference.getBoundingClientRect();
      const origin = fixedOrigin(element);
      const placed = placeFloating(
        box,
        { width: matchWidth ? box.width : element.offsetWidth, height: element.offsetHeight },
        { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight },
        { side, align, offset, padding },
      );
      setPlacement({
        side: placed.side,
        x: Math.round(placed.x - origin.x),
        y: Math.round(placed.y - origin.y),
        anchorWidth: box.width,
      });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    // A parent modal may enter the top layer after its children's first effects.
    schedule();
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    const reference = anchor();
    const watched = [openedPanel, reference instanceof Element ? reference : reference?.contextElement];
    for (const target of watched) if (target) observer?.observe(target);
    onCleanup(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
      if (openedPanel.popover === 'manual' && openedPanel.matches(':popover-open')) openedPanel.hidePopover();
    });
  });

  const style = createMemo<JSX.CSSProperties | undefined>(() => {
    const placed = placement();
    if (!placed) return undefined;
    return {
      position: 'fixed',
      left: `${placed.x}px`,
      top: `${placed.y}px`,
      right: 'auto',
      bottom: 'auto',
      transform: 'none',
      margin: '0',
      ...(matchWidth && { width: `${Math.round(placed.anchorWidth)}px` }),
      ...((matchWidth || minWidth) && { 'min-width': `${Math.round(placed.anchorWidth)}px` }),
    };
  });

  return { ref, style, side: () => placement()?.side ?? preferred() };
};
