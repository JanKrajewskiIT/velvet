import {
  children as resolveChildren,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  Match,
  mergeProps,
  on,
  Show,
  Switch,
  untrack,
} from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx, modifier } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { aspectLabel, type AspectRatio, aspectRatioValue } from './aspect';
import { safeEmbedUrl, safeMediaUrl } from './safeUrl';

type FrameState = 'empty' | 'loading' | 'ready' | 'error';

const EMBED_PERMISSIONS = 'autoplay; encrypted-media; picture-in-picture; fullscreen';

export interface MediaFrameProps {
  src?: string;
  /** Required for meaningful images; `''` marks decorative. @default '' */
  alt?: string;
  /** @default 'image' */
  kind?: 'image' | 'video' | 'embed';
  /** Video only — still frame shown until play. */
  poster?: string;
  /** Token name or any CSS ratio ("4/5"). @default 'video' */
  ratio?: AspectRatio;
  /** @default 'cover' */
  fit?: 'cover' | 'contain';
  /** object-position, e.g. "top" or "30% 50%" for focal point. */
  position?: string;
  caption?: JSX.Element;
  credit?: JSX.Element;
  /** Bottom content on a scrim — title, author. */
  overlay?: JSX.Element;
  /** Small pill top-right — duration, "Live", count. */
  badge?: JSX.Element;
  /** Force the shimmer (data still fetching). @default false */
  loading?: boolean;
  /** Text in the empty placeholder. */
  placeholder?: JSX.Element;
  /** Print the ratio ("16 : 9") in the empty placeholder — for layout specs. @default false */
  showRatio?: boolean;
  /** Play button size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default true */
  rounded?: boolean;
  /** @default false */
  bordered?: boolean;
  /** Accessible name for video/embed. */
  title?: string;
  onPlay?: () => void;
  /** Custom fallback shown when empty or on error. */
  children?: JSX.Element;
  class?: string;
}

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
        'vui-media',
        modifier('vui-media', p.size, 'md'),
        p.rounded && 'vui-media--rounded',
        p.bordered && 'vui-media--bordered',
        p.class,
      )}
    >
      <div
        class={cx('vui-media__frame', `vui-media__frame--${status()}`)}
        style={{ 'aspect-ratio': aspectRatioValue(p.ratio) }}
        aria-busy={status() === 'loading' || undefined}
      >
        <Show when={state() !== 'error' && url()}>
          {(src) => (
            <Switch>
              <Match when={p.kind === 'video' && !playing()}>
                <Show when={posterUrl()}>
                  {(poster) => (
                    <img
                      class="vui-media__el"
                      src={poster()}
                      alt=""
                      onLoad={ready}
                      onError={failed}
                      style={objectStyle()}
                    />
                  )}
                </Show>
              </Match>
              <Match when={p.kind === 'video'}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption -- captions are provided by the media source; the player cannot know them */}
                <video
                  class="vui-media__el"
                  src={src()}
                  controls
                  autoplay
                  playsinline
                  onLoadedData={ready}
                  onError={failed}
                  style={objectStyle()}
                />
              </Match>
              <Match when={p.kind === 'embed'}>
                <iframe
                  class="vui-media__el"
                  src={src()}
                  title={p.title || p.alt || translate('velvet.media.mediaFrame.embed')}
                  loading="lazy"
                  allow={EMBED_PERMISSIONS}
                  onLoad={ready}
                />
              </Match>
              <Match when={true}>
                <img
                  class="vui-media__el"
                  src={src()}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  onLoad={ready}
                  onError={failed}
                  style={objectStyle()}
                />
              </Match>
            </Switch>
          )}
        </Show>
        <Show when={isEmpty()}>
          <Show
            when={custom.toArray().length > 0}
            fallback={
              <div class="vui-media__fallback">
                <Show when={!p.showRatio || hasPlaceholder()}>
                  <Glyph name="image" />
                </Show>
                <Show when={p.showRatio}>
                  <span class="vui-media__ratio">{ratioLabel()}</span>
                </Show>
                <span>{fallbackText()}</span>
              </div>
            }
          >
            {custom()}
          </Show>
        </Show>
        <Show when={showPlay()}>
          <button
            type="button"
            class="vui-media__play"
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
          <span class="vui-media__badge">{badge()}</span>
        </Show>
        <Show when={settled() && overlay.toArray().length > 0}>
          <div class="vui-media__overlay">{overlay()}</div>
        </Show>
      </div>
      <Show when={caption.toArray().length > 0 || credit.toArray().length > 0}>
        <figcaption class="vui-media__caption">
          <span>{caption()}</span>
          <Show when={credit.toArray().length > 0}>
            <span class="vui-media__credit">{credit()}</span>
          </Show>
        </figcaption>
      </Show>
    </figure>
  );
};
