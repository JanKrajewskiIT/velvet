import { FiUser } from 'solid-icons/fi';
import { createMemo, createSignal, Show, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { ComponentSize, DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Avatar.module.css';

type AvatarSize = ComponentSize | 'xl';

const sizeClassByValue: Record<AvatarSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

const statusClassByValue: Record<AvatarStatus, string | undefined> = {
  online: styles.online,
  offline: styles.offline,
  busy: styles.busy,
  away: styles.away,
};

interface AvatarOwnProps extends Omit<DivCoreNativeProps, 'children'> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  variant?: 'circle' | 'rounded';
  status?: AvatarStatus;
}

const getInitials = (name: string): string =>
  name
    .split(/\s+/u)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

const Avatar = (props: Props<AvatarOwnProps>) => {
  const { ts } = useI18n();
  const [local, rest] = splitProps(props, ['src', 'alt', 'name', 'size', 'variant', 'status', 'class']);
  const [imgError, setImgError] = createSignal(false);

  const sizeClass = createMemo(() => sizeClassByValue[local.size ?? 'md']);
  const statusClass = createMemo(() => (local.status ? statusClassByValue[local.status] : undefined));
  const showImage = createMemo(() => Boolean(local.src) && !imgError());
  const showInitials = createMemo(() => !showImage() && Boolean(local.name));
  const fallbackLabel = createMemo(() => local.alt ?? local.name ?? ts('avatar.label'));

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div
      {...rest}
      class={classNames(styles.avatar, sizeClass(), local.variant === 'rounded' && styles.rounded, local.class)}
      role={showImage() ? undefined : 'img'}
      aria-label={showImage() ? undefined : fallbackLabel()}
    >
      <span class={styles.imageWrapper}>
        <Show when={showImage()}>
          <img class={styles.image} src={local.src} alt={local.alt ?? local.name ?? ''} onError={handleImageError} />
        </Show>
        <Show when={!showImage() && showInitials()}>
          <span class={styles.initials}>{getInitials(local.name ?? '')}</span>
        </Show>
        <Show when={!showImage() && !showInitials()}>
          <span class={styles.icon}>
            <Icon icon={FiUser} />
          </span>
        </Show>
      </span>
      <Show when={statusClass()}>{(status) => <span class={classNames(styles.status, status())} />}</Show>
    </div>
  );
};

export type { AvatarOwnProps, AvatarSize, AvatarStatus };
export default Avatar;
