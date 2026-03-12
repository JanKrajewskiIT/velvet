import { Show } from 'solid-js';

import type Props from '~/models/Props';

import { getContrastTextColor } from '../../../utils/color';
import styles from './TagChip.module.css';

interface TagChipProps {
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

const TagChip = (props: Props<TagChipProps>) => {
  const classNames = () => `${styles.chip} ${props.selected ? styles.selected : ''} ${props.class ?? ''}`;

  const inlineStyles = () => ({
    'border-color': props.color,
    color: props.selected ? getContrastTextColor(props.color) : props.color,
    'background-color': props.selected ? props.color : 'transparent',
  });

  return (
    <Show
      when={props.onClick}
      fallback={
        <span class={classNames()} style={inlineStyles()}>
          {props.label}
        </span>
      }
    >
      <button type="button" class={classNames()} style={inlineStyles()} onClick={() => props.onClick?.()}>
        {props.label}
      </button>
    </Show>
  );
};

export default TagChip;
