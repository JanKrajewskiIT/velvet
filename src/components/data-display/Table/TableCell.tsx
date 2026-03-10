import { type JSX, splitProps } from 'solid-js';

import styles from './Table.module.css';

export const TableCell = (props: JSX.HTMLAttributes<HTMLTableCellElement>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <td class={`${styles.td} ${local.class ?? ''}`} {...rest} />;
};
