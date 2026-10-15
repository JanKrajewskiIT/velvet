import { type JSX, mergeProps } from 'solid-js';

import { cx } from '../../utils/cx';
import styles from './FormSpan.module.css';

export interface FormSpanProps {
  /** Columns to span, or `'full'`. @default 'full' */
  span?: number | 'full';
  class?: string;
  children?: JSX.Element;
}

/** Cell of a `FormGrid` that spans several columns. */
export const FormSpan = (props: FormSpanProps) => {
  const p = mergeProps({ span: 'full' } satisfies Partial<FormSpanProps>, props);
  return (
    <div
      class={cx(styles.formspan, p.class)}
      style={{ '--form-column-span': p.span === 'full' ? '1 / -1' : `span ${p.span}` }}
    >
      {p.children}
    </div>
  );
};
