import type { JSX } from 'solid-js';
import { For, Show } from 'solid-js';

import type Props from '~/models/Props';

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
    <nav class={`${barClass()} ${props.class ?? ''}`}>
      <For each={props.items}>
        {(item) => (
          <Button
            class={`${styles.item} ${props.activeId === item.id ? styles.active : ''}`}
            variant="subtle"
            size="md"
            onClick={() => props.onChange(item.id)}
          >
            <span class={styles.icon}>
              {item.icon}
              <Show when={item.badge !== undefined}>
                <span class={styles.badge}>{item.badge}</span>
              </Show>
            </span>
            <span class={styles.label}>{item.label}</span>
          </Button>
        )}
      </For>
    </nav>
  );
};

export default BottomNav;
