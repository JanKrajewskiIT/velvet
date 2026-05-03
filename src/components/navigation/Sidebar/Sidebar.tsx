import { IoChevronBack, IoChevronForward } from 'solid-icons/io';
import { createMemo, createSignal, For, type JSX, Show, splitProps } from 'solid-js';

import { useI18n } from '~/i18n';
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
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, [
    'items',
    'activeId',
    'onSelect',
    'collapsed',
    'collapsible',
    'onToggle',
    'header',
    'class',
  ]);
  const [query, setQuery] = createSignal('');
  const [onlyBadged, setOnlyBadged] = createSignal(false);
  const collapsed = createMemo(() => local.collapsed ?? false);
  const collapsible = createMemo(() => local.collapsible ?? true);
  const forceExpanded = () => query().trim().length > 0;
  const filteredItems = createMemo(() => filterSidebarItems(local.items, query(), onlyBadged()));
  const isEmpty = createMemo(() => filteredItems().length === 0);

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
              label={collapsed() ? ts('sidebar.expand') : ts('sidebar.collapse')}
              onClick={local.onToggle}
            />
          </Show>
        </div>
      </Show>
      <Show when={!collapsed()}>
        <div class={styles.tools}>
          <SearchInput value={query()} onInput={setQuery} placeholder={ts('sidebar.searchItems')} />
          <div class={styles.toolsRow}>
            <Checkbox checked={onlyBadged()} onInput={handleBadgeFilterToggle} label={ts('sidebar.onlyBadges')} />
            <Button variant="dashed" onClick={clearFilters} disabled={query().length === 0 && !onlyBadged()}>
              {ts('common.clear')}
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
            message={ts('sidebar.noMatches')}
            hint={query().trim().length > 0 ? ts('sidebar.broaderHint') : undefined}
          />
        </Show>
      </nav>
    </aside>
  );
};

export default Sidebar;
