import { createUniqueId, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import IconButton from '../../buttons/IconButton/IconButton';
import {
  focusFirstDropdownItem,
  getFocusableDropdownItems,
  handleDropdownArrowNavigation,
} from '../DropdownBase/dropdownKeyboard';
import useDropdownState from '../DropdownBase/useDropdownState';
import styles from './DropdownMenu.module.css';

interface DropdownMenuProps {
  trigger: JSX.Element;
  children: JSX.Element;
  label?: string;
}

const DropdownMenu = (props: Props<DropdownMenuProps>) => {
  const menuId = createUniqueId();
  let menuRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;
  const dropdown = useDropdownState(() => menuRef);

  const openAndFocusFirst = () => {
    dropdown.openDropdown();
    requestAnimationFrame(() => {
      if (panelRef) focusFirstDropdownItem(panelRef);
    });
  };

  const toggle = () => {
    if (dropdown.open()) {
      dropdown.close();
      return;
    }
    openAndFocusFirst();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' && !dropdown.open()) {
      e.preventDefault();
      openAndFocusFirst();
    }
  };

  const handleMenuKeyDown = (e: KeyboardEvent) => {
    if (!panelRef) return;
    const items = getFocusableDropdownItems(panelRef);
    const current = document.activeElement as HTMLElement;
    const index = items.indexOf(current as HTMLButtonElement);

    if (handleDropdownArrowNavigation(e, items, index)) {
      return;
    }

    switch (e.key) {
      case 'Escape': {
        e.preventDefault();
        dropdown.close();
        triggerRef?.focus();
        break;
      }
      case 'Tab': {
        dropdown.close();
        triggerRef?.focus();
        break;
      }
    }
  };

  return (
    <div ref={menuRef} class={classNames(styles.wrapper, props.class)}>
      <IconButton
        ref={triggerRef}
        icon={props.trigger}
        title={props.label ?? 'Open menu'}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={dropdown.open()}
        aria-controls={dropdown.open() ? menuId : undefined}
        variant="subtle"
        size="sm"
      />
      <Show when={dropdown.open()}>
        <div
          ref={panelRef}
          id={menuId}
          class={styles.menu}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          onClick={dropdown.close}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};

export default DropdownMenu;
