import { type JSX, splitProps } from 'solid-js';

import Card from '~/components/surfaces/Card/Card';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Table.module.css';

interface TableOwnProps extends JSX.HTMLAttributes<HTMLTableElement> {
  containerClass?: string;
}

const Table = (props: Props<TableOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'children', 'containerClass']);
  return (
    <Card padding="none" class={classNames(styles.tableCard, styles.tableContainer, local.containerClass)}>
      <table class={classNames(styles.table, local.class)} {...rest}>
        {local.children}
      </table>
    </Card>
  );
};

export default Table;
