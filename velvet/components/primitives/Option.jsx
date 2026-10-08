import React from 'react';
import { renderIcon } from './Glyph.jsx';
import { cx } from './cx.js';
export function Option({ icon, label, description, shortcut, selected = false, active = false, danger = false, disabled = false, showCheck = false, role = 'option', className, children, ...rest }) {
  return (
    <div role={role} aria-selected={role === 'option' ? selected : undefined} aria-checked={role === 'menuitemcheckbox' || role === 'menuitemradio' ? selected : undefined} aria-disabled={disabled || undefined} className={cx('vui-option', active && 'vui-option--active', danger && 'vui-option--danger', className)} {...rest}>
      {showCheck && <span className="vui-option__check">{selected && <i className="vui-icon icon-check" aria-hidden="true" />}</span>}
      {renderIcon(icon)}
      <span className="vui-option__label"><span>{label ?? children}</span>{description && <span className="vui-option__desc">{description}</span>}</span>
      {shortcut && <span className="vui-option__kbd">{shortcut}</span>}
    </div>
  );
}
