import { type Accessor, createEffect } from 'solid-js';

export const createActiveOptionScroll = (open: Accessor<boolean>, id: Accessor<string | undefined>): void => {
  createEffect(
    () => [id(), open()] as const,
    ([currentId, opened]) => {
      if (!opened || !currentId) return;
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
      return () => cancelAnimationFrame(frame);
    },
  );
};
