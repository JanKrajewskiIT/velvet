import { For, type JSX, Show, splitProps } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import SidebarItemButton from '../Sidebar/SidebarItemButton/SidebarItemButton';
import styles from './SidebarNav.module.css';

export interface SidebarNavItem {
  id: string;
  label: string;
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

interface SidebarNavProps {
  groups: SidebarNavGroup[];
  activeId?: string;
  onSelect?: (id: string) => void;
  label: string;
  subtitle?: string;
  actions?: JSX.Element;
  navLabel?: string;
}

const SidebarNav = (props: Props<SidebarNavProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, [
    'class',
    'groups',
    'activeId',
    'onSelect',
    'label',
    'subtitle',
    'actions',
    'navLabel',
  ]);
  const isActive = (id: string) => local.activeId === id;

  return (
    <nav {...rest} class={classNames(styles.root, local.class)} aria-label={local.navLabel ?? t('sidebar.navigation')}>
      <div class={styles.brand}>
        <Heading level={3}>{local.label}</Heading>
        <Show when={local.subtitle}>
          <Text variant="bodySm" tone="muted">
            {local.subtitle}
          </Text>
        </Show>
        <Show when={local.actions}>
          <div class={classNames(styles.brandActions, 'themeToggleBar')} data-sidebar-actions="true">
            {local.actions}
          </div>
        </Show>
      </div>

      <For each={local.groups}>
        {(group) => (
          <section class={styles.group} aria-label={group.label}>
            <Text as="p" variant="overline" tone="tertiary">
              {group.label}
            </Text>
            <ul class={styles.groupList}>
              <For each={group.items}>
                {(item) => (
                  <li class={styles.groupListItem}>
                    <SidebarItemButton
                      label={item.label}
                      active={isActive(item.id)}
                      aria-current={isActive(item.id) ? 'page' : undefined}
                      onClick={() => local.onSelect?.(item.id)}
                      class={classNames(styles.item, isActive(item.id) && styles.itemActive)}
                    />
                  </li>
                )}
              </For>
            </ul>
          </section>
        )}
      </For>
    </nav>
  );
};

export default SidebarNav;
