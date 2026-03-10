import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Table.module.css';

const TableRow = (props: Props<JSX.HTMLAttributes<HTMLTableRowElement>>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <tr class={`${styles.tr} ${local.class ?? ''}`} {...rest} />;
};

export default TableRow;
