import type { Middleware } from '../types';
import { getSide, isVerticalSide } from '../types';

export interface ArrowOptions {
  element: () => HTMLElement | undefined;
  padding?: number;
}

const arrow = (options: ArrowOptions): Middleware => ({
  name: 'arrow',
  fn(state) {
    const arrowEl = options.element();
    if (!arrowEl) return {};
    const padding = options.padding ?? 4;
    const arrowRect = arrowEl.getBoundingClientRect();
    const side = getSide(state.placement);
    const data: { x?: number; y?: number } = {};

    if (isVerticalSide(side)) {
      const refCenterX = state.reference.x + state.reference.width / 2;
      const desired = refCenterX - state.x - arrowRect.width / 2;
      const min = padding;
      const max = state.floating.width - arrowRect.width - padding;
      data.x = Math.max(min, Math.min(desired, Math.max(min, max)));
    } else {
      const refCenterY = state.reference.y + state.reference.height / 2;
      const desired = refCenterY - state.y - arrowRect.height / 2;
      const min = padding;
      const max = state.floating.height - arrowRect.height - padding;
      data.y = Math.max(min, Math.min(desired, Math.max(min, max)));
    }

    return { data: { arrow: data } };
  },
});

export default arrow;
