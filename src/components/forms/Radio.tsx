import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';

export interface RadioProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** sm = 16px circle for dense rows. @default 'md' */
  size?: 'sm' | 'md';
  label?: JSX.Element;
  /** Secondary line under the label. */
  description?: JSX.Element;
}

/** Radio for picking one of 2–5 visible options. Group with a shared `name`. `class` styles the wrapping label; other attributes go to the input. */
export const Radio = (props: RadioProps) => {
  const merged = mergeProps({ size: 'md' } satisfies RadioProps, props);
  const [local, rest] = splitProps(merged, ['label', 'description', 'size', 'class']);
  return (
    <label
      class={cx(
        'vui-check',
        local.size === 'sm' && 'vui-check--sm',
        rest.disabled && 'vui-check--disabled',
        local.class,
      )}
    >
      <input {...rest} type="radio" class="vui-radio" />
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
