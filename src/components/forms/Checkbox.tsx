import { createEffect, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Checkbox.module.css';

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
        typographyClass(local.size === 'sm' ? 'body-sm' : 'body'),
        styles.check,
        local.size === 'sm' && styles.checkVariantSm,
        rest.disabled && styles.checkVariantDisabled,
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
        class={styles.checkbox}
      />
      <Show when={local.label || local.description}>
        <Text as="span" variant="label" tone="inherit">
          {local.label}
          <Show when={local.description}>
            <Text as="span" variant="body-sm" tone="inherit" class={styles.checkPartDesc}>
              {local.description}
            </Text>
          </Show>
        </Text>
      </Show>
    </label>
  );
};
