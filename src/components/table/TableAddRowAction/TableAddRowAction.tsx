import type { JSX } from 'solid-js';

import TableCell from '~/components/table/Table/TableCell/TableCell';
import TableRow from '~/components/table/Table/TableRow/TableRow';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TableAddRowAction.module.css';

interface TableAddRowActionProps {
  label: string;
  colSpan: number;
  onClick: () => void;
  icon?: JSX.Element;
}

const TableAddRowAction = (props: Props<TableAddRowActionProps>) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      props.onClick();
    }
  };

  return (
    <TableRow
      class={classNames(styles.row, props.class)}
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={props.label}
    >
      <TableCell colSpan={props.colSpan} class={styles.cell}>
        <div class={styles.content}>
          {props.icon && <span class={styles.icon}>{props.icon}</span>}
          <Text as="span" variant="labelMd" tone="primary">
            {props.label}
          </Text>
        </div>
      </TableCell>
    </TableRow>
  );
};

export type { TableAddRowActionProps };
export default TableAddRowAction;
