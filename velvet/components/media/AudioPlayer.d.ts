import * as React from 'react';
/**
 * Audio row — play button, title / artist, waveform scrubber, time, speed and mute. The waveform is a role="slider":
 * click or drag to seek, ← → 5 s, PgUp / PgDn 15 s, Home / End, Space plays. Pass real peaks (0–1) from your backend;
 * without them a stable decorative waveform is derived from the title. Voice notes, podcasts, interview recordings.
 */
export interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  /** Square artwork, 56 px */
  cover?: string;
  /** Amplitudes 0–1, any length — resampled to `bars` */
  peaks?: number[];
  /** @default 72 */
  bars?: number;
  /** @default [1, 1.25, 1.5, 2, 0.75] */
  rates?: number[];
  /** sm = compact voice-note row. @default 'md' */
  size?: 'sm' | 'md';
  className?: string;
}
export declare function AudioPlayer(props: AudioPlayerProps): JSX.Element;
