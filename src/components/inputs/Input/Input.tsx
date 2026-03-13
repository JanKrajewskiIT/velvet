import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputOwnProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  invalid?: boolean;
}

const Input = (props: Props<InputOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'readOnly']);
  const sizeClass = () => {
    if (local.size === 'sm') return styles.sizeSm;
    if (local.size === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  return (
    <input
      {...rest}
      readOnly={local.readOnly}
      aria-invalid={local.invalid || undefined}
      class={classNames(
        styles.input,
        sizeClass(),
        local.invalid && styles.invalid,
        local.readOnly && styles.readOnly,
        local.class
      )}
    />
  );
};

export default Input;
