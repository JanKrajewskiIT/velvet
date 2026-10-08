import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';

export interface SwitchProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role'> {
  label?: JSX.Element;
  /** Secondary line under the label. */
  description?: JSX.Element;
  /** @default 'md' */
  size?: 'sm' | 'md';
}

/** Switch for instant on/off settings (no Save needed). `class` styles the wrapping label; other attributes go to the input. */
export const Switch = (props: SwitchProps) => {
  const merged = mergeProps({ size: 'md' } satisfies SwitchProps, props);
  const [local, rest] = splitProps(merged, ['label', 'description', 'size', 'class']);
  return (
    <label class={cx('vui-check', rest.disabled && 'vui-check--disabled', local.class)}>
      <input
        {...rest}
        type="checkbox"
        role="switch"
        class={cx('vui-switch', local.size === 'sm' && 'vui-switch--sm')}
      />
      <Show when={local.label || local.description}>
        <span>
          {local.label}
          <Show when={local.description}>
            <span class="vui-check__desc">{local.description}</span>
          </Show>
        </span>
      </Show>
    </label>
  );
};
