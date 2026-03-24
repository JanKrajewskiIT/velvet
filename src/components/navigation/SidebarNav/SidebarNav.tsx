import { For, type JSX, Show } from 'solid-js';

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
  title: JSX.Element;
  subtitle?: JSX.Element;
  actions?: JSX.Element;
  navLabel?: string;
}

const SidebarNav = (props: Props<SidebarNavProps>) => {
  const isActive = (id: string) => props.activeId === id;

  return (
    <nav class={classNames(styles.root, props.class)} aria-label={props.navLabel ?? 'Component categories'}>
      <div class={styles.brand}>
        <div class={styles.brandHeader}>
          <Heading level={3}>{props.title}</Heading>
          <Show when={props.actions}>{props.actions}</Show>
        </div>
        <Show when={props.subtitle}>
          <Text variant="bodySm" tone="muted">
            {props.subtitle}
          </Text>
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
