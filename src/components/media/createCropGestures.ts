import { type Accessor, createSignal, type JSX, onCleanup, onMount } from 'solid-js';

import type { CropView } from './createCropView';
import type { Point } from './cropGeometry';

const WHEEL_ZOOM_SENSITIVITY = 0.0015;
const KEY_ZOOM_STEP = 0.1;
const KEY_PAN_STEP = 10;
const KEY_PAN_STEP_LARGE = 40;

interface DragStart {
  pointer: Point;
  offset: Point;
}

export interface CropElements {
  stage: () => HTMLDivElement;
  frame: () => HTMLDivElement;
}

export interface CropGestures {
  dragging: Accessor<boolean>;
  onPointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent>;
  onPointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent>;
  endDrag: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

/** Drag-to-pan, wheel zoom and arrow / +/- keys on a crop view. */
export const createCropGestures = (view: CropView, elements: CropElements): CropGestures => {
  let drag: DragStart | undefined;
  const [dragging, setDragging] = createSignal(false);

  onMount(() => {
    const stage = elements.stage();
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      view.setZoom(view.zoom() * (1 - e.deltaY * WHEEL_ZOOM_SENSITIVITY));
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    onCleanup(() => stage.removeEventListener('wheel', onWheel));
  });

  const endDrag = () => {
    drag = undefined;
    setDragging(false);
  };
  const onPointerDown: CropGestures['onPointerDown'] = (e) => {
    if (e.button) return;
    drag = { pointer: { x: e.clientX, y: e.clientY }, offset: view.position() };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    elements.frame().focus({ preventScroll: true });
  };
  const onPointerMove: CropGestures['onPointerMove'] = (e) => {
    if (!drag) return;
    view.panTo({
      x: drag.offset.x + e.clientX - drag.pointer.x,
      y: drag.offset.y + e.clientY - drag.pointer.y,
    });
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
    if (move) view.panTo({ x: view.position().x + move.x, y: view.position().y + move.y });
    else if (e.key === '+' || e.key === '=') view.setZoom(view.zoom() + KEY_ZOOM_STEP);
    else if (e.key === '-') view.setZoom(view.zoom() - KEY_ZOOM_STEP);
    else return;
    e.preventDefault();
  };

  return { dragging, onPointerDown, onPointerMove, endDrag, onKeyDown };
};
