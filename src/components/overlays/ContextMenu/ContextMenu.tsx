import { batch, createEffect, createSignal, For, type JSX, on, onCleanup, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownDivider from '../../dropdowns/Dropdown/DropdownDivider/DropdownDivider';
import DropdownOption from '../../dropdowns/Dropdown/DropdownOption/DropdownOption';
import DropdownSurface from '../../dropdowns/Dropdown/DropdownSurface/DropdownSurface';
import styles from './ContextMenu.module.css';

interface ContextMenuOption {
  label: string;
  icon?: JSX.Element;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  children: JSX.Element;
  items: Array<ContextMenuOption | 'separator'>;
}

const ContextMenu = (props: Props<ContextMenuProps>) => {
  const [visible, setVisible] = createSignal(false);
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  let menuRef: HTMLDivElement | undefined;

  const close = () => setVisible(false);

  useClickOutside(() => menuRef, visible, close);

  useEscapeKey(visible, close);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    batch(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    });
  };

  const handleItemClick = (item: ContextMenuOption) => {
    if (item.disabled) return;
    close();
    item.onClick();
  };

  const getMenuItems = (): HTMLButtonElement[] =>
    menuRef ? Array.from(menuRef.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not(:disabled)')) : [];

  const focusItemAt = (index: number) => {
    const items = getMenuItems();
    if (items.length === 0) return;
    const clampedIndex = (index + items.length) % items.length;
    items[clampedIndex]?.focus();
  };

  const handleMenuKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    const items = getMenuItems();
    if (items.length === 0) return;
    const current = document.activeElement as HTMLButtonElement | null;
    const currentIndex = current ? items.indexOf(current) : -1;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        focusItemAt(currentIndex + 1);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        focusItemAt(currentIndex - 1);
        break;
      }
      case 'Home': {
        e.preventDefault();
        focusItemAt(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        focusItemAt(items.length - 1);
        break;
      }
      case 'Escape': {
        e.preventDefault();
        close();
        break;
      }
    }
  };

  createEffect(
    on(
      visible,
      (isVisible) => {
        if (!isVisible) return;
        const rafId = requestAnimationFrame(() => {
          focusItemAt(0);
        });
        onCleanup(() => cancelAnimationFrame(rafId));
      },
      { defer: true },
    ),
  );

  return (
    <div class={classNames(styles.wrapper, props.class)} onContextMenu={handleContextMenu}>
      {props.children}
      <Show when={visible()}>
        <Portal>
          <DropdownSurface
            ref={menuRef}
            class={styles.menu}
            panel={false}
            scrollable={false}
            role="menu"
            tabIndex={-1}
            aria-orientation="vertical"
            style={{
              '--context-menu-top': `${position().y}px`,
              '--context-menu-left': `${position().x}px`,
            }}
            onKeyDown={handleMenuKeyDown}
          >
            <For each={props.items}>
              {(item) =>
                item === 'separator' ? (
                  <DropdownDivider />
                ) : (
                  <DropdownOption
                    class={classNames(styles.item, item.disabled && styles.disabled)}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    role="menuitem"
                    tone={item.danger ? 'error' : 'default'}
                    prefix={item.icon ? <span class={styles.icon}>{item.icon}</span> : undefined}
                    label={item.label}
                  />
                )
              }
            </For>
          </DropdownSurface>
        </Portal>
      </Show>
    </div>
  );
};

export default ContextMenu;
