import {
  children as resolveChildren,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  on,
  Show,
  untrack,
} from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { aspectLabel, aspectRatioValue } from './aspect';
import styles from './MediaFrame.module.css';
import { MediaFrameContent } from './MediaFrameContent';
import type { FrameState, MediaFrameProps } from './mediaFrameTypes';
import { safeEmbedUrl, safeMediaUrl } from './safeUrl';

const MEDIA_CLASSES = {
  rounded: styles.mediaVariantRounded,
  bordered: styles.mediaVariantBordered,
  sm: styles.mediaVariantSm,
  lg: styles.mediaVariantLg,
} as const;

const MEDIA_PART_FRAME_CLASSES = {
  empty: styles.mediaPartFrameVariantEmpty,
  error: styles.mediaPartFrameVariantError,
  loading: styles.mediaPartFrameVariantLoading,
} as const;

export type { MediaFrameProps } from './mediaFrameTypes';

/**
 * Fixed-ratio frame for an image, video or embed. Reserves space before load (no layout shift), shimmer while loading,
 * striped placeholder when empty or failed, glass play button over a video (with or without poster), top-right badge,
 * bottom overlay on a scrim, caption + credit. A `src` with an unsafe scheme is treated as a failed load.
 */
export const MediaFrame = (props: MediaFrameProps) => {
  const p = mergeProps(
    {
      alt: '',
      kind: 'image',
      ratio: 'video',
      fit: 'cover',
      loading: false,
      showRatio: false,
      size: 'md',
      rounded: true,
      bordered: false,
    } satisfies Partial<MediaFrameProps>,
    props,
  );
  const url = createMemo(() => (p.kind === 'embed' ? safeEmbedUrl(p.src) : safeMediaUrl(p.src)));
  const translate = useTranslate();
  const posterUrl = createMemo(() => safeMediaUrl(p.poster));
  const initialState = (): FrameState => {
    if (!p.src) return p.kind === 'video' ? 'ready' : 'empty';
    if (!url()) return 'error';
    return p.kind === 'video' && !p.poster ? 'ready' : 'loading';
  };
  const [state, setState] = createSignal<FrameState>(untrack(initialState));
  const [playing, setPlaying] = createSignal(false);
  createEffect(
    on(
      () => [p.src, p.poster, p.kind],
      () => {
        setState(initialState());
        setPlaying(false);
      },
      { defer: true },
    ),
  );

  const status = (): FrameState => (p.loading ? 'loading' : state());
  const ready = () => setState('ready');
  const failed = () => setState('error');
  const play = () => {
    setPlaying(true);
    p.onPlay?.();
    if (url()) setState('loading');
  };
  const objectStyle = (): JSX.CSSProperties => ({ 'object-fit': p.fit, 'object-position': p.position });

  const showPlay = () => p.kind === 'video' && !playing() && status() !== 'loading';
  const isEmpty = () => status() === 'error' || status() === 'empty';
  const ratioLabel = () => aspectLabel(p.ratio);
  const settled = () => status() !== 'loading';

  const custom = resolveChildren(() => p.children);
  const placeholder = resolveChildren(() => p.placeholder);
  const badge = resolveChildren(() => p.badge);
  const overlay = resolveChildren(() => p.overlay);
  const caption = resolveChildren(() => p.caption);
  const credit = resolveChildren(() => p.credit);
  const hasPlaceholder = () => placeholder.toArray().length > 0;
  const fallbackText = (): JSX.Element => {
    if (hasPlaceholder()) return placeholder();
    if (status() === 'error') return translate('velvet.media.mediaFrame.error');
    return p.showRatio ? null : translate('velvet.media.mediaFrame.empty');
  };

  return (
    <figure
      class={cx(
        styles.media,
        variantClass(MEDIA_CLASSES, p.size, 'md'),
        p.rounded && styles.mediaVariantRounded,
        p.bordered && styles.mediaVariantBordered,
        p.class,
      )}
    >
      <div
        class={cx(styles.mediaPartFrame, variantClass(MEDIA_PART_FRAME_CLASSES, status()))}
        style={{ 'aspect-ratio': aspectRatioValue(p.ratio) }}
        aria-busy={status() === 'loading' || undefined}
      >
        <Show when={state() !== 'error' && url()}>
          {(src) => (
            <MediaFrameContent
              src={src()}
              kind={p.kind}
              poster={posterUrl()}
              playing={playing()}
              title={p.title}
              alt={p.alt}
              style={objectStyle()}
              onReady={ready}
              onError={failed}
            />
          )}
        </Show>
        <Show when={isEmpty()}>
          <Show
            when={custom.toArray().length > 0}
            fallback={
              <Text as="div" variant="caption" tone="tertiary" class={styles.mediaPartFallback}>
                <Show when={!p.showRatio || hasPlaceholder()}>
                  <Glyph name="image" />
                </Show>
                <Show when={p.showRatio}>
                  <Text as="span" variant="code" tone="inherit" class={styles.mediaPartRatio}>
                    {ratioLabel()}
                  </Text>
                </Show>
                <Text as="span" variant="body-sm" tone="inherit">
                  {fallbackText()}
                </Text>
              </Text>
            }
          >
            {custom()}
          </Show>
        </Show>
        <Show when={showPlay()}>
          <button
            type="button"
            class={styles.mediaPartPlay}
            aria-label={
              p.title
                ? translate('velvet.media.mediaFrame.playTitled', { title: p.title })
                : translate('velvet.media.mediaFrame.play')
            }
            onClick={play}
          >
            <Glyph name="play" />
          </button>
        </Show>
        <Show when={settled() && badge.toArray().length > 0}>
          <Text as="span" variant="label-sm" tabular class={styles.mediaPartBadge}>
            {badge()}
          </Text>
        </Show>
        <Show when={settled() && overlay.toArray().length > 0}>
          <Text as="div" variant="label" class={styles.mediaPartOverlay}>
            {overlay()}
          </Text>
        </Show>
      </div>
      <Show when={caption.toArray().length > 0 || credit.toArray().length > 0}>
        <Text as="figcaption" variant="caption" tone="secondary" class={styles.mediaPartCaption}>
          <Text as="span" variant="caption" tone="inherit">
            {caption()}
          </Text>
          <Show when={credit.toArray().length > 0}>
            <Text as="span" variant="caption" tone="inherit" class={styles.mediaPartCredit}>
              {credit()}
            </Text>
          </Show>
        </Text>
      </Show>
    </figure>
  );
};
