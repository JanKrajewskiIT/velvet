import { mergeProps, splitProps } from 'solid-js';

import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';

const GLYPH = { down: 'chevron-down', right: 'chevron-right', left: 'chevron-left', up: 'chevron-up' } as const;

export type ChevronDirection = keyof typeof GLYPH;

export interface ChevronProps extends HtmlProps<HTMLElement> {
  /** Resting direction. down = dropdowns/accordions · right = nested navigation. @default 'down' */
  direction?: ChevronDirection;
  /** Rotated "open" state. */
  open?: boolean;
}

/** Decorative disclosure arrow; the host carries `aria-expanded`. */
export const Chevron = (props: ChevronProps) => {
  const merged = mergeProps({ direction: 'down' } satisfies ChevronProps, props);
  const [local, rest] = splitProps(merged, ['direction', 'open', 'class']);
  return (
    <i
      class={cx(
        'vui-icon',
        `icon-${GLYPH[local.direction]}`,
        'vui-chevron',
        `vui-chevron--${local.direction}`,
        local.open && 'vui-chevron--open',
        local.class,
      )}
      aria-hidden="true"
      {...rest}
    />
  );
};
