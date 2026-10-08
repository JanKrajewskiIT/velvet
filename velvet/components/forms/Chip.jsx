import React from 'react';
import { Glyph, renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Chip({ selected, icon, count, color, dashed = false, size = 'md', check = true, role, className, style, children, ...rest }) {
  const on = !!selected;
  const sel = selected === undefined ? {} : role === 'radio' || role === 'checkbox' || role === 'option' ? { 'aria-checked': on } : { 'aria-pressed': on };
  return (
    <button type="button" role={role} {...sel} className={cx('vui-chip', size === 'sm' && 'vui-chip--sm', on && 'vui-chip--on', color && 'vui-chip--color', dashed && 'vui-chip--dashed', className)} style={color ? { ...style, '--chip-c': color } : style} {...rest}>
      {color ? <span className="vui-chip__swatch" aria-hidden="true">{on && <Glyph name="check" />}</span> : check && <span className="vui-chip__check" aria-hidden="true"><Glyph name="check" /></span>}
      {!(check && on && !color) && renderIcon(icon)}
      {children}
      {count != null && <span className="vui-chip__count">{count}</span>}
    </button>
  );
}
