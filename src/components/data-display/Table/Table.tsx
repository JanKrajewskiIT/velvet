import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Table.module.css';

interface TableOwnProps extends JSX.HTMLAttributes<HTMLTableElement> {
  containerClass?: string;
}

const Table = (props: Props<TableOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'containerClass']);
  return (
    <div class={`${styles.tableContainer} ${local.containerClass ?? ''}`}>
      <table class={`${styles.table} ${local.class ?? ''}`} {...rest}>
        {local.children}
      </table>
    </div>
  );
};

export default Table;
