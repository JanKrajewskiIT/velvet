import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Table.module.css';

const Table = (props: Props<JSX.HTMLAttributes<HTMLTableElement>>) => {
  const [local, rest] = splitProps(props, ['class', 'children']);
  return (
    <div class={styles.tableContainer}>
      <table class={`${styles.table} ${local.class ?? ''}`} {...rest}>
        {local.children}
      </table>
    </div>
  );
};

export default Table;
