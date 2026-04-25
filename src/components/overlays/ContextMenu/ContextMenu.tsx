import { batch, createEffect, createSignal, For, type JSX, on, onCleanup, Show } from 'solid-js';

import Floating from '~/components/overlays/Floating/Floating';
import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import type { Rect, VirtualElement } from '~/utils/floating/types';

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

const createPointVirtualElement = (x: number, y: number): VirtualElement => ({
  getBoundingClientRect: (): Rect => ({ x, y, width: 0, height: 0 }),
});

const ContextMenu = (props: Props<ContextMenuProps>) => {
  const [visible, setVisible] = createSignal(false);
  const [virtualEl, setVirtualEl] = createSignal<VirtualElement | undefined>(undefined);
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement | undefined>(undefined);
  const [floatingEl, setFloatingEl] = createSignal<HTMLDivElement | undefined>(undefined);

  const close = (): void => {
    setVisible(false);
  };

  useClickOutside(menuRef, visible, close, floatingEl);
  useEscapeKey(visible, close);

  const handleContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    batch(() => {
      setVirtualEl(createPointVirtualElement(e.clientX, e.clientY));
      setVisible(true);
    });
  };

  const handleItemClick = (item: ContextMenuOption): void => {
    if (item.disabled) return;
    close();
    item.onClick();
  };

  const getMenuItems = (): HTMLButtonElement[] => {
    const root = menuRef();
    return root ? Array.from(root.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not(:disabled)')) : [];
  };

  const focusItemAt = (index: number): void => {
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
        <Floating anchor={virtualEl} open={visible()} placement="bottom-start" padding={8} ref={setFloatingEl}>
          <DropdownSurface
            ref={setMenuRef}
            class={styles.menu}
            panel={false}
            scrollable={false}
            role="menu"
            tabIndex={-1}
            aria-orientation="vertical"
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
        </Floating>
      </Show>
    </div>
  );
};

export default ContextMenu;
