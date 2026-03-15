import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import { getContrastTextColor } from '~/utils/color';

import styles from './TagChip.module.css';

interface TagChipProps {
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

const TagChip = (props: Props<TagChipProps>) => {
  const chipClass = () => classNames(styles.chip, props.selected && styles.selected, props.class);

  const inlineStyles = () => ({
    'border-color': props.color,
    color: props.selected ? getContrastTextColor(props.color) : props.color,
    'background-color': props.selected ? props.color : 'transparent',
  });

  return (
    <Show
      when={props.onClick}
      fallback={
        <span class={chipClass()} style={inlineStyles()}>
          {props.label}
        </span>
      }
    >
      <button type="button" class={chipClass()} style={inlineStyles()} onClick={() => props.onClick?.()}>
        {props.label}
      </button>
    </Show>
  );
};

export default TagChip;
