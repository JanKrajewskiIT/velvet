import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Table.module.css';

const TableBody = (props: Props<JSX.HTMLAttributes<HTMLTableSectionElement>>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <tbody class={classNames(styles.tbody, local.class)} {...rest} />;
};

export default TableBody;
