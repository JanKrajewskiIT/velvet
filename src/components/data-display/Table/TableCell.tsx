import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Table.module.css';

const TableCell = (props: Props<JSX.HTMLAttributes<HTMLTableCellElement>>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <td class={`${styles.td} ${local.class ?? ''}`} {...rest} />;
};

export default TableCell;
