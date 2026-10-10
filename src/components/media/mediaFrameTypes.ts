import type { JSX } from 'solid-js';

import type { AspectRatio } from './aspect';

export type FrameState = 'empty' | 'loading' | 'ready' | 'error';

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
