import { createSignal, type JSX, Show } from 'solid-js';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import type Props from '../../../models/Props';
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
  let menuRef: HTMLDivElement | undefined;
  let panelRef: HTMLDivElement | undefined;

  const close = (): void => {
    setOpen(false);
  };

  useEscapeKey(() => open(), close);
  useClickOutside(
    () => menuRef,
    () => open(),
    close
  );

  const toggle = () => {
    const wasOpen = open();
    setOpen(!wasOpen);
    if (!wasOpen) {
      requestAnimationFrame(() => {
        if (panelRef) {
          const items = getMenuItems(panelRef);
          items[0]?.focus();
        }
      });
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
      case 'Tab': {
        close();
        break;
      }
    }
  };

  return (
    <div ref={menuRef} class={`${styles.wrapper} ${props.class ?? ''}`}>
      <button
        type="button"
        class={styles.trigger}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open()}
        aria-label={props.label}
      >
        {props.trigger}
      </button>
      <Show when={open()}>
        <div
          ref={panelRef}
          class={styles.menu}
          role="menu"
          tabindex={-1}
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
