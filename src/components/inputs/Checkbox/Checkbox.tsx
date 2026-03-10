import { createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Checkbox.module.css';

interface CheckboxOwnProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: JSX.Element;
  description?: JSX.Element;
}

const Checkbox = (props: Props<CheckboxOwnProps>) => {
  const generatedId = createUniqueId();
  const [local, rest] = splitProps(props, [
    'label',
    'description',
    'class',
    'id',
  ]);

  const inputId = () => local.id ?? generatedId;

  return (
    <label class={`${styles.wrapper} ${local.class ?? ''}`} for={inputId()}>
      <span class={styles.control}>
        <input {...rest} id={inputId()} type="checkbox" class={styles.input} />
        <span class={styles.indicator} aria-hidden="true" />
      </span>
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
    </label>
  );
};

export default Checkbox;
