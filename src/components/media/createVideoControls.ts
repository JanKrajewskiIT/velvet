import { useI18n } from '@jankrajewskiit/i18n';
import { createEffect, createMemo, createSignal, onCleanup, onMount, untrack } from 'solid-js';

import { reportAsyncError } from '../../utils/reportAsyncError';
import { nextRate, type PlaybackState, rateLabel, readPlayback, seekMedia, togglePlayback } from './playback';
import { safeMediaUrl } from './safeUrl';

const IDLE_MS = 2500;
const SEEK_SHORT_S = 5;
const SEEK_LONG_S = 10;

export interface VideoTrack {
  src: string;
  srcLang?: string;
  label?: string;
  /** @default 'subtitles' */
  kind?: 'subtitles' | 'captions';
}

export interface VideoControlsOptions {
  tracks: readonly VideoTrack[];
  muted: boolean;
  rates: readonly number[];
  onError?: (error: unknown) => void;
}

export type VideoControls = ReturnType<typeof createVideoControls>;

export const createVideoControls = (options: VideoControlsOptions) => {
  let video!: HTMLVideoElement;
  let wrap!: HTMLDivElement;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const i18n = useI18n();
  const [state, setState] = createSignal<PlaybackState>({ playing: false, time: 0, duration: 0 });
  const [buffered, setBuffered] = createSignal(0);
  const [muted, setMuted] = createSignal(untrack(() => options.muted));
  const [volume, setVolume] = createSignal(1);
  const [rate, setRate] = createSignal(1);
  const [idle, setIdle] = createSignal(false);
  const [fullscreen, setFullscreen] = createSignal(false);
  const [captions, setCaptions] = createSignal(false);

  const tracks = createMemo(() =>
    options.tracks.flatMap((track) => {
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
  const toggle = () => togglePlayback(video, options.onError);
  const seek = (seconds: number) => {
    seekMedia(video, seconds);
    sync();
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await wrap.requestFullscreen();
    } catch (error) {
      options.onError?.(error);
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
  const toggleMute = () => setMuted(!muted());
  const changeVolume = (next: number) => {
    setVolume(next);
    setMuted(next === 0);
  };
  const cycleRate = () => setRate(nextRate(options.rates, rate()));
  const onMouseLeave = () => state().playing && setIdle(true);

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
        toggleMute();
        return true;
      case 'f':
        void toggleFullscreen().catch(reportAsyncError);
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

  return {
    bindVideo: (element: HTMLVideoElement) => {
      video = element;
    },
    bindWrap: (element: HTMLDivElement) => {
      wrap = element;
    },
    state,
    buffered,
    muted,
    idle,
    fullscreen,
    captions,
    tracks,
    level,
    speedLabel,
    sync,
    toggle,
    seek,
    toggleFullscreen,
    poke,
    toggleCaptions,
    toggleMute,
    changeVolume,
    cycleRate,
    onMouseLeave,
    onKeyDown,
  };
};
