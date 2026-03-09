import { type JSX, splitProps } from 'solid-js';

import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'title'
> {
  icon: JSX.Element;
  title: string;
  size?: 'sm' | 'md';
}

const IconButton = (props: IconButtonProps) => {
  const [local, rest] = splitProps(props, [
    'icon',
    'title',
    'size',
    'class',
    'type',
  ]);

  return (
    <button
      {...rest}
      type={local.type ?? 'button'}
      class={`${styles.iconButton} ${local.size === 'sm' ? styles.sm : ''} ${local.class ?? ''}`}
      title={local.title}
      aria-label={local.title}
    >
      {local.icon}
    </button>
  );
};

export default IconButton;
