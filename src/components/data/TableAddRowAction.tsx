import { splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../actions/Button';

export interface TableAddRowActionProps extends Omit<ButtonProps, 'variant' | 'block'> {
  /** Include selection and expansion columns. @default 1 */
  colSpan?: number;
  rowClass?: string;
}

/** Place in Table's `addRow` slot, or directly inside a native tbody. */
export const TableAddRowAction = (props: TableAddRowActionProps) => {
  const [local, button] = splitProps(props, ['colSpan', 'rowClass', 'children', 'class']);
  const translate = useTranslate();
  return (
    <tr class={cx('vui-table__addrow', local.rowClass)}>
      <td colSpan={local.colSpan ?? 1}>
        <Button iconLeft="plus" {...button} class={cx('vui-table__addbtn', local.class)} variant="ghost" block>
          {local.children ?? translate('velvet.data.table.addRow')}
        </Button>
      </td>
    </tr>
  );
};
