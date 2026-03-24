import { IoChevronBack, IoChevronForward } from 'solid-icons/io';
import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import IconButton from '../../buttons/IconButton/IconButton';
import EmptyState from '../../feedback/EmptyState/EmptyState';
import SearchInput from '../../inputs/SearchInput/SearchInput';
import Checkbox from '../../switchers/Checkbox/Checkbox';
import Heading from '../../typography/Heading/Heading';
import SidebarItemRow from '../SidebarItemRow/SidebarItemRow';
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
  searchPlaceholder?: string;
  badgeFilterLabel?: string;
  emptyLabel?: string;
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

const Sidebar = (props: Props<SidebarProps>) => {
  const [query, setQuery] = createSignal('');
  const [onlyBadged, setOnlyBadged] = createSignal(false);
  const collapsed = () => props.collapsed ?? false;
  const collapsible = () => props.collapsible ?? true;
  const forceExpanded = () => query().trim().length > 0;
  const filteredItems = createMemo(() => filterSidebarItems(props.items, query(), onlyBadged()));
  const isEmpty = createMemo(() => filteredItems().length === 0);

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
            <Heading as="p" level={4}>
              {props.header}
            </Heading>
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
            />
          </Show>
        </div>
      </Show>
      <Show when={!collapsed()}>
        <div class={styles.tools}>
          <SearchInput value={query()} onInput={setQuery} placeholder={props.searchPlaceholder ?? 'Search items...'} />
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
          <EmptyState
            class={styles.emptyState}
            message={props.emptyLabel ?? 'No matching items found.'}
            hint={query().trim().length > 0 ? 'Try a broader search term.' : undefined}
          />
        </Show>
      </nav>
    </aside>
  );
};

export default Sidebar;
