import { createSignal, createUniqueId, type JSX, Show } from 'solid-js';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';

import styles from './DropdownMenu.module.css';

interface DropdownMenuProps {
  trigger: JSX.Element;
  children: JSX.Element;
  label?: string;
}

const getMenuItems = (menu: HTMLElement): HTMLButtonElement[] =>
  Array.from(menu.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));

const DropdownMenu = (props: Props<DropdownMenuProps>) => {
  const [open, setOpen] = createSignal(false);
  const menuId = createUniqueId();
  let menuRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  let triggerRef: HTMLButtonElement | undefined;

  const close = (): void => {
    setOpen(false);
  };

  useEscapeKey(() => open(), close);
  useClickOutside(
    () => menuRef,
    () => open(),
    close
  );

  const openAndFocusFirst = () => {
    setOpen(true);
    requestAnimationFrame(() => {
      if (panelRef) {
        const items = getMenuItems(panelRef);
        items[0]?.focus();
      }
    });
  };

  const toggle = () => {
    if (open()) {
      close();
      return;
    }
    openAndFocusFirst();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' && !open()) {
      e.preventDefault();
      openAndFocusFirst();
    }
  };

  const handleMenuKeyDown = (e: KeyboardEvent) => {
    if (!panelRef) return;
    const items = getMenuItems(panelRef);
    const current = document.activeElement as HTMLElement;
    const index = items.indexOf(current as HTMLButtonElement);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = index < items.length - 1 ? index + 1 : 0;
        items[next]?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = index > 0 ? index - 1 : items.length - 1;
        items[prev]?.focus();
        break;
      }
      case 'Home': {
        e.preventDefault();
        items[0]?.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      }
      case 'Escape': {
        e.preventDefault();
        close();
        triggerRef?.focus();
        break;
      }
      case 'Tab': {
        close();
        triggerRef?.focus();
        break;
      }
    }
  };

  return (
    <div ref={menuRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <button
        type="button"
        ref={triggerRef}
        class={styles.trigger}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open()}
        aria-controls={open() ? menuId : undefined}
        aria-label={props.label}
      >
        {props.trigger}
      </button>
      <Show when={open()}>
        <div
          ref={panelRef}
          id={menuId}
          class={styles.menu}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          onClick={close}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};

export default DropdownMenu;
