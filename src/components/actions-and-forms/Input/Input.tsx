import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Input.module.css';

const Input = (props: Props<JSX.InputHTMLAttributes<HTMLInputElement>>) => {
  const [local, rest] = splitProps(props, ['class']);
  return <input {...rest} class={`${styles.input} ${local.class ?? ''}`} />;
};

export default Input;
