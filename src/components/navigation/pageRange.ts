export const PAGE_GAP = '…';

export type PageRangeItem = number | typeof PAGE_GAP;

const sequence = (length: number, start = 1): number[] => Array.from({ length }, (_, i) => start + i);

/** Page numbers to show (`1 … 4 5 6 … 20`); `PAGE_GAP` marks each truncated stretch. */
export const pageRange = (page: number, count: number, siblings = 1): PageRangeItem[] => {
  const slots = siblings * 2 + 5;
  if (count <= slots) return sequence(count);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, count);
  const gapLeft = left > 2;
  const gapRight = right < count - 1;
  const edge = 3 + siblings * 2;
  if (!gapLeft && gapRight) return [...sequence(edge), PAGE_GAP, count];
  if (gapLeft && !gapRight) return [1, PAGE_GAP, ...sequence(edge, count - edge + 1)];
  return [1, PAGE_GAP, ...sequence(right - left + 1, left), PAGE_GAP, count];
};
