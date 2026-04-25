import type { JSX } from 'solid-js';
import { createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './List.module.css';

interface ListProps {
  children: JSX.Element;
  variant?: 'default' | 'bordered';
}

const List = (props: Props<ListProps>) => {
  const [local, rest] = splitProps(props, ['children', 'variant', 'class']);
  const variantClass = createMemo(() => (local.variant === 'bordered' ? styles.bordered : ''));

  return (
    <ul {...rest} class={classNames(styles.list, variantClass(), local.class)}>
      {local.children}
    </ul>
  );
};

export default List;
