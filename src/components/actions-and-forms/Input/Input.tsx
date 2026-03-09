import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import styles from './Input.module.css';

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => {
  const [local, rest] = splitProps(props, ['class']);
  return <input {...rest} class={`${styles.input} ${local.class ?? ''}`} />;
};

export default Input;
