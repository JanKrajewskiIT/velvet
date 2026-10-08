import React from 'react';
import { Glyph } from './Glyph.jsx';
import { cx } from './cx.js';
const BASE = { button: 'vui-btn vui-btn--ghost vui-btn--icon', field: 'vui-control__btn', tag: 'vui-tag__remove', bare: null };
export function CloseButton({ variant = 'button', size = 'sm', label = 'Close', icon = 'x', as = 'button', onClick, className, ...rest }) {
  const cls = cx(BASE[variant], variant === 'button' && size !== 'md' && 'vui-btn--' + size, className);
  if (as === 'span') {
    const fire = (e) => { e.stopPropagation(); onClick && onClick(e); };
    return <span role="button" tabIndex={0} aria-label={label} className={cls} onClick={fire} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(e); } }} {...rest}><Glyph name={icon} /></span>;
  }
  return <button type="button" aria-label={label} className={cls} onClick={onClick} {...rest}><Glyph name={icon} /></button>;
}
