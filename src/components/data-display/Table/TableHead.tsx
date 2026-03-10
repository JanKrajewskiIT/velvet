import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Table.module.css';

const TableHead = (
  props: Props<JSX.HTMLAttributes<HTMLTableSectionElement>>
) => {
  const [local, rest] = splitProps(props, ['class']);
  return <thead class={`${styles.thead} ${local.class ?? ''}`} {...rest} />;
};

export default TableHead;
