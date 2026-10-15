import { For } from 'solid-js';

import styles from './ThemeSunRings.module.css';

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;

export const ThemeSunRings = () => (
  <svg class={styles.root} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4.7" />
    <For each={RAY_ANGLES}>
      {(angle) => <rect x="11.1" y="1.3" width="1.8" height="3.4" rx="0.9" transform={`rotate(${angle} 12 12)`} />}
    </For>
  </svg>
);
