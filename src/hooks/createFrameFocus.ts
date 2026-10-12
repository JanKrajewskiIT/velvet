import { type Accessor, getOwner, onCleanup } from 'solid-js';

export type FrameFocus = (selector?: string) => void;

/** Coalesces focus requests after rendering and cancels pending work with its owner. */
export const createFrameFocus = (
  root: Accessor<HTMLElement | undefined>,
  options: FocusOptions = { preventScroll: true },
): FrameFocus => {
  if (!getOwner()) throw new Error('createFrameFocus requires a Solid owner.');
  let frame = 0;
  onCleanup(() => cancelAnimationFrame(frame));
  return (selector?: string) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const element = root();
      const target = selector ? element?.querySelector<HTMLElement>(selector) : element;
      if (target?.isConnected) target.focus(options);
    });
  };
};
