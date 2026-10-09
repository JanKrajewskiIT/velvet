import { type Accessor, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { clamp } from '../../utils/math';
import { clampPan, type CropArea, cropAreaOf, frameSizeFor, ORIGIN, type Point, type Size } from './cropGeometry';
import { safeMediaUrl } from './safeUrl';

const DEFAULT_STAGE_WIDTH = 480;
const ROTATE_LEFT_DEGREES = 270;
const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;

export interface CropViewOptions {
  src: string;
  aspect: number;
  shape: 'rect' | 'circle';
  height: number;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  onCropChange?: (area: CropArea) => void;
}

export interface CropView {
  src: Accessor<string | undefined>;
  natural: Accessor<Size | undefined>;
  setNatural: (size: Size) => void;
  frameSize: Accessor<Size>;
  scale: Accessor<number>;
  position: Accessor<Point>;
  zoom: Accessor<number>;
  rotation: Accessor<number>;
  setZoom: (requested: number) => void;
  panTo: (point: Point) => void;
  rotateLeft: () => void;
  reset: () => void;
}

/** Zoom, rotation and pan of the image behind a fixed frame, and the reported crop area. */
export const createCropView = (options: CropViewOptions, stage: () => HTMLDivElement): CropView => {
  const [stageWidth, setStageWidth] = createSignal(DEFAULT_STAGE_WIDTH);
  const [natural, setNatural] = createSignal<Size>();
  const [zoom, setZoomValue] = createControllable({
    value: () => options.zoom,
    defaultValue: untrack(() => options.defaultZoom),
    onChange: (next) => options.onZoomChange?.(next),
  });
  const [rotation, setRotation] = createSignal(0);
  const [offset, setOffset] = createSignal<Point>(ORIGIN);

  const src = createMemo(() => safeMediaUrl(options.src));
  const frameSize = createMemo(() =>
    frameSizeFor(stageWidth(), options.height, options.shape === 'circle' ? 1 : options.aspect),
  );
  const turned = () => rotation() % HALF_TURN_DEGREES !== 0;
  const rotated = createMemo(() => {
    const size = natural();
    if (!size) return { width: 1, height: 1 };
    return turned() ? { width: size.height, height: size.width } : size;
  });
  const baseScale = () => Math.max(frameSize().width / rotated().width, frameSize().height / rotated().height);
  const scale = () => baseScale() * zoom();
  const clampOffset = (point: Point, at = scale()): Point => clampPan(point, rotated(), at, frameSize());
  const position = createMemo(() => clampOffset(offset()));

  const setZoom = (requested: number) => {
    const next = clamp(requested, options.minZoom, options.maxZoom);
    const previous = zoom();
    setOffset((current) =>
      clampOffset({ x: (current.x * next) / previous, y: (current.y * next) / previous }, baseScale() * next),
    );
    setZoomValue(next);
  };

  onMount(() => {
    const element = stage();
    setStageWidth(element.clientWidth);
    const observer = new ResizeObserver(() => setStageWidth(element.clientWidth));
    observer.observe(element);
    onCleanup(() => observer.disconnect());
  });

  createEffect(
    on(
      () => options.src,
      () => setNatural(undefined),
      { defer: true },
    ),
  );

  createEffect(() => {
    const report = options.onCropChange;
    if (!natural() || !report) return;
    const area = cropAreaOf({
      scale: scale(),
      frame: frameSize(),
      image: rotated(),
      position: position(),
      zoom: zoom(),
      rotation: rotation(),
    });
    untrack(() => report(area));
  });

  const rotateLeft = () => {
    setRotation((rotation() + ROTATE_LEFT_DEGREES) % FULL_TURN_DEGREES);
    setOffset(ORIGIN);
  };
  const reset = () => {
    setRotation(0);
    setOffset(ORIGIN);
    setZoom(1);
  };

  return {
    src,
    natural,
    setNatural,
    frameSize,
    scale,
    position,
    zoom,
    rotation,
    setZoom,
    panTo: (point) => setOffset(clampOffset(point)),
    rotateLeft,
    reset,
  };
};
