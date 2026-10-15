import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Radio.module.css';

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
        typographyClass(local.size === 'sm' ? 'body-sm' : 'body'),
        styles.check,
        local.size === 'sm' && styles.checkVariantSm,
        rest.disabled && styles.checkVariantDisabled,
        local.class,
      )}
    >
      <input {...rest} type="radio" class={styles.radio} />
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
