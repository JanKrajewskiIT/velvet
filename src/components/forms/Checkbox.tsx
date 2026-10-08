import { createEffect, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';

export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'ref'> {
  label?: JSX.Element;
  /** Secondary line under the label. */
  description?: JSX.Element;
  /** Mixed state for parent rows. */
  indeterminate?: boolean;
  /** sm = 16px box for dense rows. @default 'md' */
  size?: 'sm' | 'md';
  /** Ref to the native input. */
  ref?: (element: HTMLInputElement) => void;
}

/** Checkbox for multi-select and consent. Supports indeterminate. `class` styles the wrapping label; other attributes go to the input. */
export const Checkbox = (props: CheckboxProps) => {
  const merged = mergeProps({ size: 'md' } satisfies CheckboxProps, props);
  const [local, rest] = splitProps(merged, ['label', 'description', 'indeterminate', 'size', 'ref', 'class']);
  let input!: HTMLInputElement;
  createEffect(() => {
    input.indeterminate = !!local.indeterminate;
  });
  return (
    <label
      class={cx(
        'vui-check',
        local.size === 'sm' && 'vui-check--sm',
        rest.disabled && 'vui-check--disabled',
        local.class,
      )}
    >
      <input
        {...rest}
        ref={(element) => {
          input = element;
          local.ref?.(element);
        }}
        type="checkbox"
        class="vui-checkbox"
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
