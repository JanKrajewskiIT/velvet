import React from 'react';
import { cx } from './cx.js';
const GLYPH = { down: 'chevron-down', right: 'chevron-right', left: 'chevron-left', up: 'chevron-up' };
export function Chevron({ direction = 'down', open = false, className, ...rest }) {
  return <i className={cx('vui-icon', 'icon-' + GLYPH[direction], 'vui-chevron', 'vui-chevron--' + direction, open && 'vui-chevron--open', className)} aria-hidden="true" {...rest} />;
}
