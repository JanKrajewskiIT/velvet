import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, Index, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { nextRate, type PlaybackState, rateLabel, readPlayback, seekMedia, togglePlayback } from './playback';
import { PlayerButton } from './PlayerButton';
import { safeMediaUrl } from './safeUrl';
import { fmtTime } from './time';
import { decorativeWaveform, resamplePeaks } from './waveform';

const DEFAULT_BARS = 72;
const COMPACT_MAX_BARS = 48;
const MIN_BAR_HEIGHT_PERCENT = 8;
const SEEK_STEPS: Record<string, number> = { ArrowLeft: -5, ArrowRight: 5, PageDown: -15, PageUp: 15 };

export interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  /** Square artwork, 56 px. */
  cover?: string;
  /** Amplitudes 0–1, any length — resampled to `bars`. */
  peaks?: readonly number[];
  /** @default 72 */
  bars?: number;
  /** Speed button cycles through these. @default [1, 1.25, 1.5, 2, 0.75] */
  rates?: readonly number[];
  /** sm = compact voice-note row. @default 'md' */
  size?: 'sm' | 'md';
  /** Receives playback failures other than interruption (autoplay policy, unsupported source). */
  onError?: (error: unknown) => void;
  class?: string;
}

/**
 * Audio row — play button, title / artist, waveform scrubber, time, speed and mute. The waveform is a role="slider":
 * click or drag to seek, ← → 5 s, PgUp / PgDn 15 s, Home / End, Space plays.
 */
export const AudioPlayer = (props: AudioPlayerProps) => {
  const p = mergeProps(
    { bars: DEFAULT_BARS, rates: [1, 1.25, 1.5, 2, 0.75], size: 'md' } satisfies Partial<AudioPlayerProps>,
    props,
  );
  let audio!: HTMLAudioElement;
  let waveform!: HTMLDivElement;
  let scrubbing = false;
  const i18n = useI18n();
  const translate = useTranslate();
  const [state, setState] = createSignal<PlaybackState>({ playing: false, time: 0, duration: 0 });
  const [rate, setRate] = createSignal(1);
  const [muted, setMuted] = createSignal(false);

  const barCount = () => (p.size === 'sm' ? Math.min(p.bars, COMPACT_MAX_BARS) : p.bars);
  const bars = createMemo(() =>
    p.peaks?.length ? resamplePeaks(p.peaks, barCount()) : decorativeWaveform(p.title || p.src, barCount()),
  );
  const progress = () => (state().duration ? state().time / state().duration : 0);
  const speedLabel = () => rateLabel(rate(), i18n.locale());
  const sync = () => setState(readPlayback(audio));
  const toggle = () => togglePlayback(audio, p.onError);
  const seek = (seconds: number) => {
    seekMedia(audio, seconds);
    sync();
  };
  const seekToPointer = (e: PointerEvent) => {
    const box = waveform.getBoundingClientRect();
    seek(((e.clientX - box.left) / box.width) * state().duration);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const step = SEEK_STEPS[e.key];
    if (step !== undefined) seek(state().time + step);
    else if (e.key === 'Home') seek(0);
    else if (e.key === 'End') seek(state().duration);
    else if (e.key === ' ') toggle();
    else return;
    e.preventDefault();
  };

  createEffect(() => {
    audio.playbackRate = rate();
  });
  createEffect(() => {
    audio.muted = muted();
  });

  return (
    <div class={cx('vui-audio', `vui-audio--${p.size}`, state().playing && 'vui-audio--playing', p.class)}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- captions are provided by the media source; the player cannot know them */}
      <audio
        ref={(element) => {
          audio = element;
        }}
        src={safeMediaUrl(p.src)}
        preload="metadata"
        onPlay={sync}
        onPause={sync}
        onTimeUpdate={sync}
        onLoadedMetadata={sync}
        onEnded={sync}
      />
      <Show when={safeMediaUrl(p.cover)}>{(cover) => <img class="vui-audio__cover" src={cover()} alt="" />}</Show>
      <button
        type="button"
        class="vui-audio__play"
        aria-label={state().playing ? translate('velvet.media.player.pause') : translate('velvet.media.player.play')}
        onClick={toggle}
      >
        <Glyph name={state().playing ? 'pause' : 'play'} />
      </button>
      <div class="vui-audio__main">
        <Show when={p.title || p.artist}>
          <div class="vui-audio__head">
            <Show when={p.title}>{(title) => <span class="vui-audio__title">{title()}</span>}</Show>
            <Show when={p.artist}>{(artist) => <span class="vui-audio__artist">{artist()}</span>}</Show>
          </div>
        </Show>
        <div class="vui-audio__track">
          <div
            ref={(element) => {
              waveform = element;
            }}
            class="vui-audio__wave"
            role="slider"
            tabIndex={0}
            aria-label={
              p.title
                ? translate('velvet.media.audioPlayer.seekTitled', { title: p.title })
                : translate('velvet.media.player.seek')
            }
            aria-valuemin={0}
            aria-valuemax={Math.round(state().duration)}
            aria-valuenow={Math.round(state().time)}
            aria-valuetext={translate('velvet.media.player.position', {
              time: fmtTime(state().time),
              duration: fmtTime(state().duration),
            })}
            onKeyDown={onKeyDown}
            onPointerDown={(e) => {
              scrubbing = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              seekToPointer(e);
            }}
            onPointerMove={(e) => {
              if (scrubbing) seekToPointer(e);
            }}
            onPointerUp={() => {
              scrubbing = false;
            }}
            onPointerCancel={() => {
              scrubbing = false;
            }}
          >
            <Index each={bars()}>
              {(peak, i) => (
                <i
                  class={i / barCount() < progress() ? 'vui-audio__bar--on' : undefined}
                  style={{ height: `${Math.max(MIN_BAR_HEIGHT_PERCENT, peak() * 100)}%` }}
                />
              )}
            </Index>
          </div>
          <span class="vui-audio__time">
            {fmtTime(state().time)} / {fmtTime(state().duration)}
          </span>
        </div>
      </div>
      <div class="vui-audio__tools">
        <PlayerButton
          label={translate('velvet.media.player.speed', { rate: speedLabel() })}
          class="vui-player__btn--txt"
          onClick={() => setRate(nextRate(p.rates, rate()))}
        >
          {speedLabel()}
        </PlayerButton>
        <PlayerButton
          icon="volume"
          label={muted() ? translate('velvet.media.player.unmute') : translate('velvet.media.player.mute')}
          pressed={muted()}
          class={muted() ? 'vui-player__btn--muted' : undefined}
          onClick={() => setMuted(!muted())}
        />
      </div>
    </div>
  );
};
