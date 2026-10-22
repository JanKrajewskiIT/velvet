import { createSignal } from 'solid-js';

import { clamp } from '../../utils/math';
import { LINE_PAD, type LineGeometry } from './createLineGeometry';

export const createLineCursor = (
  geometry: Pick<LineGeometry, 'innerWidth' | 'lastIndex'>,
  left: number = LINE_PAD.l,
) => {
  const [rawHover, setHover] = createSignal(-1);
  const hover = () => Math.min(rawHover(), geometry.lastIndex());

  const move = (e: MouseEvent & { currentTarget: SVGSVGElement }) => {
    if (geometry.lastIndex() < 0 || geometry.innerWidth() <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - left) / geometry.innerWidth()) * geometry.lastIndex());
    setHover(clamp(i, 0, geometry.lastIndex()));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (geometry.lastIndex() < 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setHover(Math.min(geometry.lastIndex(), hover() + 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover(Math.max(0, hover() - 1));
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
