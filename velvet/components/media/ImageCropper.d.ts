import * as React from 'react';
/**
 * Crop an image to a fixed aspect (avatars, covers, thumbnails). The frame stays put; the image pans (drag, arrows, ⇧ for bigger steps) and zooms (Slider, wheel, + / −) behind it and can never leave a gap.
 * Rotate in 90° steps. onCropChange reports the crop in source pixels of the (rotated) image — feed it to canvas drawImage or your image service.
 */
export interface CropArea { x: number; y: number; width: number; height: number; zoom: number; rotation: number }
export interface ImageCropperProps {
  src: string;
  alt?: string;
  /** width / height. Ignored for circle. @default 1 */
  aspect?: number;
  /** circle = avatar mask (output is still the square). @default 'rect' */
  shape?: 'rect' | 'circle';
  /** Stage height px. @default 320 */
  height?: number;
  /** @default 1 */
  minZoom?: number;
  /** @default 4 */
  maxZoom?: number;
  zoom?: number;
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  onCropChange?: (area: CropArea) => void;
  /** @default true */
  rotatable?: boolean;
  className?: string;
}
export declare function ImageCropper(props: ImageCropperProps): JSX.Element;
