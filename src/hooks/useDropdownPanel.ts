import type { Accessor } from 'solid-js';

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

  const openAndFocus = (target: 'first' | 'last') => {
    dropdown.openDropdown();
    requestAnimationFrame(() => {
      const panel = options.panelRef();
      if (!panel) return;
      focusDropdownItem(panel, target);
    });
  };

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
