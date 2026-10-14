import { untrack } from 'solid-js';

import { createMarqueeCopy } from './createMarqueeCopy';

export interface MarqueeCopyProps {
  source: () => HTMLElement;
  gap: number;
  version?: unknown;
}

export const MarqueeCopy = (props: MarqueeCopyProps) => {
  let copy!: HTMLDivElement;
  const initialSource = untrack(() => props.source);
  createMarqueeCopy(
    initialSource,
    () => copy,
    () => props.version,
  );
  return (
    <div
      ref={(element) => {
        copy = element;
      }}
      class="vui-marquee__group"
      style={{ gap: `${props.gap}px` }}
      aria-hidden="true"
      inert
    />
  );
};
