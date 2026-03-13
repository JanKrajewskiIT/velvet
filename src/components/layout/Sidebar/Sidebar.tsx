import { IoChevronBack, IoChevronDown, IoChevronForward, IoSearch } from 'solid-icons/io';
import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../inputs/Button/Button';
import Checkbox from '../../inputs/Checkbox/Checkbox';
import IconButton from '../../inputs/IconButton/IconButton';
import Input from '../../inputs/Input/Input';
import styles from './Sidebar.module.css';
import SidebarItemButton from './SidebarItemButton';

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
  searchPlaceholder?: string;
  badgeFilterLabel?: string;
  emptyLabel?: string;
}

interface SidebarItemRowProps {
  item: SidebarItem;
  activeId?: string;
  collapsed: boolean;
  depth: number;
  forceExpanded: boolean;
  onSelect?: (id: string) => void;
}

const hasBadge = (item: SidebarItem) => item.badge !== undefined;

const filterSidebarItems = (items: SidebarItem[], query: string, onlyBadged: boolean): SidebarItem[] => {
  const normalizedQuery = query.trim().toLowerCase();

  return items
    .map((item) => {
      const filteredChildren = item.children ? filterSidebarItems(item.children, query, onlyBadged) : undefined;
      const matchesQuery = normalizedQuery.length === 0 || item.label.toLowerCase().includes(normalizedQuery);
      const matchesBadge = !onlyBadged || hasBadge(item);
      const includeItem =
        (matchesQuery && matchesBadge) || (filteredChildren !== undefined && filteredChildren.length > 0);

      if (!includeItem) {
        return null;
      }

      if (filteredChildren === undefined) {
        return item;
      }

      return {
        ...item,
        children: filteredChildren,
      };
    })
    .filter((item): item is SidebarItem => item !== null);
};

const SidebarItemRow = (props: SidebarItemRowProps) => {
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
    <li class={styles.itemRow}>
      <SidebarItemButton
        label={props.item.label}
        prefix={props.item.icon}
        badge={props.item.badge}
        suffix={
          hasChildren() ? (
            <Show when={isExpanded()} fallback={<IoChevronForward />}>
              <IoChevronDown />
            </Show>
          ) : undefined
        }
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

const Sidebar = (props: Props<SidebarProps>) => {
  const [query, setQuery] = createSignal('');
  const [onlyBadged, setOnlyBadged] = createSignal(false);
  const collapsed = () => props.collapsed ?? false;
  const collapsible = () => props.collapsible ?? true;
  const forceExpanded = () => query().trim().length > 0;
  const filteredItems = createMemo(() => filterSidebarItems(props.items, query(), onlyBadged()));
  const isEmpty = createMemo(() => filteredItems().length === 0);

  const handleQueryInput = (e: InputEvent) => {
    setQuery((e.currentTarget as HTMLInputElement).value);
  };

  const handleBadgeFilterToggle = (e: InputEvent) => {
    setOnlyBadged((e.currentTarget as HTMLInputElement).checked);
  };

  const clearFilters = () => {
    setQuery('');
    setOnlyBadged(false);
  };

  return (
    <aside class={classNames(styles.sidebar, collapsed() ? styles.collapsed : styles.expanded, props.class)}>
      <Show when={props.header || collapsible()}>
        <div class={classNames(styles.headerRow, collapsed() && styles.headerRowCollapsed)}>
          <Show when={!collapsed()}>
            <div class={styles.header}>{props.header}</div>
          </Show>
          <Show when={collapsible()}>
            <IconButton
              icon={
                <Show when={collapsed()} fallback={<IoChevronBack />}>
                  <IoChevronForward />
                </Show>
              }
              title={collapsed() ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => props.onToggle?.()}
              class={styles.headerToggle}
            />
          </Show>
        </div>
      </Show>
      <Show when={!collapsed()}>
        <div class={styles.tools}>
          <div class={styles.searchWrapper}>
            <IoSearch class={styles.searchIcon} />
            <Input
              value={query()}
              onInput={handleQueryInput}
              placeholder={props.searchPlaceholder ?? 'Search items...'}
              class={styles.searchInput}
            />
          </div>
          <div class={styles.toolsRow}>
            <Checkbox
              checked={onlyBadged()}
              onInput={handleBadgeFilterToggle}
              label={props.badgeFilterLabel ?? 'Only with badges'}
            />
            <Button variant="dashed" onClick={clearFilters} disabled={query().length === 0 && !onlyBadged()}>
              Clear
            </Button>
          </div>
        </div>
      </Show>
      <nav class={styles.nav}>
        <ul>
          <For each={filteredItems()}>
            {(item) => (
              <SidebarItemRow
                item={item}
                activeId={props.activeId}
                collapsed={collapsed()}
                depth={0}
                forceExpanded={forceExpanded()}
                onSelect={props.onSelect}
              />
            )}
          </For>
        </ul>
        <Show when={isEmpty()}>
          <div class={styles.emptyState}>{props.emptyLabel ?? 'No matching items found.'}</div>
        </Show>
      </nav>
    </aside>
  );
};

export default Sidebar;
