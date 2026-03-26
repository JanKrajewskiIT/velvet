import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { TableSectionCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TableBody.module.css';

const TableBody = (props: Props<TableSectionCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <tbody class={classNames(styles.tbody, local.class)} {...rest} />;
};

export default TableBody;
