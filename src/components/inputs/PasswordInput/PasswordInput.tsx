import { IoEye, IoEyeOutline } from 'solid-icons/io';
import { createSignal, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Input, { type InputSize } from '../Input/Input';
import styles from './PasswordInput.module.css';

interface PasswordInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showToggle?: boolean;
  visibilityLabel: string;
  size?: InputSize;
}

const PasswordInput = (props: Props<PasswordInputProps>) => {
  const [local, rest] = splitProps(props, ['class', 'showToggle', 'visibilityLabel', 'size']);
  const [visible, setVisible] = createSignal(false);

  const toggle = () => setVisible(!visible());
  const sizeClass = () => {
    if (local.size === 'sm') return styles.sizeSm;
    if (local.size === 'lg') return styles.sizeLg;
    return styles.sizeMd;
  };

  return (
    <div class={classNames(styles.wrapper, sizeClass(), rest.disabled && styles.disabled, local.class)}>
      <Input {...rest} type={visible() ? 'text' : 'password'} class={styles.input} size={local.size} />
      <Show when={local.showToggle !== false}>
        <button type="button" class={styles.toggle} onClick={toggle} aria-label={local.visibilityLabel}>
          <Show when={visible()} fallback={<IoEyeOutline />}>
            <IoEye />
          </Show>
        </button>
      </Show>
    </div>
  );
};

export default PasswordInput;
