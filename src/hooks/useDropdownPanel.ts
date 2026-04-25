import type { Accessor } from 'solid-js';
import { onCleanup } from 'solid-js';

import { createDropdownSurfaceKeyDownHandler, focusDropdownItem, getDropdownOpenTarget } from '~/utils/dropdown';

import useDropdownState from './useDropdownState';

interface UseDropdownPanelOptions {
  rootRef: Accessor<HTMLElement | undefined>;
  panelRef: Accessor<HTMLElement | undefined>;
  triggerRef?: Accessor<HTMLElement | undefined>;
  isInteractive?: Accessor<boolean>;
  focusTriggerOnTab?: boolean;
}

interface OpenFromKeyboardOptions {
  ignoreWhenOpen?: boolean;
}

const useDropdownPanel = (options: UseDropdownPanelOptions) => {
  const dropdown = useDropdownState(options.rootRef, { isInteractive: options.isInteractive });

  let focusRafId: number | undefined;

  const openAndFocus = (target: 'first' | 'last') => {
    dropdown.openDropdown();
    if (focusRafId !== undefined) cancelAnimationFrame(focusRafId);
    focusRafId = requestAnimationFrame(() => {
      focusRafId = undefined;
      const panel = options.panelRef();
      if (!panel) return;
      focusDropdownItem(panel, target);
    });
  };

  onCleanup(() => {
    if (focusRafId !== undefined) cancelAnimationFrame(focusRafId);
  });

  const openFromKeyboard = (event: KeyboardEvent, keyboardOptions?: OpenFromKeyboardOptions): boolean => {
    if (keyboardOptions?.ignoreWhenOpen && dropdown.open()) return false;

    const target = getDropdownOpenTarget(event);
    if (!target) return false;

    openAndFocus(target);
    return true;
  };

  const handlePanelKeyDown = createDropdownSurfaceKeyDownHandler({
    getSurface: () => options.panelRef(),
    closeDropdown: dropdown.close,
    focusTrigger: () => options.triggerRef?.()?.focus(),
    focusTriggerOnTab: options.focusTriggerOnTab,
  });

  return {
    ...dropdown,
    openAndFocus,
    openFromKeyboard,
    handlePanelKeyDown,
  };
};

export default useDropdownPanel;
