import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Table.module.css';

const TableHeader = (
  props: Props<JSX.HTMLAttributes<HTMLTableCellElement>>
) => {
  const [local, rest] = splitProps(props, ['class']);
  return <th class={`${styles.th} ${local.class ?? ''}`} {...rest} />;
};

export default TableHeader;
