import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import getInputSizeClass from '~/utils/getInputSizeClass';

import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputOwnProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  invalid?: boolean;
}

const Input = (props: Props<InputOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'readOnly']);
  const sizeClass = () => getInputSizeClass(styles, local.size);

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
        rest.disabled && styles.disabled,
        local.class
      )}
    />
  );
};

export default Input;
