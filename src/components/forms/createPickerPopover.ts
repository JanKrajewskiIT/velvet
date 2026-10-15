import { type Accessor, createEffect, createSignal, type Setter } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating, type Floating } from '../../hooks/createFloating';
import { createFrameFocus } from '../../hooks/createFrameFocus';
import type { FloatingAlign } from '../../utils/floating';

const FIELD_SELECTOR = '[data-vui-date-field]';
const FOCUSABLE_DAY = '[data-vui-calendar-day][tabindex="0"]';

export interface PickerPopover {
  floating: Floating;
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
export const createPickerPopover = (initialOpen: boolean, align?: Accessor<FloatingAlign>): PickerPopover => {
  const [open, setOpen] = createSignal(initialOpen);
  const [wrap, setWrap] = createSignal<HTMLElement>();
  const floating = createFloating(open, () => wrap()?.querySelector(FIELD_SELECTOR) ?? wrap(), { align });
  const focusDay = createFrameFocus(wrap);
  const close = () => setOpen(false);
  const closeToField = () => {
    close();
    wrap()?.querySelector<HTMLElement>(FIELD_SELECTOR)?.focus();
  };
  createDismiss(open, close, wrap, { refocus: FIELD_SELECTOR });
  createEffect(() => {
    if (!open()) return;
    focusDay(FOCUSABLE_DAY);
  });
  return { floating, open, setOpen, setWrap, close, closeToField };
};
