import type { Middleware } from '../types';
import { getSide, isVerticalSide } from '../types';

export interface SizeOptions {
  padding?: number;
  /**
   * Apply available width/height to the floating element via inline styles.
   * If false, the values are exposed via middlewareData.size only.
   */
  apply?: 'width' | 'height' | 'both' | 'none';
}

const size = (options: SizeOptions = {}): Middleware => ({
  name: 'size',
  fn(state) {
    const padding = options.padding ?? 8;
    const side = getSide(state.placement);

    let availableHeight = state.viewport.height - 2 * padding;
    let availableWidth = state.viewport.width - 2 * padding;

    if (isVerticalSide(side)) {
      if (side === 'bottom') {
        availableHeight = state.viewport.height - state.reference.y - state.reference.height - padding;
      } else {
        availableHeight = state.reference.y - padding;
      }
    } else {
      if (side === 'right') {
        availableWidth = state.viewport.width - state.reference.x - state.reference.width - padding;
      } else {
        availableWidth = state.reference.x - padding;
      }
    }

    availableHeight = Math.max(0, availableHeight);
    availableWidth = Math.max(0, availableWidth);

    return {
      data: { size: { availableWidth, availableHeight } },
    };
  },
});

export default size;
