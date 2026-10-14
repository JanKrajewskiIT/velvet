import { type Accessor, createEffect, onCleanup } from 'solid-js';

export const createActiveOptionScroll = (open: Accessor<boolean>, id: Accessor<string | undefined>): void => {
  createEffect(() => {
    const currentId = id();
    if (!open() || !currentId) return;
    const frame = requestAnimationFrame(() => {
      const option = document.getElementById(currentId);
      if (!option) return;
      const list = option.closest<HTMLElement>('[role="listbox"]');
      if (!list) return;
      const optionRect = option.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      if (optionRect.top < listRect.top) list.scrollTop -= listRect.top - optionRect.top;
      else if (optionRect.bottom > listRect.bottom) list.scrollTop += optionRect.bottom - listRect.bottom;
    });
    onCleanup(() => cancelAnimationFrame(frame));
  });
};
