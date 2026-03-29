import type { JSX } from 'solid-js';
import { createMemo, Show } from 'solid-js';

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

const Chip = (props: Props<ChipProps>) => {
  const usesCustomColor = createMemo(() => Boolean(props.color));
  const isColorFilled = createMemo(() => Boolean(props.color && (props.selected || props.filled)));

  const chipClass = createMemo(() =>
    classNames(
      styles.chip,
      usesCustomColor() && styles.customColor,
      !usesCustomColor() && styles[props.variant ?? 'primary'],
      props.size === 'sm' && styles.sm,
      props.selected && styles.selected,
      props.filled && styles.filled,
      props.onClick && styles.interactive,
      props.class
    )
  );

  const inlineStyles = createMemo(() => {
    if (!props.color) return undefined;

    return {
      '--chip-border-color': props.color,
      '--chip-text-color': isColorFilled() ? getContrastTextColor(props.color) : props.color,
      '--chip-background-color': isColorFilled() ? props.color : 'transparent',
    } as JSX.CSSProperties;
  });

  const content = createMemo(() => (
    <>
      <Text as="span" variant="labelMd" tone="inherit">
        {props.label}
      </Text>
      <Show when={props.endAdornment}>{props.endAdornment}</Show>
    </>
  ));

  return (
    <Show
      when={props.onClick}
      fallback={
        <span class={chipClass()} style={inlineStyles()}>
          {content()}
        </span>
      }
    >
      <button type="button" class={chipClass()} style={inlineStyles()} onClick={(event) => props.onClick?.(event)}>
        {content()}
      </button>
    </Show>
  );
};

export default Chip;
