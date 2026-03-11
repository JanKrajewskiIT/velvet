import { IoChevronBack, IoChevronForward } from 'solid-icons/io';
import { createSignal, For, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Sidebar.module.css';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: JSX.Element;
  badge?: string | number;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  collapsed?: boolean;
  collapsible?: boolean;
  onToggle?: () => void;
  header?: JSX.Element;
}

interface SidebarItemRowProps {
  item: SidebarItem;
  activeId?: string;
  collapsed: boolean;
  onSelect?: (id: string) => void;
}

const SidebarItemRow = (props: SidebarItemRowProps) => {
  const [expanded, setExpanded] = createSignal(false);
  const hasChildren = () => props.item.children && props.item.children.length > 0;
  const isActive = () => props.activeId === props.item.id;

  const handleClick = () => {
    if (hasChildren()) {
      setExpanded((prev) => !prev);
    }
    props.onSelect?.(props.item.id);
  };

  return (
    <li>
      <button
        type="button"
        class={`${styles.item} ${isActive() ? styles.active : ''} ${props.collapsed ? styles.collapsedItem : ''}`}
        onClick={handleClick}
      >
        <Show when={props.item.icon}>
          <span class={styles.icon}>{props.item.icon}</span>
        </Show>
        <Show when={!props.collapsed}>
          <span class={styles.label}>{props.item.label}</span>
        </Show>
        <Show when={!props.collapsed && props.item.badge !== undefined}>
          <span class={styles.badge}>{props.item.badge}</span>
        </Show>
      </button>
      <Show when={hasChildren() && expanded() && !props.collapsed}>
        <ul class={styles.children}>
          <For each={props.item.children}>
            {(child) => (
              <SidebarItemRow
                item={child}
                activeId={props.activeId}
                collapsed={props.collapsed}
                onSelect={props.onSelect}
              />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
};

const Sidebar = (props: Props<SidebarProps>) => {
  const collapsed = () => props.collapsed ?? false;
  const collapsible = () => props.collapsible ?? true;

  return (
    <aside class={`${styles.sidebar} ${collapsed() ? styles.collapsed : styles.expanded} ${props.class ?? ''}`}>
      <Show when={props.header}>
        <div class={styles.header}>{props.header}</div>
      </Show>
      <nav class={styles.nav}>
        <ul>
          <For each={props.items}>
            {(item) => (
              <SidebarItemRow item={item} activeId={props.activeId} collapsed={collapsed()} onSelect={props.onSelect} />
            )}
          </For>
        </ul>
      </nav>
      <Show when={collapsible()}>
        <button type="button" class={styles.toggle} onClick={() => props.onToggle?.()}>
          <Show when={collapsed()} fallback={<IoChevronBack />}>
            <IoChevronForward />
          </Show>
        </button>
      </Show>
    </aside>
  );
};

export default Sidebar;
