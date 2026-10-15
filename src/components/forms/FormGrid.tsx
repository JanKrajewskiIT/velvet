import { type JSX, mergeProps } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { cssLength } from '../data/cssLength';
import styles from './FormGrid.module.css';
import type { FormGap } from './FormLayout';

const FORMGRID_VARIANT_CLASSES = {
  sm: styles.formgridVariantGapSm,
  md: styles.formgridVariantGapMd,
  lg: styles.formgridVariantGapLg,
} as const;

export interface FormGridProps {
  /** Fixed column count; collapses to 1 under 640px. Omit to auto-fit columns of at least `minColumnWidth`. */
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
      class={cx(
        styles.formgrid,
        variantClass(FORMGRID_VARIANT_CLASSES, p.gap),
        p.columns && styles.formgridVariantFixed,
        p.class,
      )}
      style={{ '--form-grid-columns': template() }}
    >
      {p.children}
    </div>
  );
};
