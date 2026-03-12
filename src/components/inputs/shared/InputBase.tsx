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
  type?: JSX.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

const InputBase = (props: Props<InputBaseOwnProps>) => {
  const [local, rest] = splitProps(props, ['as', 'class', 'size', 'disabled', 'focusWithin', 'children']);

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
      class={classNames(
        styles.field,
        sizeClass(),
        local.focusWithin !== false && styles.focusWithin,
        local.disabled && styles.disabled,
        local.class
      )}
    >
      {local.children}
    </Dynamic>
  );
};

export default InputBase;
