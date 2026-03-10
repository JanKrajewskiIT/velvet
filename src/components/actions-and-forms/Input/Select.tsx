import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Input.module.css';

const Select = (props: Props<JSX.SelectHTMLAttributes<HTMLSelectElement>>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <select {...rest} class={`${styles.select} ${local.class ?? ''}`} />;
};

export default Select;
