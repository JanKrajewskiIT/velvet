export const getFocusableDropdownItems = (surface: HTMLElement): HTMLButtonElement[] =>
  Array.from(surface.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));

export const getDropdownOpenTarget = (event: KeyboardEvent): 'first' | 'last' | null => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    return 'first';
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    return 'first';
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    return 'last';
  }

  return null;
};

export const handleDropdownArrowNavigation = (
  event: KeyboardEvent,
  items: HTMLButtonElement[],
  currentIndex: number,
): boolean => {
  switch (event.key) {
    case 'ArrowDown': {
      event.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[nextIndex]?.focus();
      return true;
    }
    case 'ArrowUp': {
      event.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prevIndex]?.focus();
      return true;
    }
    case 'Home': {
      event.preventDefault();
      items[0]?.focus();
      return true;
    }
    case 'End': {
      event.preventDefault();
      items[items.length - 1]?.focus();
      return true;
    }
    default:
      return false;
  }
};

export const focusDropdownItem = (surface: HTMLElement, target: 'first' | 'last'): void => {
  const items = getFocusableDropdownItems(surface);
  if (target === 'last') {
    items[items.length - 1]?.focus();
    return;
  }

  items[0]?.focus();
};

interface CreateDropdownSurfaceKeyDownHandlerOptions {
  getSurface: () => HTMLElement | undefined;
  closeDropdown: () => void;
  focusTrigger?: () => void;
  focusTriggerOnTab?: boolean;
}

export const createDropdownSurfaceKeyDownHandler = ({
  getSurface,
  closeDropdown,
  focusTrigger,
  focusTriggerOnTab = false,
}: CreateDropdownSurfaceKeyDownHandlerOptions) => {
  return (event: KeyboardEvent): void => {
    const surface = getSurface();
    if (!surface) return;

    const items = getFocusableDropdownItems(surface);
    const current = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(current as HTMLButtonElement);

    if (handleDropdownArrowNavigation(event, items, currentIndex)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDropdown();
      focusTrigger?.();
      return;
    }

    if (event.key === 'Tab') {
      closeDropdown();
      if (focusTriggerOnTab) {
        focusTrigger?.();
      }
    }
  };
};
