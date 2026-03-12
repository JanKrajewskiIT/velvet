import { createEffect, createSignal, For, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import type Props from '~/models/Props';

import useClickOutside from '../../../hooks/useClickOutside';
import useEscapeKey from '../../../hooks/useEscapeKey';
import styles from './ContextMenu.module.css';

interface ContextMenuItem {
  label: string;
  icon?: JSX.Element;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  children: JSX.Element;
  items: Array<ContextMenuItem | 'separator'>;
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
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  const handleItemClick = (item: ContextMenuItem) => {
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

  createEffect(() => {
    if (!visible()) return;
    requestAnimationFrame(() => {
      focusItemAt(0);
    });
  });

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`} onContextMenu={handleContextMenu}>
      {props.children}
      <Show when={visible()}>
        <Portal>
          <div
            ref={menuRef}
            class={styles.menu}
            role="menu"
            tabIndex={-1}
            aria-orientation="vertical"
            style={{
              top: `${position().y}px`,
              left: `${position().x}px`,
              'transform-origin': '0 0',
            }}
            onKeyDown={handleMenuKeyDown}
          >
            <For each={props.items}>
              {(item) => (
                <Show when={item !== 'separator'} fallback={<div class={styles.separator} role="separator" />}>
                  <button
                    class={`${styles.item} ${(item as ContextMenuItem).danger ? styles.danger : ''} ${(item as ContextMenuItem).disabled ? styles.disabled : ''}`}
                    onClick={() => handleItemClick(item as ContextMenuItem)}
                    disabled={(item as ContextMenuItem).disabled}
                    role="menuitem"
                  >
                    <Show when={(item as ContextMenuItem).icon}>
                      <span class={styles.icon}>{(item as ContextMenuItem).icon}</span>
                    </Show>
                    <span>{(item as ContextMenuItem).label}</span>
                  </button>
                </Show>
              )}
            </For>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

export default ContextMenu;
