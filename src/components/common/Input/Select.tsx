import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import styles from './Input.module.css';

type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement>;

const Select = (props: SelectProps) => {
  const [local, rest] = splitProps(props, ['class']);
  return <select {...rest} class={`${styles.select} ${local.class ?? ''}`} />;
};

export default Select;
