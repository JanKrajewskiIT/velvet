import { type JSX, splitProps } from 'solid-js';

import styles from './Table.module.css';

export const TableHeader = (
  props: JSX.HTMLAttributes<HTMLTableCellElement>
) => {
  const [local, rest] = splitProps(props, ['class']);
  return <th class={`${styles.th} ${local.class ?? ''}`} {...rest} />;
};
