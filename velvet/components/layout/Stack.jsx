import React from 'react';
import { cx } from '../primitives/cx.js';
const sp = (g) => (typeof g === 'number' ? 'var(--space-' + g + ')' : g);
export function Stack({ as: El = 'div', direction = 'column', gap = 4, align, justify, wrap = false, divider = false, className, style, children, ...rest }) {
  return <El className={cx('vui-stack', divider && 'vui-stack--divided', className)} style={{ flexDirection: direction, gap: sp(gap), alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined, ...style }} {...rest}>{children}</El>;
}
export function Grid({ as: El = 'div', columns = 3, min, gap = 4, className, style, children, ...rest }) {
  const tpl = min ? 'repeat(auto-fill, minmax(min(' + (typeof min === 'number' ? min + 'px' : min) + ', 100%), 1fr))' : 'repeat(' + columns + ', minmax(0, 1fr))';
  return <El className={cx('vui-grid-layout', !min && 'vui-grid-layout--fixed', className)} style={{ gridTemplateColumns: tpl, gap: sp(gap), ...style }} {...rest}>{children}</El>;
}
