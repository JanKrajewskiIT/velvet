import type { JSX } from 'solid-js';
import { createMemo, For, splitProps } from 'solid-js';

import Badge from '~/components/feedback/Badge/Badge';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import styles from './BottomNav.module.css';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: JSX.Element;
  badge?: number;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  placement?: 'viewport' | 'container';
}

const BottomNav = (props: Props<BottomNavProps>) => {
  const [local, rest] = splitProps(props, ['items', 'activeId', 'onChange', 'placement', 'class']);
  const placement = createMemo(() => local.placement ?? 'viewport');
  const barClass = createMemo(() => (placement() === 'container' ? styles.barContainer : styles.barViewport));

  return (
    <nav {...rest} class={classNames(styles.bar, barClass(), local.class)}>
      <For each={local.items}>
        {(item) => (
          <Button
            class={classNames(styles.item, local.activeId === item.id && styles.active)}
            variant="subtle"
            size="md"
            onClick={() => local.onChange(item.id)}
          >
            <Badge class={styles.iconWrap} content={item.badge} variant="error">
              <span class={styles.icon}>{item.icon}</span>
            </Badge>
            <Text as="span" variant="caption" tone="inherit" class={styles.label}>
              {item.label}
            </Text>
          </Button>
        )}
      </For>
    </nav>
  );
};

export default BottomNav;
