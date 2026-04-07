import type { JSX } from 'solid-js';
import { For } from 'solid-js';

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
  const placement = () => props.placement ?? 'viewport';
  const barClass = () => (placement() === 'container' ? styles.barContainer : styles.barViewport);

  return (
    <nav class={classNames(styles.bar, barClass(), props.class)}>
      <For each={props.items}>
        {(item) => (
          <Button
            class={classNames(styles.item, props.activeId === item.id && styles.active)}
            variant="subtle"
            size="md"
            onClick={() => props.onChange(item.id)}
          >
            <span class={styles.iconWrap}>
              <Badge content={item.badge} variant="error">
                <span class={styles.icon}>{item.icon}</span>
              </Badge>
            </span>
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
