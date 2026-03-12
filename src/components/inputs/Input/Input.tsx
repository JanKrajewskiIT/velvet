import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputOwnProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
}

const Input = (props: Props<InputOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size']);
  const sizeClass = () => {
    if (local.size === 'sm') return styles.sizeSm;
    if (local.size === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  return <input {...rest} class={classNames(styles.input, sizeClass(), local.class)} />;
};

export default Input;
