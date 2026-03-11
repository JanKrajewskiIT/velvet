import type { JSX } from 'solid-js';

import type Props from '~/models/Props';

import styles from './List.module.css';

interface ListProps {
  children: JSX.Element;
  variant?: 'default' | 'bordered';
}

const List = (props: Props<ListProps>) => {
  const variantClass = () => (props.variant === 'bordered' ? styles.bordered : '');

  return <ul class={`${styles.list} ${variantClass()} ${props.class ?? ''}`}>{props.children}</ul>;
};

export default List;
