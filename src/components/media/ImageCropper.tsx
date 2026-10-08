import { createEffect, createMemo, createSignal, mergeProps, on, onCleanup, onMount, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { Slider } from '../forms/Slider';
import { safeMediaUrl } from './safeUrl';

const DEFAULT_STAGE_WIDTH = 480;
const FRAME_PADDING = 24;
const MIN_FRAME_SIZE = 40;
const WHEEL_ZOOM_SENSITIVITY = 0.0015;
const KEY_ZOOM_STEP = 0.1;
const KEY_PAN_STEP = 10;
const KEY_PAN_STEP_LARGE = 40;
const ZOOM_SLIDER_STEP = 0.01;
const ROTATE_LEFT_DEGREES = 270;
const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  rotation: number;
}

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

interface Point {
  x: number;
  y: number;
}

interface DragStart {
  pointer: Point;
  offset: Point;
}

const limit = (value: number, bound: number) => Math.max(-bound, Math.min(bound, value));
const ORIGIN: Point = { x: 0, y: 0 };

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
  let drag: DragStart | undefined;
  const translate = useTranslate();
  const [stageWidth, setStageWidth] = createSignal(DEFAULT_STAGE_WIDTH);
  const [natural, setNatural] = createSignal<{ width: number; height: number }>();
  const [zoom, setZoomValue] = createControllable({
    value: () => props.zoom,
    defaultValue: untrack(() => p.defaultZoom),
    onChange: (next) => props.onZoomChange?.(next),
  });
  const [rotation, setRotation] = createSignal(0);
  const [offset, setOffset] = createSignal<Point>(ORIGIN);
  const [dragging, setDragging] = createSignal(false);

  const src = createMemo(() => safeMediaUrl(p.src));
  const frameAspect = () => (p.shape === 'circle' ? 1 : p.aspect);
  const frameSize = createMemo(() => {
    const width = Math.max(
      MIN_FRAME_SIZE,
      Math.min(stageWidth() - FRAME_PADDING * 2, (p.height - FRAME_PADDING * 2) * frameAspect()),
    );
    return { width, height: width / frameAspect() };
  });
  const turned = () => rotation() % HALF_TURN_DEGREES !== 0;
  const rotated = createMemo(() => {
    const size = natural();
    if (!size) return { width: 1, height: 1 };
    return turned() ? { width: size.height, height: size.width } : size;
  });
  const baseScale = () => Math.max(frameSize().width / rotated().width, frameSize().height / rotated().height);
  const scale = () => baseScale() * zoom();
  const clampOffset = (point: Point, at = scale()): Point => ({
    x: limit(point.x, (rotated().width * at - frameSize().width) / 2),
    y: limit(point.y, (rotated().height * at - frameSize().height) / 2),
  });
  const position = createMemo(() => clampOffset(offset()));

  const setZoom = (requested: number) => {
    const next = Math.max(p.minZoom, Math.min(p.maxZoom, requested));
    const previous = zoom();
    setOffset((current) =>
      clampOffset({ x: (current.x * next) / previous, y: (current.y * next) / previous }, baseScale() * next),
    );
    setZoomValue(next);
  };

  onMount(() => {
    setStageWidth(stage.clientWidth);
    const observer = new ResizeObserver(() => setStageWidth(stage.clientWidth));
    observer.observe(stage);
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(zoom() * (1 - e.deltaY * WHEEL_ZOOM_SENSITIVITY));
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    onCleanup(() => {
      observer.disconnect();
      stage.removeEventListener('wheel', onWheel);
    });
  });

  createEffect(
    on(
      () => p.src,
      () => setNatural(undefined),
      { defer: true },
    ),
  );

  createEffect(() => {
    const report = props.onCropChange;
    if (!natural() || !report) return;
    const at = scale();
    const { width: fw, height: fh } = frameSize();
    const { width: rw, height: rh } = rotated();
    const { x, y } = position();
    const area: CropArea = {
      x: Math.round(((rw * at - fw) / 2 - x) / at),
      y: Math.round(((rh * at - fh) / 2 - y) / at),
      width: Math.round(fw / at),
      height: Math.round(fh / at),
      zoom: zoom(),
      rotation: rotation(),
    };
    untrack(() => report(area));
  });

  const endDrag = () => {
    drag = undefined;
    setDragging(false);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.shiftKey ? KEY_PAN_STEP_LARGE : KEY_PAN_STEP;
    const pan: Record<string, Point | undefined> = {
      ArrowLeft: { x: step, y: 0 },
      ArrowRight: { x: -step, y: 0 },
      ArrowUp: { x: 0, y: step },
      ArrowDown: { x: 0, y: -step },
    };
    const move = pan[e.key];
    if (move) setOffset(clampOffset({ x: position().x + move.x, y: position().y + move.y }));
    else if (e.key === '+' || e.key === '=') setZoom(zoom() + KEY_ZOOM_STEP);
    else if (e.key === '-') setZoom(zoom() - KEY_ZOOM_STEP);
    else return;
    e.preventDefault();
  };
  const reset = () => {
    setRotation(0);
    setOffset(ORIGIN);
    setZoom(1);
  };

  return (
    <div class={cx('vui-crop', p.class)}>
      <div
        ref={stage}
        class={cx('vui-crop__stage', dragging() && 'vui-crop__stage--drag')}
        style={{ height: `${p.height}px` }}
        onPointerDown={(e) => {
          if (e.button) return;
          drag = { pointer: { x: e.clientX, y: e.clientY }, offset: position() };
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          frame.focus({ preventScroll: true });
        }}
        onPointerMove={(e) => {
          if (!drag) return;
          setOffset(
            clampOffset({
              x: drag.offset.x + e.clientX - drag.pointer.x,
              y: drag.offset.y + e.clientY - drag.pointer.y,
            }),
          );
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <Show when={src()}>
          {(url) => (
            <img
              src={url()}
              alt={p.alt}
              draggable={false}
              class="vui-crop__img"
              onLoad={(e) => setNatural({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
              style={{
                width: natural() ? `${(natural()?.width ?? 0) * scale()}px` : undefined,
                height: natural() ? `${(natural()?.height ?? 0) * scale()}px` : undefined,
                visibility: natural() ? 'visible' : 'hidden',
                transform: `translate(calc(-50% + ${position().x}px), calc(-50% + ${position().y}px)) rotate(${rotation()}deg)`,
              }}
            />
          )}
        </Show>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- crop frame is a focusable group that moves and zooms the image with arrow keys */}
        <div
          ref={frame}
          class={cx('vui-crop__frame', p.shape === 'circle' && 'vui-crop__frame--circle')}
          style={{ width: `${frameSize().width}px`, height: `${frameSize().height}px` }}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the crop frame must take focus so arrow keys can adjust the crop
          tabIndex={0}
          role="group"
          aria-label={translate('velvet.media.imageCropper.area')}
          onKeyDown={onKeyDown}
        >
          <span class="vui-crop__grid" />
        </div>
      </div>
      <div class="vui-crop__bar">
        <Show when={p.rotatable}>
          <IconButton
            icon="rotate-ccw"
            label={translate('velvet.media.imageCropper.rotateLeft')}
            size="sm"
            variant="secondary"
            onClick={() => {
              setRotation((rotation() + ROTATE_LEFT_DEGREES) % FULL_TURN_DEGREES);
              setOffset(ORIGIN);
            }}
          />
        </Show>
        <Slider
          class="vui-crop__zoom"
          label={translate('velvet.media.imageCropper.zoom')}
          min={p.minZoom}
          max={p.maxZoom}
          step={ZOOM_SLIDER_STEP}
          value={zoom()}
          onValueChange={(value: number | [number, number]) => {
            if (typeof value === 'number') setZoom(value);
          }}
          format={(value: number) => `${Math.round(value * 100)}%`}
        />
        <IconButton
          icon="refresh"
          label={translate('velvet.media.imageCropper.reset')}
          size="sm"
          variant="ghost"
          onClick={reset}
        />
      </div>
    </div>
  );
};
