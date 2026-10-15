import { Index } from 'solid-js';

import styles from './LoaderSpans.module.css';

export interface LoaderSpansProps {
  count: readonly unknown[];
}

export const LoaderSpans = (props: LoaderSpansProps) => (
  <Index each={props.count}>{() => <span class={styles.part} />}</Index>
);
