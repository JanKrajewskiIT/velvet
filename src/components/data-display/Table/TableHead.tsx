import { type JSX, splitProps } from 'solid-js';

import styles from './Table.module.css';

export const TableHead = (
  props: JSX.HTMLAttributes<HTMLTableSectionElement>
) => {
  const [local, rest] = splitProps(props, ['class']);
  return <thead class={`${styles.thead} ${local.class ?? ''}`} {...rest} />;
};
