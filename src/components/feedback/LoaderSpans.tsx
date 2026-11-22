import { For } from 'solid-js';

import styles from './LoaderSpans.module.css';

export interface LoaderSpansProps {
  count: readonly unknown[];
}

export const LoaderSpans = (props: LoaderSpansProps) => (
  <For keyed={false} each={props.count}>
    {() => <span class={styles.part} />}
  </For>
);
