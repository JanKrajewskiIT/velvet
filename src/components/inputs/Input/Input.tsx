import { createMemo, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { ComponentSize, InputCoreNativeProps } from '~/models/Props';
import { resolveAriaInvalid } from '~/utils/aria';

import FieldBase from '../FieldBase/FieldBase';

interface InputOwnProps extends InputCoreNativeProps {
  size?: ComponentSize | null;
  invalid?: boolean;
}

const Input = (props: Props<InputOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'size',
    'invalid',
    'readOnly',
    'placeholder',
    'disabled',
    'aria-invalid',
  ]);
  const ariaInvalid = createMemo(() =>
    resolveAriaInvalid(local.invalid, local['aria-invalid'] as boolean | 'true' | 'false' | undefined),
  );

  return (
    <FieldBase
      as="input"
      {...rest}
      size={local.size}
      invalid={local.invalid}
      readOnly={local.readOnly}
      disabled={local.disabled}
      focusStyle="visible"
      placeholder={local.placeholder}
      aria-invalid={ariaInvalid()}
      class={local.class}
    />
  );
};

export default Input;
export type { InputOwnProps };
