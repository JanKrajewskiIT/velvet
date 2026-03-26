import type { Accessor } from 'solid-js';
import { createSignal } from 'solid-js';

import useClickOutside from './useClickOutside';
import useEscapeKey from './useEscapeKey';

interface UseDropdownStateOptions {
  isInteractive?: Accessor<boolean>;
}

const useDropdownState = (rootRef: Accessor<HTMLElement | undefined>, options?: UseDropdownStateOptions) => {
  const [open, setOpen] = createSignal(false);

  const isInteractive = () => options?.isInteractive?.() ?? true;

  const close = () => {
    setOpen(false);
  };

  const toggle = () => {
    if (!isInteractive()) return;
    setOpen((prev) => !prev);
  };

  const openDropdown = () => {
    if (!isInteractive()) return;
    setOpen(true);
  };

  useEscapeKey(() => open(), close);
  useClickOutside(
    () => rootRef(),
    () => open(),
    close
  );

  return {
    open,
    setOpen,
    close,
    toggle,
    openDropdown,
  };
};

export default useDropdownState;
