export type FloatingSide = 'top' | 'bottom' | 'left' | 'right';
export type FloatingAlign = 'start' | 'center' | 'end';

export interface FloatingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FloatingSize {
  width: number;
  height: number;
}

export interface PlaceOptions {
  side: FloatingSide;
  align: FloatingAlign;
  /** Gap between anchor and floating box, px. */
  offset: number;
  /** Minimum distance kept from the viewport edge, px. */
  padding: number;
}

export interface Placement {
  x: number;
  y: number;
  /** Side actually used after flipping. */
  side: FloatingSide;
}

const OPPOSITE: Record<FloatingSide, FloatingSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

const isVertical = (side: FloatingSide) => side === 'top' || side === 'bottom';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));

const crossStart = (anchorStart: number, anchorSize: number, size: number, align: FloatingAlign): number => {
  if (align === 'start') return anchorStart;
  if (align === 'end') return anchorStart + anchorSize - size;
  return anchorStart + (anchorSize - size) / 2;
};

const mainStart = (anchor: FloatingBox, size: FloatingSize, side: FloatingSide, offset: number): number => {
  switch (side) {
    case 'top':
      return anchor.top - size.height - offset;
    case 'bottom':
      return anchor.top + anchor.height + offset;
    case 'left':
      return anchor.left - size.width - offset;
    case 'right':
      return anchor.left + anchor.width + offset;
  }
};

/** How far the box sticks out of the viewport along the main axis for `side`. */
const mainOverflow = (
  anchor: FloatingBox,
  size: FloatingSize,
  viewport: FloatingSize,
  side: FloatingSide,
  { offset, padding }: PlaceOptions,
): number => {
  const start = mainStart(anchor, size, side, offset);
  const length = isVertical(side) ? size.height : size.width;
  const limit = isVertical(side) ? viewport.height : viewport.width;
  return Math.max(0, padding - start) + Math.max(0, start + length - (limit - padding));
};

/**
 * Pure placement: puts a box on `side` of the anchor, flips to the opposite side when that overflows less,
 * then slides it along the cross axis to stay inside the viewport. All values are viewport coordinates.
 */
export const placeFloating = (
  anchor: FloatingBox,
  size: FloatingSize,
  viewport: FloatingSize,
  options: PlaceOptions,
): Placement => {
  const { side, align, offset, padding } = options;
  const flipped = OPPOSITE[side];
  const overflow = mainOverflow(anchor, size, viewport, side, options);
  const used = overflow > 0 && mainOverflow(anchor, size, viewport, flipped, options) < overflow ? flipped : side;

  const main = mainStart(anchor, size, used, offset);
  if (isVertical(used)) {
    const x = crossStart(anchor.left, anchor.width, size.width, align);
    return {
      side: used,
      x: clamp(x, padding, viewport.width - size.width - padding),
      y: clamp(main, padding, viewport.height - size.height - padding),
    };
  }
  const y = crossStart(anchor.top, anchor.height, size.height, align);
  return {
    side: used,
    x: clamp(main, padding, viewport.width - size.width - padding),
    y: clamp(y, padding, viewport.height - size.height - padding),
  };
};

const CONTAINING_BLOCK_PROPERTIES = ['transform', 'perspective', 'filter', 'backdropFilter'] as const;
const CONTAINING_BLOCK_WILL_CHANGE = /transform|perspective|filter/u;
const CONTAINING_BLOCK_CONTAIN = /paint|layout|strict|content/u;

const createsFixedContainingBlock = (style: CSSStyleDeclaration): boolean =>
  CONTAINING_BLOCK_PROPERTIES.some((property) => style[property] !== '' && style[property] !== 'none') ||
  CONTAINING_BLOCK_WILL_CHANGE.test(style.willChange) ||
  CONTAINING_BLOCK_CONTAIN.test(style.contain);

/**
 * Viewport position of the box that `position: fixed` resolves against for `element`. It is the viewport origin
 * unless an ancestor (transformed dialog, filtered or contained panel) establishes its own containing block.
 */
export const fixedOrigin = (element: HTMLElement): { x: number; y: number } => {
  for (let node = element.parentElement; node; node = node.parentElement) {
    if (!createsFixedContainingBlock(getComputedStyle(node))) continue;
    const rect = node.getBoundingClientRect();
    return { x: rect.left + node.clientLeft, y: rect.top + node.clientTop };
  }
  return { x: 0, y: 0 };
};
