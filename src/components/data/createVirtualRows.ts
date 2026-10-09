import { createMemo } from 'solid-js';

import type { VirtualListConfig } from './virtualListTypes';

export const DEFAULT_ITEM_HEIGHT = 48;
export const DEFAULT_OVERSCAN = 6;

const positiveOr = (value: number, fallback: number) => (Number.isFinite(value) && value > 0 ? value : fallback);

export const createVirtualRows = <T>(p: VirtualListConfig<T>, scrollTop: () => number) => {
  const baseHeight = () => positiveOr(p.itemHeight, DEFAULT_ITEM_HEIGHT);
  const overscan = () => (Number.isFinite(p.overscan) && p.overscan >= 0 ? Math.floor(p.overscan) : DEFAULT_OVERSCAN);
  const gap = () => (Number.isFinite(p.gap) && p.gap >= 0 ? p.gap : 0);
  const count = () => p.items.length;

  const offsets = createMemo(() => {
    const out = new Float64Array(count() + 1);
    p.items.forEach((item, i) => {
      const height = p.getItemHeight ? p.getItemHeight(item, i) : baseHeight();
      out[i + 1] = (out[i] ?? 0) + positiveOr(height, baseHeight()) + gap();
    });
    return out;
  });
  const offsetAt = (i: number) => offsets()[i] ?? 0;

  const total = () => (count() ? offsetAt(count()) - gap() : 0);
  /** First row whose bottom edge is below `y`. */
  const rowAt = (y: number) => {
    let lo = 0;
    let hi = count();
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (offsetAt(mid + 1) <= y) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  const first = () => (count() ? rowAt(scrollTop()) : 0);
  const last = () => (count() ? rowAt(scrollTop() + p.height) : -1);
  const windowIndices = createMemo(() => {
    const start = Math.max(0, first() - overscan());
    const end = Math.min(count(), last() + 1 + overscan());
    return Array.from({ length: Math.max(0, end - start) }, (_, k) => start + k);
  });

  return { count, gap, offsetAt, total, first, last, windowIndices } as const;
};

export type VirtualRows = ReturnType<typeof createVirtualRows>;
