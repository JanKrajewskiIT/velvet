import * as React from 'react';
/**
 * Fixed-ratio frame for an image, video or embed. Reserves space before load (no layout shift), shimmer while loading,
 * striped placeholder when empty or failed, glass play button over a video (with or without poster), top-right badge
 * (duration, "Live"), bottom overlay on a scrim, caption + credit. Ratios come from --aspect-*, styling from --media-*.
 */
export interface MediaFrameProps {
  src?: string;
  /** Required for meaningful images; '' marks decorative */
  alt?: string;
  /** @default 'image' */
  kind?: 'image' | 'video' | 'embed';
  /** Video only — still frame shown until play */
  poster?: string;
  /** Token name or any CSS ratio ("4/5"). @default 'video' */
  ratio?: 'square' | 'video' | 'photo' | 'portrait' | 'wide' | string;
  /** @default 'cover' */
  fit?: 'cover' | 'contain';
  /** object-position, e.g. "top" or "30% 50%" for focal point */
  position?: string;
  caption?: React.ReactNode;
  credit?: React.ReactNode;
  /** Bottom content on a scrim — title, author */
  overlay?: React.ReactNode;
  /** Small pill top-right — duration, "Live", count */
  badge?: React.ReactNode;
  /** Force the shimmer (data still fetching) */
  loading?: boolean;
  /** Text in the empty placeholder */
  placeholder?: React.ReactNode;
  /** Print the ratio ("16 : 9") in the empty placeholder — for layout specs */
  showRatio?: boolean;
  /** Play button size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default true */
  rounded?: boolean;
  bordered?: boolean;
  /** Accessible name for video/embed */
  title?: string;
  onPlay?: () => void;
  /** Custom fallback shown when empty or on error */
  children?: React.ReactNode;
  className?: string;
}
export declare function MediaFrame(props: MediaFrameProps): JSX.Element;
