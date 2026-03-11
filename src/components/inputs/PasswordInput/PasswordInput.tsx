import { IoEye, IoEyeOutline } from 'solid-icons/io';
import { createSignal, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './PasswordInput.module.css';

interface PasswordInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showToggle?: boolean;
  visibilityLabel?: string;
}

const PasswordInput = (props: Props<PasswordInputProps>) => {
  const [local, rest] = splitProps(props, ['class', 'showToggle', 'visibilityLabel']);
  const [visible, setVisible] = createSignal(false);

  const toggle = () => setVisible(!visible());

  return (
    <div class={`${styles.wrapper} ${local.class ?? ''}`}>
      <input {...rest} type={visible() ? 'text' : 'password'} class={styles.input} />
      <Show when={local.showToggle !== false}>
        <button
          type="button"
          class={styles.toggle}
          onClick={toggle}
          aria-label={local.visibilityLabel ?? 'Toggle password visibility'}
        >
          <Show when={visible()} fallback={<IoEyeOutline />}>
            <IoEye />
          </Show>
        </button>
      </Show>
    </div>
  );
};

export default PasswordInput;
