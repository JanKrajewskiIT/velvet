import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

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
  children: JSX.Element;
}

const Chip = (props: Props<ChipProps>) => {
  const usesCustomColor = () => Boolean(props.color);
  const isColorFilled = () => Boolean(props.color && (props.selected || props.filled));

  const chipClass = () =>
    classNames(
      styles.chip,
      !usesCustomColor() && styles[props.variant ?? 'primary'],
      props.size === 'sm' && styles.sm,
      props.selected && styles.selected,
      props.filled && styles.filled,
      props.onClick && styles.interactive,
      props.class
    );

  const inlineStyles = () => {
    if (!props.color) return undefined;

    return {
      'border-color': props.color,
      color: isColorFilled() ? getContrastTextColor(props.color) : props.color,
      'background-color': isColorFilled() ? props.color : 'transparent',
    };
  };

  return (
    <Show
      when={props.onClick}
      fallback={
        <span class={chipClass()} style={inlineStyles()}>
          {props.children}
        </span>
      }
    >
      <button type="button" class={chipClass()} style={inlineStyles()} onClick={(e) => props.onClick?.(e)}>
        {props.children}
      </button>
    </Show>
  );
};

export default Chip;
