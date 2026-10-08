import { type Accessor, createEffect, createSignal, onCleanup, type Setter } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';

const FIELD_SELECTOR = '.vui-datefield';
const FOCUSABLE_DAY = '.vui-cal__day[tabindex="0"]';

export interface PickerPopover {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  /** Ref of the `vui-popover-wrap` element that contains the field and the popover. */
  setWrap: Setter<HTMLElement | undefined>;
  /** Closes without moving focus. */
  close: () => void;
  /** Closes and returns focus to the field button. */
  closeToField: () => void;
}

/** Open state, outside-click / Escape dismissal, focus return and first-day focus for the date and time pickers. */
export const createPickerPopover = (initialOpen: boolean): PickerPopover => {
  const [open, setOpen] = createSignal(initialOpen);
  const [wrap, setWrap] = createSignal<HTMLElement>();
  const close = () => setOpen(false);
  const closeToField = () => {
    close();
    wrap()?.querySelector<HTMLElement>(FIELD_SELECTOR)?.focus();
  };
  createDismiss(open, close, wrap, { refocus: FIELD_SELECTOR });
  createEffect(() => {
    if (!open()) return;
    const frame = requestAnimationFrame(() => wrap()?.querySelector<HTMLElement>(FOCUSABLE_DAY)?.focus());
    onCleanup(() => cancelAnimationFrame(frame));
  });
  return { open, setOpen, setWrap, close, closeToField };
};
