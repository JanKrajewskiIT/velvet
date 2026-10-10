import { mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { createCropGestures } from './createCropGestures';
import { createCropView } from './createCropView';
import type { CropArea } from './cropGeometry';
import { ImageCropperBar } from './ImageCropperBar';

export type { CropArea } from './cropGeometry';

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
  /** @default 1 */
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  /** Crop in source pixels of the (rotated) image. */
  onCropChange?: (area: CropArea) => void;
  /** @default true */
  rotatable?: boolean;
  class?: string;
}

/**
 * Crop an image to a fixed aspect (avatars, covers, thumbnails). The frame stays put; the image pans (drag, arrows, ⇧ for bigger steps)
 * and zooms (Slider, wheel, + / −) behind it and can never leave a gap. Rotate in 90° steps.
 */
export const ImageCropper = (props: ImageCropperProps) => {
  const p = mergeProps(
    {
      alt: '',
      aspect: 1,
      shape: 'rect',
      height: 320,
      minZoom: 1,
      maxZoom: 4,
      defaultZoom: 1,
      rotatable: true,
    } satisfies Partial<ImageCropperProps>,
    props,
  );
  let stage!: HTMLDivElement;
  let frame!: HTMLDivElement;
  const translate = useTranslate();
  const view = createCropView(p, () => stage);
  const gestures = createCropGestures(view, { stage: () => stage, frame: () => frame });

  return (
    <div class={cx('vui-crop', p.class)}>
      <div
        ref={(element) => {
          stage = element;
        }}
        class={cx('vui-crop__stage', gestures.dragging() && 'vui-crop__stage--drag')}
        style={{ height: `${p.height}px` }}
        onPointerDown={gestures.onPointerDown}
        onPointerMove={gestures.onPointerMove}
        onPointerUp={gestures.endDrag}
        onPointerCancel={gestures.endDrag}
      >
        <Show when={view.src()}>
          {(url) => (
            <img
              src={url()}
              alt={p.alt}
              draggable={false}
              class="vui-crop__img"
              onLoad={(e) =>
                view.setNatural({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })
              }
              style={{
                width: view.natural() ? `${(view.natural()?.width ?? 0) * view.scale()}px` : undefined,
                height: view.natural() ? `${(view.natural()?.height ?? 0) * view.scale()}px` : undefined,
                visibility: view.natural() ? 'visible' : 'hidden',
                transform: `translate(calc(-50% + ${view.position().x}px), calc(-50% + ${view.position().y}px)) rotate(${view.rotation()}deg)`,
              }}
            />
          )}
        </Show>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- crop frame is a focusable group that moves and zooms the image with arrow keys */}
        <div
          ref={(element) => {
            frame = element;
          }}
          class={cx('vui-crop__frame', p.shape === 'circle' && 'vui-crop__frame--circle')}
          style={{ width: `${view.frameSize().width}px`, height: `${view.frameSize().height}px` }}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the crop frame must take focus so arrow keys can adjust the crop
          tabIndex={0}
          role="group"
          aria-label={translate('velvet.media.imageCropper.area')}
          onKeyDown={gestures.onKeyDown}
        >
          <span class="vui-crop__grid" />
        </div>
      </div>
      <ImageCropperBar view={view} rotatable={p.rotatable} minZoom={p.minZoom} maxZoom={p.maxZoom} />
    </div>
  );
};
