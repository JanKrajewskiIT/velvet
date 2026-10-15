import { For, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { type Aspect, aspectRatioValue } from './aspect';
import { createVideoControls, type VideoTrack } from './createVideoControls';
import { safeMediaUrl } from './safeUrl';
import { VideoControlsBar } from './VideoControlsBar';
import styles from './VideoPlayer.module.css';

export type { VideoTrack };

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  /** Shown top-left over a scrim while controls are visible; also the region label. */
  title?: string;
  tracks?: readonly VideoTrack[];
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** --aspect-* token. @default 'video' */
  ratio?: Aspect;
  /** Speed button cycles through these. @default [0.75, 1, 1.25, 1.5, 2] */
  rates?: readonly number[];
  onEnded?: () => void;
  /** Receives playback and full-screen failures other than interruption (autoplay policy, unsupported source). */
  onError?: (error: unknown) => void;
  class?: string;
}

const NO_TRACKS: readonly VideoTrack[] = [];

/**
 * Video with Velvet controls over a bottom scrim: play, seek (buffered range shown), mute + volume, time, captions, speed, full screen.
 * Controls fade after 2.5 s of stillness while playing. Keyboard on the focused player: Space / K play · ← → 5 s · J / L 10 s · M mute · F full screen · C captions.
 */
export const VideoPlayer = (props: VideoPlayerProps) => {
  const p = mergeProps(
    {
      tracks: NO_TRACKS,
      autoPlay: false,
      muted: false,
      loop: false,
      ratio: 'video',
      rates: [0.75, 1, 1.25, 1.5, 2],
    } satisfies Partial<VideoPlayerProps>,
    props,
  );
  const translate = useTranslate();
  const controls = createVideoControls(p);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- focusable region owns the player keyboard shortcuts documented above
    <div
      ref={controls.bindWrap}
      class={cx(
        typographyClass('body'),
        styles.player,
        controls.state().playing && controls.idle() && styles.playerVariantIdle,
        controls.fullscreen() && styles.playerVariantFs,
        p.class,
      )}
      style={{ 'aspect-ratio': aspectRatioValue(p.ratio) }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the player region must take focus so its keyboard shortcuts work
      tabIndex={0}
      role="region"
      aria-label={
        p.title
          ? translate('velvet.media.videoPlayer.labelTitled', { title: p.title })
          : translate('velvet.media.videoPlayer.label')
      }
      onKeyDown={controls.onKeyDown}
      onMouseMove={controls.poke}
      onMouseLeave={controls.onMouseLeave}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- captions are provided by the media source; the player cannot know them */}
      <video
        ref={controls.bindVideo}
        class={styles.playerPartMedia}
        src={safeMediaUrl(p.src)}
        poster={safeMediaUrl(p.poster)}
        autoplay={p.autoPlay}
        loop={p.loop}
        playsinline
        preload="metadata"
        onClick={controls.toggle}
        onDblClick={() => void controls.toggleFullscreen().catch(reportAsyncError)}
        onPlay={controls.sync}
        onPause={controls.sync}
        onTimeUpdate={controls.sync}
        onLoadedMetadata={controls.sync}
        onProgress={controls.sync}
        onEnded={() => {
          controls.sync();
          p.onEnded?.();
        }}
      >
        <For each={controls.tracks()}>
          {(track) => (
            <track kind={track.kind ?? 'subtitles'} src={track.src} srclang={track.srcLang} label={track.label} />
          )}
        </For>
      </video>
      <Show when={p.title}>
        {(title) => (
          <Text as="div" variant="title" class={styles.playerPartTitle}>
            {title()}
          </Text>
        )}
      </Show>
      <Show when={!controls.state().playing}>
        <button
          type="button"
          class={styles.playerPartBig}
          aria-label={translate('velvet.media.player.play')}
          onClick={controls.toggle}
        >
          <Glyph name="play" />
        </button>
      </Show>
      <VideoControlsBar controls={controls} />
    </div>
  );
};
