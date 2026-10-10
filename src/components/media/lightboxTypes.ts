import type { LightboxImage } from './lightboxImage';

export interface LightboxProps {
  images: readonly LightboxImage[];
  /** Index of the open image; `null` or −1 = closed. */
  index: number | null;
  onIndexChange?: (index: number) => void;
  onClose?: () => void;
}
