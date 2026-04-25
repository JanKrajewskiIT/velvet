export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Alignment = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-${Alignment}`;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VirtualElement {
  getBoundingClientRect: () => Rect;
  contextElement?: HTMLElement;
}

export type ReferenceElement = HTMLElement | VirtualElement;

export interface MiddlewareData {
  offset?: { x: number; y: number };
  flip?: { placement: Placement; overflows: number[] };
  shift?: { x: number; y: number };
  size?: { availableWidth: number; availableHeight: number };
  arrow?: { x?: number; y?: number };
  matchWidth?: { width: number };
}

export interface MiddlewareState {
  x: number;
  y: number;
  initialPlacement: Placement;
  placement: Placement;
  reference: Rect;
  floating: Rect;
  viewport: { width: number; height: number };
  middlewareData: MiddlewareData;
}

export interface MiddlewareReturn {
  x?: number;
  y?: number;
  data?: Partial<MiddlewareData>;
  reset?: { placement?: Placement };
}

export interface Middleware {
  name: string;
  fn: (state: MiddlewareState) => MiddlewareReturn;
}

export interface ComputePositionConfig {
  placement?: Placement;
  middleware?: Middleware[];
}

export interface ComputePositionResult {
  x: number;
  y: number;
  placement: Placement;
  middlewareData: MiddlewareData;
}

export const getSide = (placement: Placement): Side => placement.split('-')[0] as Side;

export const getAlignment = (placement: Placement): Alignment => {
  const part = placement.split('-')[1];
  return (part as Alignment | undefined) ?? 'center';
};

export const isVerticalSide = (side: Side): boolean => side === 'top' || side === 'bottom';
