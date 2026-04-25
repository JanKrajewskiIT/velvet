import type { JSX } from 'solid-js';
import { createMemo, Show, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import { getContrastTextColor } from '~/utils/color';

import styles from './Chip.module.css';

interface ChipProps {
  variant?: 'info' | 'warning' | 'success' | 'error' | 'primary' | 'primaryOutline' | 'subtle';
  size?: 'sm' | 'md';
  selected?: boolean;
  filled?: boolean;
  color?: string;
  onClick?: (e: MouseEvent) => void;
  label: string;
  endAdornment?: JSX.Element;
  children?: never;
}

const variantClassByValue: Record<NonNullable<ChipProps['variant']>, string | undefined> = {
  info: styles.info,
  warning: styles.warning,
  success: styles.success,
  error: styles.error,
  primary: styles.primary,
  primaryOutline: styles.primaryOutline,
  subtle: styles.subtle,
};

const Chip = (props: Props<ChipProps>) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'size',
    'selected',
    'filled',
    'color',
    'onClick',
    'label',
    'endAdornment',
    'class',
  ]);
  const usesCustomColor = createMemo(() => Boolean(local.color));
  const isColorFilled = createMemo(() => Boolean(local.color && (local.selected || local.filled)));

  const chipClass = createMemo(() =>
    classNames(
      styles.chip,
      usesCustomColor() && styles.customColor,
      !usesCustomColor() && variantClassByValue[local.variant ?? 'primary'],
      local.size === 'sm' && styles.sm,
      local.selected && styles.selected,
      local.filled && styles.filled,
      local.onClick && styles.interactive,
      local.class,
    ),
  );

  const inlineStyles = createMemo(() => {
    if (!local.color) return undefined;

    return {
      '--chip-border-color': local.color,
      '--chip-text-color': isColorFilled() ? getContrastTextColor(local.color) : local.color,
      '--chip-background-color': isColorFilled() ? local.color : 'transparent',
    };
  });

  const content = createMemo(() => (
    <>
      <Text as="span" variant="labelMd" tone="inherit">
        {local.label}
      </Text>
      <Show when={local.endAdornment}>{local.endAdornment}</Show>
    </>
  ));

  return (
    <Show
      when={local.onClick}
      fallback={
        <span {...rest} class={chipClass()} style={inlineStyles()}>
          {content()}
        </span>
      }
    >
      <button
        type="button"
        {...rest}
        class={chipClass()}
        style={inlineStyles()}
        onClick={(event) => local.onClick?.(event)}
      >
        {content()}
      </button>
    </Show>
  );
};

export default Chip;
