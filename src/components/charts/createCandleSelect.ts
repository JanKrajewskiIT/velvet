import type { createLineCursor } from './createLineCursor';

type LineCursor = ReturnType<typeof createLineCursor>;

export const createCandleSelect = (cursor: LineCursor, select: (index: number) => void) => {
  const selectHovered = () => cursor.hover() >= 0 && select(cursor.hover());
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && cursor.hover() >= 0) {
      e.preventDefault();
      selectHovered();
    } else cursor.onKeyDown(e);
  };
  const onClick = (e: MouseEvent & { currentTarget: SVGSVGElement }) => {
    cursor.move(e);
    selectHovered();
  };
  return { onClick, onKeyDown } as const;
};
