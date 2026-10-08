import { type Accessor, createEffect, createMemo, createSignal, type JSX, onCleanup } from 'solid-js';

import { fixedOrigin, type FloatingAlign, type FloatingSide, placeFloating, type Placement } from '../utils/floating';

const DEFAULT_OFFSET_PX = 6;
const DEFAULT_PADDING_PX = 8;

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
 * Places a panel next to its anchor while `open()` is true: `position: fixed` (so it escapes clipping ancestors and
 * stays in DOM order), flipped and shifted to stay inside the viewport, and re-placed on scroll, resize and size changes.
 */
export const createFloating = (
  open: Accessor<boolean>,
  anchor: Accessor<Element | undefined>,
  options: FloatingOptions = {},
): Floating => {
  const { offset = DEFAULT_OFFSET_PX, padding = DEFAULT_PADDING_PX, matchWidth = false } = options;
  const preferred = () => options.side?.() ?? 'bottom';
  const [panel, setPanel] = createSignal<HTMLElement>();
  const [placement, setPlacement] = createSignal<Placement & { anchorWidth: number }>();

  createEffect(() => {
    if (!open() || !panel() || !anchor()) {
      setPlacement(undefined);
      return;
    }
    const side = preferred();
    const align = options.align?.() ?? 'start';
    let frame = 0;

    const measure = () => {
      const element = panel();
      const reference = anchor();
      if (!element || !reference) return;
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
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    const watched = [panel(), anchor()];
    for (const target of watched) if (target) observer?.observe(target);
    onCleanup(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
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
      ...(matchWidth && { width: `${Math.round(placed.anchorWidth)}px` }),
    };
  });

  return { ref: setPanel, style, side: () => placement()?.side ?? preferred() };
};
