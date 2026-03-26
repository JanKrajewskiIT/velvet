import { FiUser } from 'solid-icons/fi';
import { createMemo, createSignal, Show, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize, DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Avatar.module.css';

type AvatarSize = ComponentSize | 'xl';

interface AvatarOwnProps extends Omit<DivCoreNativeProps, 'children'> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  variant?: 'circle' | 'rounded';
}

const getInitials = (name: string): string =>
  name
    .split(/\s+/u)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

const Avatar = (props: Props<AvatarOwnProps>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, ['src', 'alt', 'name', 'size', 'variant', 'class']);
  const [imgError, setImgError] = createSignal(false);

  const sizeClass = () => styles[local.size ?? 'md'];
  const showImage = () => Boolean(local.src) && !imgError();
  const showInitials = () => !showImage() && Boolean(local.name);
  const fallbackLabel = createMemo(() => local.alt ?? local.name ?? t('avatar.label'));

  return (
    <div
      {...rest}
      class={classNames(styles.avatar, sizeClass(), local.variant === 'rounded' && styles.rounded, local.class)}
      role={showImage() ? undefined : 'img'}
      aria-label={showImage() ? undefined : fallbackLabel()}
    >
      <Show when={showImage()}>
        <img
          class={styles.image}
          src={local.src}
          alt={local.alt ?? local.name ?? ''}
          onError={() => setImgError(true)}
        />
      </Show>
      <Show when={!showImage() && showInitials()}>
        <span class={styles.initials}>{getInitials(local.name ?? '')}</span>
      </Show>
      <Show when={!showImage() && !showInitials()}>
        <span class={styles.icon}>
          <Icon icon={FiUser} />
        </span>
      </Show>
    </div>
  );
};

export type { AvatarOwnProps, AvatarSize };
export default Avatar;
