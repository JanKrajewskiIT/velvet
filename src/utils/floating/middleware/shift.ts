import type { Middleware } from '../types';
import { getSide, isVerticalSide } from '../types';

export interface ShiftOptions {
  padding?: number;
}

const shift = (options: ShiftOptions = {}): Middleware => ({
  name: 'shift',
  fn(state) {
    const padding = options.padding ?? 8;
    const side = getSide(state.placement);
    let { x, y } = state;
    let shiftedX = 0;
    let shiftedY = 0;

    if (isVerticalSide(side)) {
      const minX = padding;
      const maxX = state.viewport.width - state.floating.width - padding;
      const clamped = Math.min(Math.max(x, minX), Math.max(minX, maxX));
      shiftedX = clamped - x;
      x = clamped;
    } else {
      const minY = padding;
      const maxY = state.viewport.height - state.floating.height - padding;
      const clamped = Math.min(Math.max(y, minY), Math.max(minY, maxY));
      shiftedY = clamped - y;
      y = clamped;
    }

    return {
      x,
      y,
      data: { shift: { x: shiftedX, y: shiftedY } },
    };
  },
});

export default shift;
