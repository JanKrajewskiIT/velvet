import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Switch.module.css';

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
    <label class={cx(typographyClass('body'), styles.check, rest.disabled && styles.checkVariantDisabled, local.class)}>
      <input
        {...rest}
        type="checkbox"
        role="switch"
        class={cx(styles.switch, local.size === 'sm' && styles.switchVariantSm)}
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
