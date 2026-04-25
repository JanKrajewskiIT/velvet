import type {
  ComputePositionConfig,
  ComputePositionResult,
  MiddlewareState,
  Placement,
  Rect,
  ReferenceElement,
} from './types';
import { getAlignment, getSide, isVerticalSide } from './types';

const getViewportRect = (): { width: number; height: number } => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
};

const measureReference = (reference: ReferenceElement): Rect => {
  const rect = reference.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
};

const measureFloating = (floating: HTMLElement): Rect => {
  const rect = floating.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
};

const computeBasePosition = (placement: Placement, reference: Rect, floating: Rect): { x: number; y: number } => {
  const side = getSide(placement);
  const alignment = getAlignment(placement);

  let x = 0;
  let y = 0;

  if (side === 'top') {
    y = reference.y - floating.height;
  } else if (side === 'bottom') {
    y = reference.y + reference.height;
  } else if (side === 'left') {
    x = reference.x - floating.width;
  } else {
    x = reference.x + reference.width;
  }

  if (isVerticalSide(side)) {
    if (alignment === 'start') {
      x = reference.x;
    } else if (alignment === 'end') {
      x = reference.x + reference.width - floating.width;
    } else {
      x = reference.x + (reference.width - floating.width) / 2;
    }
  } else {
    if (alignment === 'start') {
      y = reference.y;
    } else if (alignment === 'end') {
      y = reference.y + reference.height - floating.height;
    } else {
      y = reference.y + (reference.height - floating.height) / 2;
    }
  }

  return { x, y };
};

export const computePosition = (
  reference: ReferenceElement,
  floating: HTMLElement,
  config: ComputePositionConfig = {},
): ComputePositionResult => {
  const initialPlacement: Placement = config.placement ?? 'bottom-start';
  const middleware = config.middleware ?? [];

  const referenceRect = measureReference(reference);
  const floatingRect = measureFloating(floating);
  const viewport = getViewportRect();

  let placement: Placement = initialPlacement;
  let { x, y } = computeBasePosition(placement, referenceRect, floatingRect);
  const middlewareData: MiddlewareState['middlewareData'] = {};

  // Single-pass run with bounded resets to handle flip placement changes.
  let resets = 0;
  const maxResets = 4;
  let i = 0;
  while (i < middleware.length) {
    const m = middleware[i];

    if (!m) {
      i += 1;
      continue;
    }

    const state: MiddlewareState = {
      x,
      y,
      initialPlacement,
      placement,
      reference: referenceRect,
      floating: measureFloating(floating),
      viewport,
      middlewareData,
    };
    const result = m.fn(state);
    if (result.x !== undefined) x = result.x;
    if (result.y !== undefined) y = result.y;
    if (result.data) {
      Object.assign(middlewareData, result.data);
    }
    if (result.reset?.placement && result.reset.placement !== placement && resets < maxResets) {
      placement = result.reset.placement;
      const base = computeBasePosition(placement, referenceRect, measureFloating(floating));
      x = base.x;
      y = base.y;
      resets += 1;
      i = 0;
      continue;
    }
    i += 1;
  }

  return { x, y, placement, middlewareData };
};
