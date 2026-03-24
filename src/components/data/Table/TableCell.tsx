import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Table.module.css';

const TableCell = (props: Props<JSX.TdHTMLAttributes<HTMLTableCellElement>>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <td class={classNames(styles.td, local.class)} {...rest} />;
};

export default TableCell;
