import { createSignal, For, type JSX, Show } from 'solid-js';
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

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`} onContextMenu={handleContextMenu}>
      {props.children}
      <Show when={visible()}>
        <Portal>
          <div
            ref={menuRef}
            class={styles.menu}
            style={{
              top: `${position().y}px`,
              left: `${position().x}px`,
              'transform-origin': '0 0',
            }}
          >
            <For each={props.items}>
              {(item) => (
                <Show when={item !== 'separator'} fallback={<div class={styles.separator} />}>
                  <button
                    class={`${styles.item} ${(item as ContextMenuItem).danger ? styles.danger : ''} ${(item as ContextMenuItem).disabled ? styles.disabled : ''}`}
                    onClick={() => handleItemClick(item as ContextMenuItem)}
                    disabled={(item as ContextMenuItem).disabled}
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
