import { type JSX, splitProps } from 'solid-js';

import styles from './Table.module.css';

export const TableRow = (props: JSX.HTMLAttributes<HTMLTableRowElement>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <tr class={`${styles.tr} ${local.class ?? ''}`} {...rest} />;
};
