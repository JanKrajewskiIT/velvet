import { createSignal, createUniqueId, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import styles from './DropdownMenu.module.css';

interface DropdownMenuProps {
  trigger: JSX.Element;
  children: JSX.Element;
  label?: string;
}

function getMenuItems(menu: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    menu.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
  );
}

const DropdownMenu = (props: Props<DropdownMenuProps>) => {
  const [open, setOpen] = createSignal(false);
  const menuId = createUniqueId();
  let menuRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;
  let triggerRef: HTMLDivElement | undefined;

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
        break;
      }
    }
  };

  return (
    <div ref={menuRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <div
        ref={triggerRef}
        class={styles.trigger}
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
            return;
          }
          if (e.key === 'ArrowDown' && !open()) {
            e.preventDefault();
            openAndFocusFirst();
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open()}
        aria-controls={open() ? menuId : undefined}
        aria-label={props.label}
      >
        {props.trigger}
      </div>
      <Show when={open()}>
        <div
          ref={panelRef}
          id={menuId}
          class={styles.menu}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          onClick={() => {
            setOpen(false);
          }}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};

export default DropdownMenu;
