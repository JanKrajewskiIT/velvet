import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { TableSectionCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TableHead.module.css';

const TableHead = (props: Props<TableSectionCoreNativeProps>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <thead class={classNames(styles.thead, local.class)} {...rest} />;
};

export default TableHead;
