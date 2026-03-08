import { JSX, splitProps } from 'solid-js';

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

export const TableHead = (
  props: JSX.HTMLAttributes<HTMLTableSectionElement>
) => {
  return <thead class={styles.thead} {...props} />;
};

export const TableBody = (
  props: JSX.HTMLAttributes<HTMLTableSectionElement>
) => {
  return <tbody class={styles.tbody} {...props} />;
};

export const TableRow = (props: JSX.HTMLAttributes<HTMLTableRowElement>) => {
  return <tr class={styles.tr} {...props} />;
};

export const TableHeader = (
  props: JSX.HTMLAttributes<HTMLTableCellElement>
) => {
  return <th class={styles.th} {...props} />;
};

export const TableCell = (props: JSX.HTMLAttributes<HTMLTableCellElement>) => {
  return <td class={styles.td} {...props} />;
};
