export type { AutoUpdateOptions } from './autoUpdate';
export { default as autoUpdate } from './autoUpdate';
export { computePosition } from './computePosition';
export type { ArrowOptions } from './middleware/arrow';
export { default as arrow } from './middleware/arrow';
export type { FlipOptions } from './middleware/flip';
export { default as flip } from './middleware/flip';
export { default as matchWidth } from './middleware/matchWidth';
export type { OffsetOptions } from './middleware/offset';
export { default as offset } from './middleware/offset';
export type { ShiftOptions } from './middleware/shift';
export { default as shift } from './middleware/shift';
export type { SizeOptions } from './middleware/size';
export { default as size } from './middleware/size';
export type {
  Alignment,
  ComputePositionConfig,
  ComputePositionResult,
  Middleware,
  MiddlewareData,
  MiddlewareState,
  Placement,
  Rect,
  ReferenceElement,
  Side,
  VirtualElement,
} from './types';
export { getAlignment, getSide, isVerticalSide } from './types';
