import { createUniqueId, type JSX, Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownSurface from '../DropdownSurface/DropdownSurface';
import {
  createDropdownSurfaceKeyDownHandler,
  focusDropdownItem,
  getDropdownOpenTarget,
} from '../shared/dropdownKeyboard';
import useDropdownState from '../shared/useDropdownState';
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

  const openAndFocus = (target: 'first' | 'last') => {
    dropdown.openDropdown();
    requestAnimationFrame(() => {
      if (!panelRef) return;
      focusDropdownItem(panelRef, target);
    });
  };

  const toggle = () => {
    if (dropdown.open()) {
      dropdown.close();
      return;
    }
    openAndFocus('first');
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (dropdown.open()) return;

    const target = getDropdownOpenTarget(e);
    if (!target) return;

    openAndFocus(target);
  };

  const handleMenuKeyDown = createDropdownSurfaceKeyDownHandler({
    getSurface: () => panelRef,
    closeDropdown: dropdown.close,
    focusTrigger: () => triggerRef?.focus(),
    focusTriggerOnTab: true,
  });

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
        <DropdownSurface
          ref={panelRef}
          id={menuId}
          class={styles.menu}
          align="left"
          origin="topLeft"
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          onClick={dropdown.close}
        >
          {props.children}
        </DropdownSurface>
      </Show>
    </div>
  );
};

export default DropdownMenu;
