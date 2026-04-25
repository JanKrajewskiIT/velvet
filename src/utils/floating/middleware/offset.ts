import type { Middleware } from '../types';
import { getSide } from '../types';

export interface OffsetOptions {
  mainAxis?: number;
  crossAxis?: number;
}

const offset = (value: number | OffsetOptions = 0): Middleware => ({
  name: 'offset',
  fn(state) {
    const opts: OffsetOptions = typeof value === 'number' ? { mainAxis: value } : value;
    const mainAxis = opts.mainAxis ?? 0;
    const crossAxis = opts.crossAxis ?? 0;
    const side = getSide(state.placement);
    let dx = 0;
    let dy = 0;
    if (side === 'top') {
      dy = -mainAxis;
      dx = crossAxis;
    } else if (side === 'bottom') {
      dy = mainAxis;
      dx = crossAxis;
    } else if (side === 'left') {
      dx = -mainAxis;
      dy = crossAxis;
    } else {
      dx = mainAxis;
      dy = crossAxis;
    }
    return {
      x: state.x + dx,
      y: state.y + dy,
      data: { offset: { x: dx, y: dy } },
    };
  },
});

export default offset;
