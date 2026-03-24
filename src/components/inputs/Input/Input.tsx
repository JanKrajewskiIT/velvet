import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';

import FieldBase from '../FieldBase/FieldBase';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputOwnProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  invalid?: boolean;
}

const Input = (props: Props<InputOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'readOnly', 'placeholder']);

  return (
    <FieldBase
      as="input"
      {...rest}
      size={local.size}
      invalid={local.invalid}
      readOnly={local.readOnly}
      disabled={rest.disabled}
      focusStyle="visible"
      placeholder={local.placeholder}
      aria-invalid={local.invalid || undefined}
      class={local.class}
    />
  );
};

export default Input;
