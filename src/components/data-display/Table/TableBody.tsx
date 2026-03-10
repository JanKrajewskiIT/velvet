import { type JSX, splitProps } from 'solid-js';

import styles from './Table.module.css';

export const TableBody = (
  props: JSX.HTMLAttributes<HTMLTableSectionElement>
) => {
  const [local, rest] = splitProps(props, ['class']);
  return <tbody class={`${styles.tbody} ${local.class ?? ''}`} {...rest} />;
};
