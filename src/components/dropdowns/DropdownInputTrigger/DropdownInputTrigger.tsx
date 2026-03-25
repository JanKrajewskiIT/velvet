import { FiChevronDown } from 'solid-icons/fi';
import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import Input, { type InputSize } from '~/components/inputs/Input/Input';
import type Props from '~/models/Props';
import type { InputCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownInputTrigger.module.css';

interface DropdownInputTriggerOwnProps extends InputCoreNativeProps {
  size?: InputSize;
  invalid?: boolean;
  open?: boolean;
  hideIcon?: boolean;
  role?: JSX.HTMLAttributes<HTMLDivElement>['role'];
}

const DropdownInputTrigger = (props: Props<DropdownInputTriggerOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'size', 'invalid', 'open', 'hideIcon', 'role']);

  return (
    <div class={styles.root} role={local.role || undefined}>
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
