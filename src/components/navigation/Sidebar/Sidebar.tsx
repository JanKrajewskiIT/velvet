import { IoChevronBack, IoChevronForward } from 'solid-icons/io';
import { createMemo, createSignal, For, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import IconButton from '../../buttons/IconButton/IconButton';
import EmptyState from '../../feedback/EmptyState/EmptyState';
import SearchInput from '../../inputs/SearchInput/SearchInput';
import Checkbox from '../../switchers/Checkbox/Checkbox';
import Heading from '../../typography/Heading/Heading';
import styles from './Sidebar.module.css';
import SidebarItemRow from './SidebarItemRow/SidebarItemRow';

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
  broaderHint?: string;
  expandLabel?: string;
  collapseLabel?: string;
  clearLabel?: string;
}

const hasBadge = (item: SidebarItem) => item.badge !== undefined;
const DEFAULT_SIDEBAR_EXPAND_LABEL = 'Expand sidebar';
const DEFAULT_SIDEBAR_COLLAPSE_LABEL = 'Collapse sidebar';
const DEFAULT_SIDEBAR_SEARCH_PLACEHOLDER = 'Search items';
const DEFAULT_SIDEBAR_BADGE_FILTER_LABEL = 'Only items with badges';
const DEFAULT_SIDEBAR_CLEAR_LABEL = 'Clear';
const DEFAULT_SIDEBAR_EMPTY_LABEL = 'No matches';
const DEFAULT_SIDEBAR_BROADER_HINT = 'Try a broader search';

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
  const [local, rest] = splitProps(props, [
    'items',
    'activeId',
    'onSelect',
    'collapsed',
    'collapsible',
    'onToggle',
    'header',
    'searchPlaceholder',
    'badgeFilterLabel',
    'emptyLabel',
    'broaderHint',
    'expandLabel',
    'collapseLabel',
    'clearLabel',
    'class',
  ]);
  const [query, setQuery] = createSignal('');
  const [onlyBadged, setOnlyBadged] = createSignal(false);
  const collapsed = createMemo(() => local.collapsed ?? false);
  const collapsible = createMemo(() => local.collapsible ?? true);
  const forceExpanded = () => query().trim().length > 0;
  const filteredItems = createMemo(() => filterSidebarItems(local.items, query(), onlyBadged()));
  const isEmpty = createMemo(() => filteredItems().length === 0);
  const expandLabel = createMemo(() => local.expandLabel ?? DEFAULT_SIDEBAR_EXPAND_LABEL);
  const collapseLabel = createMemo(() => local.collapseLabel ?? DEFAULT_SIDEBAR_COLLAPSE_LABEL);
  const searchPlaceholder = createMemo(() => local.searchPlaceholder ?? DEFAULT_SIDEBAR_SEARCH_PLACEHOLDER);
  const badgeFilterLabel = createMemo(() => local.badgeFilterLabel ?? DEFAULT_SIDEBAR_BADGE_FILTER_LABEL);
  const clearLabel = createMemo(() => local.clearLabel ?? DEFAULT_SIDEBAR_CLEAR_LABEL);
  const emptyLabel = createMemo(() => local.emptyLabel ?? DEFAULT_SIDEBAR_EMPTY_LABEL);
  const broaderHint = createMemo(() => local.broaderHint ?? DEFAULT_SIDEBAR_BROADER_HINT);

  const handleBadgeFilterToggle = (e: InputEvent) => {
    setOnlyBadged((e.currentTarget as HTMLInputElement).checked);
  };

  const clearFilters = () => {
    setQuery('');
    setOnlyBadged(false);
  };

  return (
    <aside {...rest} class={classNames(styles.sidebar, collapsed() ? styles.collapsed : styles.expanded, local.class)}>
      <Show when={local.header || collapsible()}>
        <div class={classNames(styles.headerRow, collapsed() && styles.headerRowCollapsed)}>
          <Show when={!collapsed()}>
            <Heading as="p" level={4}>
              {local.header}
            </Heading>
          </Show>
          <Show when={collapsible() && local.onToggle}>
            <IconButton
              icon={
                <Show when={collapsed()} fallback={<IoChevronBack />}>
                  <IoChevronForward />
                </Show>
              }
              label={collapsed() ? expandLabel() : collapseLabel()}
              onClick={local.onToggle}
            />
          </Show>
        </div>
      </Show>
      <Show when={!collapsed()}>
        <div class={styles.tools}>
          <SearchInput value={query()} onInput={setQuery} placeholder={searchPlaceholder()} />
          <div class={styles.toolsRow}>
            <Checkbox checked={onlyBadged()} onInput={handleBadgeFilterToggle} label={badgeFilterLabel()} />
            <Button variant="dashed" onClick={clearFilters} disabled={query().length === 0 && !onlyBadged()}>
              {clearLabel()}
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
                activeId={local.activeId}
                collapsed={collapsed()}
                depth={0}
                forceExpanded={forceExpanded()}
                onSelect={local.onSelect}
              />
            )}
          </For>
        </ul>
        <Show when={isEmpty()}>
          <EmptyState
            class={styles.emptyState}
            message={emptyLabel()}
            hint={query().trim().length > 0 ? broaderHint() : undefined}
          />
        </Show>
      </nav>
    </aside>
  );
};

export default Sidebar;
