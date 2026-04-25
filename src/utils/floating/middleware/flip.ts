import type { Middleware, Placement, Side } from '../types';
import { getAlignment, getSide } from '../types';

export interface FlipOptions {
  padding?: number;
  fallbackPlacements?: Placement[];
}

const oppositeSide = (side: Side): Side => {
  if (side === 'top') return 'bottom';
  if (side === 'bottom') return 'top';
  if (side === 'left') return 'right';
  return 'left';
};

const composePlacement = (side: Side, alignment: ReturnType<typeof getAlignment>): Placement => {
  if (alignment === 'center') return side;
  return `${side}-${alignment}`;
};

const computeOverflow = (
  x: number,
  y: number,
  width: number,
  height: number,
  viewportW: number,
  viewportH: number,
  padding: number,
): number => {
  const overTop = padding - y;
  const overLeft = padding - x;
  const overRight = x + width - (viewportW - padding);
  const overBottom = y + height - (viewportH - padding);
  return Math.max(0, overTop) + Math.max(0, overLeft) + Math.max(0, overRight) + Math.max(0, overBottom);
};

const flip = (options: FlipOptions = {}): Middleware => ({
  name: 'flip',
  fn(state) {
    const padding = options.padding ?? 8;
    const initialSide = getSide(state.initialPlacement);
    const initialAlignment = getAlignment(state.initialPlacement);
    const currentSide = getSide(state.placement);

    const fallbacks: Placement[] = options.fallbackPlacements ?? [
      composePlacement(oppositeSide(initialSide), initialAlignment),
    ];

    const candidates: Placement[] = [state.initialPlacement, ...fallbacks];
    const tried = state.middlewareData.flip?.overflows ?? [];

    const currentOverflow = computeOverflow(
      state.x,
      state.y,
      state.floating.width,
      state.floating.height,
      state.viewport.width,
      state.viewport.height,
      padding,
    );

    if (currentOverflow === 0) {
      return { data: { flip: { placement: state.placement, overflows: [...tried, 0] } } };
    }

    // If we've already exhausted candidates, keep current.
    if (tried.length >= candidates.length) {
      return { data: { flip: { placement: state.placement, overflows: [...tried, currentOverflow] } } };
    }

    const nextIndex = tried.length;
    const nextPlacement = candidates[nextIndex] ?? state.placement;
    if (nextPlacement === state.placement) {
      // Skip identical re-try.
      return {
        data: {
          flip: {
            placement: state.placement,
            overflows: [...tried, currentOverflow],
          },
        },
      };
    }

    // Try the candidate; if even after we've tried all and none fit, settle on the lowest overflow.
    if (nextIndex === candidates.length - 1 && currentSide !== initialSide) {
      // We have data from previous attempts plus current; pick the best.
      const overflows = [...tried, currentOverflow];
      let bestIdx = 0;
      let bestVal = overflows[0] ?? Number.POSITIVE_INFINITY;
      for (let i = 1; i < overflows.length; i += 1) {
        const overflow = overflows[i];
        if (overflow !== undefined && overflow < bestVal) {
          bestVal = overflow;
          bestIdx = i;
        }
      }
      const bestPlacement = candidates[bestIdx] ?? state.placement;
      return {
        reset: { placement: bestPlacement },
        data: { flip: { placement: bestPlacement, overflows } },
      };
    }

    return {
      reset: { placement: nextPlacement },
      data: {
        flip: {
          placement: nextPlacement,
          overflows: [...tried, currentOverflow],
        },
      },
    };
  },
});

export default flip;
