import type { JSX } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ActionRow.module.css';

interface ActionRowProps {
  align?: 'center' | 'start' | 'end';
  children: JSX.Element;
}

const ActionRow = (props: Props<ActionRowProps>) => {
  const alignClass = () => {
    const a = props.align ?? 'center';
    return styles[a] ?? '';
  };

  return <div class={classNames(styles.row, alignClass(), props.class)}>{props.children}</div>;
};

export default ActionRow;
