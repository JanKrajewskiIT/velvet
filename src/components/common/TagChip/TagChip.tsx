import type Props from '../../../models/Props';
import { getContrastTextColor } from '../../../utils/color';

import styles from './TagChip.module.css';

interface TagChipProps {
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

const TagChip = (props: Props<TagChipProps>) => {
  return (
    <button
      type="button"
      class={`${styles.chip} ${props.selected ? styles.selected : ''} ${props.class ?? ''}`}
      style={{
        'border-color': props.color,
        color: props.selected ? getContrastTextColor(props.color) : props.color,
        'background-color': props.selected ? props.color : 'transparent',
      }}
      onClick={() => props.onClick?.()}
    >
      {props.label}
    </button>
  );
};

export default TagChip;
