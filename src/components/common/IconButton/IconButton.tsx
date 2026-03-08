import type { JSX } from 'solid-js';

import type Props from '../../../models/Props';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: JSX.Element;
  title: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const IconButton = (props: Props<IconButtonProps>) => {
  return (
    <button
      type="button"
      class={`${styles.iconButton} ${props.size === 'sm' ? styles.sm : ''} ${props.class ?? ''}`}
      title={props.title}
      aria-label={props.title}
      onClick={() => props.onClick?.()}
    >
      {props.icon}
    </button>
  );
};

export default IconButton;
