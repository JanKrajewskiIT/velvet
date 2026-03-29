import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { TableCellCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TableCell.module.css';

const TableCell = (props: Props<TableCellCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <td class={classNames(styles.td, local.class)} {...rest} />;
};

export default TableCell;
