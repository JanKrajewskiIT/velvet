import { createSignal } from 'solid-js';

import { clamp } from '../../utils/math';
import { LINE_PAD, type LineGeometry } from './createLineGeometry';

export const createLineCursor = (geometry: Pick<LineGeometry, 'innerWidth' | 'lastIndex'>) => {
  const [hover, setHover] = createSignal(-1);

  const move = (e: MouseEvent & { currentTarget: SVGSVGElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - LINE_PAD.l) / geometry.innerWidth()) * geometry.lastIndex());
    setHover(clamp(i, 0, geometry.lastIndex()));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHover((h) => Math.min(geometry.lastIndex(), h + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover((h) => Math.max(0, h - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setHover(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setHover(geometry.lastIndex());
    } else if (e.key === 'Escape') setHover(-1);
  };
  const focus = () => hover() < 0 && setHover(geometry.lastIndex());
  const clear = () => setHover(-1);

  return { hover, move, onKeyDown, focus, clear } as const;
};
