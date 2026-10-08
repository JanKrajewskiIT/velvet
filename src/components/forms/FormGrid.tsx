import { type JSX, mergeProps } from 'solid-js';

import { cx } from '../../utils/cx';
import { cssLength } from '../data/cssLength';
import type { FormGap } from './FormLayout';

export interface FormGridProps {
  /** Fixed column count; collapses to 1 under 560px. Omit to auto-fit columns of at least `minColumnWidth`. */
  columns?: 1 | 2 | 3 | 4;
  /** @default 240 */
  minColumnWidth?: number | string;
  /** @default 'md' */
  gap?: FormGap;
  class?: string;
  children?: JSX.Element;
}

/** Responsive field grid. Wrap a field in `FormSpan` to span columns. */
export const FormGrid = (props: FormGridProps) => {
  const p = mergeProps({ minColumnWidth: 240, gap: 'md' } satisfies Partial<FormGridProps>, props);
  const template = () =>
    p.columns
      ? `repeat(${p.columns},minmax(0,1fr))`
      : `repeat(auto-fit,minmax(min(100%,${cssLength(p.minColumnWidth)}),1fr))`;
  return (
    <div
      class={cx('vui-formgrid', `vui-formgrid--gap-${p.gap}`, p.columns && 'vui-formgrid--fixed', p.class)}
      style={{ 'grid-template-columns': template() }}
    >
      {p.children}
    </div>
  );
};
