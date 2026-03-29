import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { TableRowCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TableRow.module.css';

const TableRow = (props: Props<TableRowCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <tr class={classNames(styles.tr, local.class)} {...rest} />;
};

export default TableRow;
