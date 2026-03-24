import { createSignal, For, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { SidebarItem } from '../Sidebar/Sidebar';
import SidebarItemButton from '../SidebarItemButton/SidebarItemButton';
import styles from './SidebarItemRow.module.css';

interface SidebarItemRowProps {
  item: SidebarItem;
  activeId?: string;
  collapsed: boolean;
  depth: number;
  forceExpanded: boolean;
  onSelect?: (id: string) => void;
}

const SidebarItemRow = (props: Props<SidebarItemRowProps>) => {
  const [expanded, setExpanded] = createSignal(false);
  const hasChildren = () => props.item.children && props.item.children.length > 0;
  const isActive = () => props.activeId === props.item.id;
  const isExpanded = () => props.forceExpanded || expanded();
  const nestedPadding = () => ({
    'padding-left': `calc(var(--spacing-sm) + (${String(props.depth)} * var(--spacing-sm)))`,
  });

  const handleClick = () => {
    if (hasChildren()) {
      setExpanded((prev) => !prev);
    }
    props.onSelect?.(props.item.id);
  };

  return (
    <li class={classNames(styles.itemRow, props.class)}>
      <SidebarItemButton
        label={props.item.label}
        prefix={props.item.icon}
        badge={props.item.badge}
        hasChildren={hasChildren()}
        expanded={isExpanded()}
        active={isActive()}
        collapsed={props.collapsed}
        onClick={handleClick}
        style={props.collapsed ? undefined : nestedPadding()}
      />
      <Show when={hasChildren() && isExpanded() && !props.collapsed}>
        <ul class={styles.children}>
          <For each={props.item.children}>
            {(child) => (
              <SidebarItemRow
                item={child}
                activeId={props.activeId}
                collapsed={props.collapsed}
                depth={props.depth + 1}
                forceExpanded={props.forceExpanded}
                onSelect={props.onSelect}
              />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
};

export default SidebarItemRow;
