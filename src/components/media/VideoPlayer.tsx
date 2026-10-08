import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, For, mergeProps, onCleanup, onMount, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { type Aspect, aspectRatioValue } from './aspect';
import { nextRate, type PlaybackState, rateLabel, readPlayback, seekMedia, togglePlayback } from './playback';
import { PlayerButton } from './PlayerButton';
import { safeMediaUrl } from './safeUrl';
import { fmtTime } from './time';

const IDLE_MS = 2500;
const SEEK_SHORT_S = 5;
const SEEK_LONG_S = 10;
const VOLUME_STEP = 0.05;
const SEEK_STEP = 0.1;

export interface VideoTrack {
  src: string;
  srcLang?: string;
  label?: string;
  /** @default 'subtitles' */
  kind?: 'subtitles' | 'captions';
}

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
const percent = (value: number, total: number) => (total ? (value / total) * 100 : 0);

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
  let video!: HTMLVideoElement;
  let wrap!: HTMLDivElement;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const i18n = useI18n();
  const translate = useTranslate();
  const [state, setState] = createSignal<PlaybackState>({ playing: false, time: 0, duration: 0 });
  const [buffered, setBuffered] = createSignal(0);
  const [muted, setMuted] = createSignal(untrack(() => p.muted));
  const [volume, setVolume] = createSignal(1);
  const [rate, setRate] = createSignal(1);
  const [idle, setIdle] = createSignal(false);
  const [fullscreen, setFullscreen] = createSignal(false);
  const [captions, setCaptions] = createSignal(false);

  const tracks = createMemo(() =>
    p.tracks.flatMap((track) => {
      const src = safeMediaUrl(track.src);
      return src ? [{ ...track, src }] : [];
    }),
  );
  const level = () => (muted() ? 0 : volume());
  const speedLabel = () => rateLabel(rate(), i18n.locale());
  const sync = () => {
    setState(readPlayback(video));
    setBuffered(video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0);
  };
  const toggle = () => togglePlayback(video, p.onError);
  const seek = (seconds: number) => {
    seekMedia(video, seconds);
    sync();
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await wrap.requestFullscreen();
    } catch (error) {
      p.onError?.(error);
    }
  };
  const poke = () => {
    setIdle(false);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => setIdle(true), IDLE_MS);
  };
  const toggleCaptions = () => {
    if (tracks().length) setCaptions(!captions());
  };

  createEffect(() => {
    video.muted = muted();
    video.volume = volume();
  });
  createEffect(() => {
    video.playbackRate = rate();
  });
  createEffect(() => {
    const track = tracks().length ? video.textTracks[0] : undefined;
    if (track) track.mode = captions() ? 'showing' : 'hidden';
  });
  onMount(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === wrap);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    onCleanup(() => document.removeEventListener('fullscreenchange', onFullscreenChange));
  });
  onCleanup(() => clearTimeout(idleTimer));

  const runShortcut = (key: string): boolean => {
    switch (key) {
      case ' ':
      case 'k':
        toggle();
        return true;
      case 'arrowleft':
        seek(state().time - SEEK_SHORT_S);
        return true;
      case 'arrowright':
        seek(state().time + SEEK_SHORT_S);
        return true;
      case 'j':
        seek(state().time - SEEK_LONG_S);
        return true;
      case 'l':
        seek(state().time + SEEK_LONG_S);
        return true;
      case 'm':
        setMuted(!muted());
        return true;
      case 'f':
        void toggleFullscreen();
        return true;
      case 'c':
        toggleCaptions();
        return true;
      case 'home':
        seek(0);
        return true;
      case 'end':
        seek(state().duration);
        return true;
      default:
        return false;
    }
  };
  const onKeyDown = (e: KeyboardEvent & { target: Element }) => {
    const key = e.key.toLowerCase();
    const tag = e.target.tagName;
    if (tag === 'BUTTON' && (key === ' ' || key === 'enter')) return;
    if (tag === 'INPUT' && key.startsWith('arrow')) return;
    if (!runShortcut(key)) return;
    e.preventDefault();
    poke();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- focusable region owns the player keyboard shortcuts documented above
    <div
      ref={wrap}
      class={cx(
        'vui-player',
        state().playing && idle() && 'vui-player--idle',
        fullscreen() && 'vui-player--fs',
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
      onKeyDown={onKeyDown}
      onMouseMove={poke}
      onMouseLeave={() => state().playing && setIdle(true)}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- captions are provided by the media source; the player cannot know them */}
      <video
        ref={video}
        class="vui-player__media"
        src={safeMediaUrl(p.src)}
        poster={safeMediaUrl(p.poster)}
        autoplay={p.autoPlay}
        loop={p.loop}
        playsinline
        preload="metadata"
        onClick={toggle}
        onDblClick={() => void toggleFullscreen()}
        onPlay={sync}
        onPause={sync}
        onTimeUpdate={sync}
        onLoadedMetadata={sync}
        onProgress={sync}
        onEnded={() => {
          sync();
          p.onEnded?.();
        }}
      >
        <For each={tracks()}>
          {(track) => (
            <track kind={track.kind ?? 'subtitles'} src={track.src} srclang={track.srcLang} label={track.label} />
          )}
        </For>
      </video>
      <Show when={p.title}>{(title) => <div class="vui-player__title">{title()}</div>}</Show>
      <Show when={!state().playing}>
        <button
          type="button"
          class="vui-player__big"
          aria-label={translate('velvet.media.player.play')}
          onClick={toggle}
        >
          <Glyph name="play" />
        </button>
      </Show>
      <div class="vui-player__bar">
        <input
          type="range"
          class="vui-player__range vui-player__seek"
          min={0}
          max={state().duration}
          step={SEEK_STEP}
          value={state().time}
          onInput={(e) => seek(e.currentTarget.valueAsNumber)}
          aria-label={translate('velvet.media.player.seek')}
          aria-valuetext={translate('velvet.media.player.position', {
            time: fmtTime(state().time),
            duration: fmtTime(state().duration),
          })}
          style={{
            '--p': `${percent(state().time, state().duration)}%`,
            '--b': `${percent(buffered(), state().duration)}%`,
          }}
        />
        <div class="vui-player__row">
          <PlayerButton
            icon={state().playing ? 'pause' : 'play'}
            label={translate(
              state().playing ? 'velvet.media.videoPlayer.pauseKey' : 'velvet.media.videoPlayer.playKey',
              { key: 'k' },
            )}
            onClick={toggle}
          />
          <div class="vui-player__vol">
            <PlayerButton
              icon="volume"
              class={level() === 0 ? 'vui-player__btn--muted' : undefined}
              label={translate(muted() ? 'velvet.media.videoPlayer.unmuteKey' : 'velvet.media.videoPlayer.muteKey', {
                key: 'm',
              })}
              onClick={() => setMuted(!muted())}
            />
            <input
              type="range"
              class="vui-player__range vui-player__volume"
              min={0}
              max={1}
              step={VOLUME_STEP}
              value={level()}
              onInput={(e) => {
                const next = e.currentTarget.valueAsNumber;
                setVolume(next);
                setMuted(next === 0);
              }}
              aria-label={translate('velvet.media.player.volume')}
              aria-valuetext={`${Math.round(level() * 100)}%`}
              style={{ '--p': `${level() * 100}%` }}
            />
          </div>
          <span class="vui-player__time">
            {fmtTime(state().time)}
            <span> / {fmtTime(state().duration)}</span>
          </span>
          <span class="vui-player__sp" />
          <Show when={tracks().length > 0}>
            <PlayerButton
              label={translate('velvet.media.videoPlayer.captionsKey', { key: 'c' })}
              pressed={captions()}
              class="vui-player__btn--txt"
              onClick={toggleCaptions}
            >
              CC
            </PlayerButton>
          </Show>
          <PlayerButton
            label={translate('velvet.media.player.speed', { rate: speedLabel() })}
            class="vui-player__btn--txt"
            onClick={() => setRate(nextRate(p.rates, rate()))}
          >
            {speedLabel()}
          </PlayerButton>
          <PlayerButton
            icon="maximize"
            label={translate(
              fullscreen() ? 'velvet.media.videoPlayer.exitFullscreenKey' : 'velvet.media.videoPlayer.fullscreenKey',
              { key: 'f' },
            )}
            onClick={() => void toggleFullscreen()}
          />
        </div>
      </div>
    </div>
  );
};
