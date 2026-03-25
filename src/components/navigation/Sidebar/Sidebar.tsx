import { IoChevronBack, IoChevronForward } from 'solid-icons/io';
import { createMemo, createSignal, For, type JSX, Show } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
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
  const { t } = useI18n();
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
              label={collapsed() ? t('sidebar.expand') : t('sidebar.collapse')}
              onClick={() => props.onToggle?.()}
            />
          </Show>
        </div>
      </Show>
      <Show when={!collapsed()}>
        <div class={styles.tools}>
          <SearchInput
            value={query()}
            onInput={setQuery}
            placeholder={props.searchPlaceholder ?? t('sidebar.searchItems')}
          />
          <div class={styles.toolsRow}>
            <Checkbox
              checked={onlyBadged()}
              onInput={handleBadgeFilterToggle}
              label={props.badgeFilterLabel ?? t('sidebar.onlyBadges')}
            />
            <Button variant="dashed" onClick={clearFilters} disabled={query().length === 0 && !onlyBadged()}>
              {t('common.clear')}
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
            message={props.emptyLabel ?? t('sidebar.noMatches')}
            hint={query().trim().length > 0 ? t('sidebar.broaderHint') : undefined}
          />
        </Show>
      </nav>
    </aside>
  );
};

export default Sidebar;
