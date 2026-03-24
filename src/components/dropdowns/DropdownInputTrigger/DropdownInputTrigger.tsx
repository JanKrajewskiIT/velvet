import { FiChevronDown } from 'solid-icons/fi';
import { type JSX, splitProps } from 'solid-js';

import Input, { type InputSize } from '~/components/inputs/Input/Input';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownInputTrigger.module.css';

interface DropdownInputTriggerOwnProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  invalid?: boolean;
  open?: boolean;
  hideIcon?: boolean;
}

const DropdownInputTrigger = (props: Props<DropdownInputTriggerOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'open', 'hideIcon']);

  return (
    <div class={styles.root}>
      <Input {...rest} size={local.size} invalid={local.invalid} class={classNames(styles.input, local.class)} />
      {!local.hideIcon && (
        <span class={classNames(styles.icon, local.open && styles.iconOpen)} aria-hidden="true">
          <FiChevronDown />
        </span>
      )}
    </div>
  );
};

export default DropdownInputTrigger;
