import { type JSX, splitProps } from 'solid-js';

import styles from './Table.module.css';

export type TableProps = JSX.HTMLAttributes<HTMLTableElement>;

export const Table = (props: TableProps) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div class={styles.tableContainer}>
      <table class={`${styles.table} ${local.class || ''}`} {...rest}>
        {local.children}
      </table>
    </div>
  );
};
