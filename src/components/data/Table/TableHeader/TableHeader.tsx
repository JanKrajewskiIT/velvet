import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { TableHeaderCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TableHeader.module.css';

const TableHeader = (props: Props<TableHeaderCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <th class={classNames(styles.th, local.class)} {...rest} />;
};

export default TableHeader;
