import type { JSX } from 'solid-js';
import { For, Show } from 'solid-js';

import type Props from '~/models/Props';

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
}

const BottomNav = (props: Props<BottomNavProps>) => {
  return (
    <nav class={`${styles.bar} ${props.class ?? ''}`}>
      <For each={props.items}>
        {(item) => (
          <button
            type="button"
            class={`${styles.item} ${props.activeId === item.id ? styles.active : ''}`}
            onClick={() => props.onChange(item.id)}
          >
            <span class={styles.icon}>
              {item.icon}
              <Show when={item.badge !== undefined}>
                <span class={styles.badge}>{item.badge}</span>
              </Show>
            </span>
            <span class={styles.label}>{item.label}</span>
          </button>
        )}
      </For>
    </nav>
  );
};

export default BottomNav;
