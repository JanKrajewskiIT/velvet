import { For, type JSX, Show } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
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
  const isActive = (id: string) => props.activeId === id;

  return (
    <nav class={classNames(styles.root, props.class)} aria-label={props.navLabel ?? t('sidebar.componentCategories')}>
      <div class={styles.brand}>
        <Heading level={3}>{props.label}</Heading>
        <Show when={props.subtitle}>
          <Text variant="bodySm" tone="muted">
            {props.subtitle}
          </Text>
        </Show>
        <Show when={props.actions}>
          <div class={classNames(styles.brandActions, 'themeToggleBar')} data-sidebar-actions="true">
            {props.actions}
          </div>
        </Show>
      </div>

      <For each={props.groups}>
        {(group) => (
          <div class={styles.group}>
            <Text as="p" variant="overline" tone="tertiary">
              {group.label}
            </Text>
            <For each={group.items}>
              {(item) => (
                <Button
                  variant="ghost"
                  class={classNames(styles.item, isActive(item.id) && styles.itemActive)}
                  onClick={() => props.onSelect?.(item.id)}
                >
                  <Text variant="labelMd" tone="inherit" class={styles.itemLabel}>
                    {item.label}
                  </Text>
                </Button>
              )}
            </For>
          </div>
        )}
      </For>
    </nav>
  );
};

export default SidebarNav;
