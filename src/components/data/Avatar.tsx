import type { I18nKey } from '@jankrajewskiit/i18n';
import { children, createSignal, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Dot } from '../primitives/Dot';

const STATUS_TONE = { online: 'success', away: 'warning', busy: 'danger', offline: 'neutral' } as const;
const SERIES_COLORS = 8;

export type AvatarStatus = keyof typeof STATUS_TONE;

const STATUS_LABEL_KEY: Record<AvatarStatus, I18nKey> = {
  online: 'velvet.data.avatar.statusOnline',
  away: 'velvet.data.avatar.statusAway',
  busy: 'velvet.data.avatar.statusBusy',
  offline: 'velvet.data.avatar.statusOffline',
};

export interface AvatarProps extends HtmlProps<HTMLSpanElement, 'color'> {
  name?: string;
  initials?: string;
  src?: string;
  /** @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** @default 'brand' */
  tone?: 'brand' | 'neutral';
  /**
   * Solid fill (any CSS colour, e.g. var(--dv-3)) with on-colour initials — series / person colour coding.
   * 'auto' = stable --dv-1…8 hue hashed from name — companies / people in lists get a consistent colour without storing one.
   */
  color?: 'auto' | (string & {});
  /** Custom content (icon, node) instead of image / initials. */
  children?: JSX.Element;
  /** Presence indicator, bottom-right. */
  status?: AvatarStatus;
}

const hashColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (seed.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  return `var(--dv-${(Math.abs(hash) % SERIES_COLORS) + 1})`;
};

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Initials or image avatar with optional presence dot. */
export const Avatar = (props: AvatarProps) => {
  const merged = mergeProps({ size: 'md', tone: 'brand' } satisfies AvatarProps, props);
  const translate = useTranslate();
  const [local, rest] = splitProps(merged, [
    'name',
    'initials',
    'src',
    'size',
    'tone',
    'color',
    'status',
    'children',
    'class',
    'style',
  ]);
  const custom = children(() => local.children);
  const [failedSrc, setFailedSrc] = createSignal<string>();

  const seed = () => local.name || local.initials || '';
  const color = () => (local.color === 'auto' ? (seed() ? hashColor(seed()) : undefined) : local.color);
  const text = () => local.initials || (local.name ? initialsOf(local.name) : '');
  const showImage = () => !!local.src && failedSrc() !== local.src;
  const style = (): JSX.CSSProperties | undefined => {
    const fill = color();
    return fill ? { '--avatar-c': fill, ...local.style } : local.style;
  };
  const faceAttributes = () => (local.status ? {} : rest);

  const face = () => (
    <span
      {...faceAttributes()}
      class={cx(
        'vui-avatar',
        local.size !== 'md' && `vui-avatar--${local.size}`,
        local.tone === 'neutral' && 'vui-avatar--neutral',
        color() && 'vui-avatar--solid',
        !local.status && local.class,
      )}
      style={style()}
      title={local.name}
    >
      <Show
        when={custom()}
        fallback={
          <Show when={showImage()} fallback={text()}>
            <img src={local.src} alt={local.name || ''} onError={() => setFailedSrc(local.src)} />
          </Show>
        }
      >
        {custom()}
      </Show>
    </span>
  );

  return (
    <Show when={local.status} fallback={face()}>
      {(status) => (
        <span {...rest} class={cx('vui-avatar-wrap', local.class)}>
          {face()}
          <Dot
            tone={STATUS_TONE[status()]}
            ring
            label={translate(STATUS_LABEL_KEY[status()])}
            class="vui-avatar__status"
          />
        </span>
      )}
    </Show>
  );
};
