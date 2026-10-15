import { type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Control.module.css';
import { renderIcon } from './Glyph';
import { Text } from './Text';

const CONTROL_CLASSES = {
  sm: styles.controlVariantSm,
  lg: styles.controlVariantLg,
  invalid: styles.controlVariantInvalid,
  disabled: styles.controlVariantDisabled,
  readonly: styles.controlVariantReadonly,
  textarea: styles.controlVariantTextarea,
} as const;

export interface ControlProps extends HtmlProps<HTMLDivElement, 'prefix'> {
  /** Height from `--control-height-*` (density- and pointer-aware). @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Auto height for a textarea. */
  multiline?: boolean;
  /** Glyph name or node, inside the left edge. */
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  /** Text affix, e.g. `"https://"` or `"€"`. */
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  /** Trailing slot for inline buttons (clear, reveal, stepper). */
  end?: JSX.Element;
}

/** The bordered field shell used by the input components. */
export const Control = (props: ControlProps) => {
  const merged = mergeProps({ size: 'md' } satisfies ControlProps, props);
  const [local, rest] = splitProps(merged, [
    'size',
    'invalid',
    'disabled',
    'readOnly',
    'multiline',
    'iconLeft',
    'iconRight',
    'prefix',
    'suffix',
    'end',
    'class',
    'children',
  ]);
  return (
    <div
      class={cx(
        styles.control,
        variantClass(CONTROL_CLASSES, local.size, 'md'),
        local.multiline && styles.controlVariantTextarea,
        local.invalid && styles.controlVariantInvalid,
        local.disabled && styles.controlVariantDisabled,
        local.readOnly && styles.controlVariantReadonly,
        local.class,
      )}
      {...rest}
    >
      <Show when={local.iconLeft}>
        <span class={styles.controlPartAdorn}>{renderIcon(local.iconLeft)}</span>
      </Show>
      <Show when={local.prefix}>
        <Text as="span" variant="body" tone="inherit" class={styles.controlPartAffix}>
          {local.prefix}
        </Text>
      </Show>
      {local.children}
      <Show when={local.suffix}>
        <Text
          as="span"
          variant="body"
          tone="inherit"
          class={cx(styles.controlPartAffix, styles.controlPartAffixVariantEnd)}
        >
          {local.suffix}
        </Text>
      </Show>
      <Show when={local.iconRight}>
        <span class={cx(styles.controlPartAdorn, styles.controlPartAdornVariantEnd)}>
          {renderIcon(local.iconRight)}
        </span>
      </Show>
      {local.end}
    </div>
  );
};
