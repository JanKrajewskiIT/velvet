import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import type { InputSize } from '../Input/Input';
import styles from './InputBase.module.css';

interface InputBaseOwnProps extends JSX.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  size?: InputSize;
  disabled?: boolean;
  focusWithin?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const InputBase = (props: Props<InputBaseOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'as',
    'class',
    'size',
    'disabled',
    'focusWithin',
    'children',
    'invalid',
    'readOnly',
  ]);

  const sizeClass = () => {
    if (local.size === 'sm') return styles.sizeSm;
    if (local.size === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  return (
    <Dynamic
      component={local.as ?? 'div'}
      {...rest}
      disabled={local.as === 'button' ? local.disabled : undefined}
      aria-invalid={local.invalid || undefined}
      aria-readonly={local.readOnly || undefined}
      class={classNames(
        styles.field,
        sizeClass(),
        local.focusWithin !== false && styles.focusWithin,
        local.disabled && styles.disabled,
        local.invalid && styles.invalid,
        local.readOnly && styles.readOnly,
        local.class
      )}
    >
      {local.children}
    </Dynamic>
  );
};

export default InputBase;
