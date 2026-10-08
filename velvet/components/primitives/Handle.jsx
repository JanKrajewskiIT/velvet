import React from 'react';
import { Glyph } from './Glyph.jsx';
import { cx } from './cx.js';
export function Handle({ label = 'Drag to reorder', decorative = false, icon = 'grip-vertical', className, ...rest }) {
  if (decorative) return <span className={cx('vui-handle', 'vui-handle--decorative', className)} aria-hidden="true" {...rest}><Glyph name={icon} /></span>;
  return <button type="button" className={cx('vui-handle', className)} aria-label={label} {...rest}><Glyph name={icon} /></button>;
}
