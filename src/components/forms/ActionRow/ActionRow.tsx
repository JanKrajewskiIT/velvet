import { type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Stack from '../../surfaces/Stack/Stack';
import styles from './ActionRow.module.css';

type ActionRowAlign = 'center' | 'start' | 'end';

interface ActionRowOwnProps extends DivCoreNativeProps {
  align?: 'center' | 'start' | 'end';
  children: JSX.Element;
}

const alignToJustify: Record<ActionRowAlign, 'center' | 'start' | 'end'> = {
  center: 'center',
  start: 'start',
  end: 'end',
};

const ActionRow = (props: Props<ActionRowOwnProps>) => {
  const [local, rest] = splitProps(props, ['align', 'children', 'class']);

  const justify = () => {
    const align = local.align ?? 'center';
    return alignToJustify[align];
  };

  return (
    <Stack
      {...rest}
      direction="horizontal"
      align="center"
      justify={justify()}
      gap="md"
      class={classNames(styles.row, local.class)}
    >
      {local.children}
    </Stack>
  );
};

export default ActionRow;
