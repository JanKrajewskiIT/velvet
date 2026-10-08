import { safeMediaUrl } from './safeUrl';

export interface LightboxImage {
  src: string;
  thumb?: string;
  alt?: string;
  caption?: string;
  /** ImageGrid: span N×N cells. */
  span?: number;
  /** ImageGrid masonry: tile aspect-ratio, e.g. `'3 / 4'`. */
  ratio?: string;
  /** ImageGrid: floating glass label, e.g. `'Cover'`. */
  badge?: string;
}

/** Thumbnail URL, falling back to the full image when there is no usable `thumb`. */
export const thumbUrl = (image: LightboxImage): string | undefined =>
  safeMediaUrl(image.thumb) ?? safeMediaUrl(image.src);
