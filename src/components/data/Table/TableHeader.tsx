import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Table.module.css';

const TableHeader = (props: Props<JSX.ThHTMLAttributes<HTMLTableCellElement>>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <th class={classNames(styles.th, local.class)} {...rest} />;
};

export default TableHeader;
