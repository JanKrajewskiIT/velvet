import { FiUser } from 'solid-icons/fi';
import { createSignal, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded';
}

const getInitials = (name: string): string =>
  name
    .split(/\s+/u)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

const Avatar = (props: Props<AvatarProps>) => {
  const [imgError, setImgError] = createSignal(false);

  const sizeClass = () => styles[props.size ?? 'md'];
  const variantClass = () => (props.variant === 'rounded' ? styles.rounded : '');

  const classNames = () => `${styles.avatar} ${sizeClass()} ${variantClass()} ${props.class ?? ''}`;

  const showImage = () => props.src && !imgError();
  const showInitials = () => !showImage() && props.name;

  return (
    <div class={classNames()} role="img" aria-label={props.alt ?? props.name}>
      <Show when={showImage()}>
        <img
          class={styles.image}
          src={props.src}
          alt={props.alt ?? props.name ?? ''}
          onError={() => setImgError(true)}
        />
      </Show>
      <Show when={!showImage() && showInitials()}>
        <span class={styles.initials}>{getInitials(props.name ?? '')}</span>
      </Show>
      <Show when={!showImage() && !showInitials()}>
        <span class={styles.icon}>
          <FiUser />
        </span>
      </Show>
    </div>
  );
};

export default Avatar;
