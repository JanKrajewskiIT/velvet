import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import getInputSizeClass from '~/utils/getInputSizeClass';

import type { InputSize } from '../Input/Input';
import styles from './InputButton.module.css';

interface InputButtonOwnProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'class'> {
  size?: InputSize;
  invalid?: boolean;
  readOnly?: boolean;
  class?: string;
}

const InputButton = (props: Props<InputButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['size', 'invalid', 'readOnly', 'class', 'children', 'type']);

  const sizeClass = () => getInputSizeClass(styles, local.size);

  return (
    <button
      {...rest}
      type={local.type ?? 'button'}
      disabled={rest.disabled}
      data-invalid={local.invalid || undefined}
      data-readonly={local.readOnly || undefined}
      class={classNames(
        styles.field,
        sizeClass(),
        rest.disabled && styles.disabled,
        local.invalid && styles.invalid,
        local.readOnly && styles.readOnly,
        local.class
      )}
    >
      {local.children}
    </button>
  );
};

export default InputButton;
