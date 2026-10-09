import { clamp } from '../../utils/math';

const FRAME_PADDING = 24;
const MIN_FRAME_SIZE = 40;

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  rotation: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export const ORIGIN: Point = { x: 0, y: 0 };

const limit = (value: number, bound: number) => clamp(value, -bound, bound);

export const frameSizeFor = (stageWidth: number, stageHeight: number, aspect: number): Size => {
  const width = Math.max(
    MIN_FRAME_SIZE,
    Math.min(stageWidth - FRAME_PADDING * 2, (stageHeight - FRAME_PADDING * 2) * aspect),
  );
  return { width, height: width / aspect };
};

/** Keeps the scaled image covering the frame. */
export const clampPan = (point: Point, image: Size, scale: number, frame: Size): Point => ({
  x: limit(point.x, (image.width * scale - frame.width) / 2),
  y: limit(point.y, (image.height * scale - frame.height) / 2),
});

export interface CropAreaInput {
  scale: number;
  frame: Size;
  image: Size;
  position: Point;
  zoom: number;
  rotation: number;
}

export const cropAreaOf = (input: CropAreaInput): CropArea => {
  const { scale, frame, image, position } = input;
  return {
    x: Math.round(((image.width * scale - frame.width) / 2 - position.x) / scale),
    y: Math.round(((image.height * scale - frame.height) / 2 - position.y) / scale),
    width: Math.round(frame.width / scale),
    height: Math.round(frame.height / scale),
    zoom: input.zoom,
    rotation: input.rotation,
  };
};
