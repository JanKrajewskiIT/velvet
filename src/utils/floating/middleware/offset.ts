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
    const [dx, dy] =
      side === 'top'
        ? [crossAxis, -mainAxis]
        : side === 'bottom'
          ? [crossAxis, mainAxis]
          : side === 'left'
            ? [-mainAxis, crossAxis]
            : [mainAxis, crossAxis];

    return {
      x: state.x + dx,
      y: state.y + dy,
      data: { offset: { x: dx, y: dy } },
    };
  },
});

export default offset;
