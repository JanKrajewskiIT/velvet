import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: JSX.Element;
  message: string;
  hint?: string;
  children?: JSX.Element;
}

const EmptyState = (props: Props<EmptyStateProps>) => {
  return (
    <div class={`${styles.empty} ${props.class ?? ''}`}>
      <Show when={props.icon}>
        <div class={styles.icon}>{props.icon}</div>
      </Show>
      <p class={styles.message}>{props.message}</p>
      <Show when={props.hint}>
        <p class={styles.hint}>{props.hint}</p>
      </Show>
      <Show when={props.children}>
        <div class={styles.content}>{props.children}</div>
      </Show>
    </div>
  );
};

export default EmptyState;
