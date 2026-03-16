export const getFocusableDropdownItems = (surface: HTMLElement): HTMLButtonElement[] =>
  Array.from(surface.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));

export const handleDropdownArrowNavigation = (
  event: KeyboardEvent,
  items: HTMLButtonElement[],
  currentIndex: number
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

export const focusFirstDropdownItem = (surface: HTMLElement): void => {
  const items = getFocusableDropdownItems(surface);
  items[0]?.focus();
};

export const focusLastDropdownItem = (surface: HTMLElement): void => {
  const items = getFocusableDropdownItems(surface);
  items[items.length - 1]?.focus();
};
