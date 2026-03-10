import { type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Switch.module.css';

interface SwitchOwnProps extends Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onChange'
> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: JSX.Element;
  description?: JSX.Element;
}

const Switch = (props: Props<SwitchOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'checked',
    'onChange',
    'label',
    'description',
    'class',
    'disabled',
  ]);

  return (
    <div class={`${styles.wrapper} ${local.class ?? ''}`}>
      <button
        {...rest}
        type="button"
        role="switch"
        class={`${styles.switch} ${local.checked ? styles.checked : ''}`}
        aria-checked={local.checked}
        disabled={local.disabled}
        onClick={() => local.onChange(!local.checked)}
      >
        <span class={styles.thumb} />
      </button>
      <Show when={local.label || local.description}>
        <span class={styles.text}>
          <Show when={local.label}>
            <span class={styles.label}>{local.label}</span>
          </Show>
          <Show when={local.description}>
            <span class={styles.description}>{local.description}</span>
          </Show>
        </span>
      </Show>
    </div>
  );
};

export default Switch;
