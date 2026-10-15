import { type Accessor, createContext, createMemo, mergeProps, splitProps, useContext } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import styles from './Segmented.module.css';

type SegmentedSize = NonNullable<SegmentedProps['size']>;

const DEFAULT_SEGMENTED_SIZE: SegmentedSize = 'md';
const SegmentedSizeContext = createContext<Accessor<SegmentedSize>>(() => DEFAULT_SEGMENTED_SIZE);

export const useSegmentedSize = (): Accessor<SegmentedSize> => useContext(SegmentedSizeContext);

export interface SegmentedProps extends HtmlProps<HTMLDivElement> {
  /** md = 30px items (36px track) · sm = 26px items. @default 'md' */
  size?: 'sm' | 'md';
  /** Stretch to container width; items share it equally. */
  block?: boolean;
  /** Pill track + pill items. */
  round?: boolean;
  /** Square icon-only items. */
  iconOnly?: boolean;
}

/** Sunken track holding raised, mutually-exclusive items. Owns no state — set `role` and selection yourself. */
export const Segmented = (props: SegmentedProps) => {
  const merged = mergeProps({ size: 'md' } satisfies SegmentedProps, props);
  const [local, rest] = splitProps(merged, ['size', 'block', 'round', 'iconOnly', 'class', 'children']);
  const size = createMemo(() => local.size);
  return (
    <SegmentedSizeContext.Provider value={size}>
      <div
        {...rest}
        class={cx(
          styles.segmented,
          local.size === 'sm' && styles.segmentedVariantSm,
          local.block && styles.segmentedVariantBlock,
          local.round && styles.segmentedVariantRound,
          local.iconOnly && styles.segmentedVariantIcon,
          local.class,
        )}
      >
        {local.children}
      </div>
    </SegmentedSizeContext.Provider>
  );
};
