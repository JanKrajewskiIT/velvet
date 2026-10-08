import * as React from 'react';
/**
 * Video with Velvet controls over a bottom scrim: play, seek (buffered range shown), mute + volume, time, captions, speed, full screen.
 * Controls fade after 2.5 s of stillness while playing. Keyboard on the focused player: Space / K play · ← → 5 s · J / L 10 s · M mute · F full screen · C captions.
 * Same ratio scale and play button as MediaFrame — use MediaFrame kind="video" for a static thumbnail that opens a player elsewhere.
 */
export interface VideoPlayerProps {
  src: string;
  poster?: string;
  /** Shown top-left over a scrim while controls are visible; also the region label */
  title?: string;
  tracks?: Array<{ src: string; srcLang?: string; label?: string; kind?: 'subtitles' | 'captions' }>;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** --aspect-* token. @default 'video' */
  ratio?: 'video' | 'wide' | 'square' | 'photo' | 'portrait';
  /** Speed button cycles through these. @default [0.75, 1, 1.25, 1.5, 2] */
  rates?: number[];
  onEnded?: () => void;
  className?: string;
}
export declare function VideoPlayer(props: VideoPlayerProps): JSX.Element;
/** Transparent control button shared by VideoPlayer and AudioPlayer. */
export interface PlayerButtonProps { icon?: string; label: string; onClick?: () => void; pressed?: boolean; className?: string; children?: React.ReactNode }
export declare function PlayerButton(props: PlayerButtonProps): JSX.Element;
