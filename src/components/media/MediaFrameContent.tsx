import { type JSX, Match, Show, Switch } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { MediaFrameProps } from './mediaFrameTypes';

const EMBED_PERMISSIONS = 'autoplay; encrypted-media; picture-in-picture; fullscreen';

interface MediaFrameContentProps {
  src: string;
  kind: NonNullable<MediaFrameProps['kind']>;
  poster: string | undefined;
  playing: boolean;
  title: string | undefined;
  alt: string;
  style: JSX.CSSProperties;
  onReady: () => void;
  onError: () => void;
}

export const MediaFrameContent = (props: MediaFrameContentProps) => {
  const translate = useTranslate();
  return (
    <Switch>
      <Match when={props.kind === 'video' && !props.playing}>
        <Show when={props.poster}>
          {(poster) => (
            <img
              class="vui-media__el"
              src={poster()}
              alt=""
              onLoad={props.onReady}
              onError={props.onError}
              style={props.style}
            />
          )}
        </Show>
      </Match>
      <Match when={props.kind === 'video'}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- captions are provided by the media source; the player cannot know them */}
        <video
          class="vui-media__el"
          src={props.src}
          controls
          autoplay
          playsinline
          onLoadedData={props.onReady}
          onError={props.onError}
          style={props.style}
        />
      </Match>
      <Match when={props.kind === 'embed'}>
        <iframe
          class="vui-media__el"
          src={props.src}
          title={props.title || props.alt || translate('velvet.media.mediaFrame.embed')}
          loading="lazy"
          allow={EMBED_PERMISSIONS}
          onLoad={props.onReady}
        />
      </Match>
      <Match when={true}>
        <img
          class="vui-media__el"
          src={props.src}
          alt={props.alt}
          loading="lazy"
          decoding="async"
          onLoad={props.onReady}
          onError={props.onError}
          style={props.style}
        />
      </Match>
    </Switch>
  );
};
