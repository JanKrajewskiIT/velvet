import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { IconButton } from '../actions/IconButton';
import { Slider } from '../forms/Slider';
import type { CropView } from './createCropView';
import styles from './ImageCropperBar.module.css';

const ZOOM_SLIDER_STEP = 0.01;

export interface ImageCropperBarProps {
  view: CropView;
  rotatable: boolean;
  minZoom: number;
  maxZoom: number;
}

/** Rotate, zoom slider and reset controls under the crop stage. */
export const ImageCropperBar = (props: ImageCropperBarProps) => {
  const translate = useTranslate();
  return (
    <div class={styles.cropPartBar}>
      <Show when={props.rotatable}>
        <IconButton
          icon="rotate-ccw"
          label={translate('velvet.media.imageCropper.rotateLeft')}
          size="sm"
          variant="secondary"
          onClick={() => props.view.rotateLeft()}
        />
      </Show>
      <Slider
        class={styles.cropPartZoom}
        label={translate('velvet.media.imageCropper.zoom')}
        min={props.minZoom}
        max={props.maxZoom}
        step={ZOOM_SLIDER_STEP}
        value={props.view.zoom()}
        onValueChange={(value: number | [number, number]) => {
          if (typeof value === 'number') props.view.setZoom(value);
        }}
        format={(value: number) => `${Math.round(value * 100)}%`}
      />
      <IconButton
        icon="refresh"
        label={translate('velvet.media.imageCropper.reset')}
        size="sm"
        variant="ghost"
        onClick={() => props.view.reset()}
      />
    </div>
  );
};
