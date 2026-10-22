import React from 'react';
import { cx } from '../primitives/cx.js';
export function InstrumentLabel({ symbol, name, exchange, mark, showMark = false, size = 'md', selected = false, onClick, meta, className, ...rest }) {
  const El = onClick ? 'button' : 'span';
  const initials = String(mark || symbol || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase();
  return (
    <El type={onClick ? 'button' : undefined} onClick={onClick} aria-pressed={onClick ? !!selected : undefined} className={cx('vui-inst', size !== 'md' && 'vui-inst--' + size, selected && 'vui-inst--selected', className)} {...rest}>
      {showMark && <span className="vui-inst__mark" aria-hidden="true">{typeof mark === 'object' ? mark : initials}</span>}
      <span className="vui-inst__txt">
        <span className="vui-inst__row"><span className="vui-inst__sym">{symbol}</span>{exchange && <span className="vui-inst__ex">{exchange}</span>}</span>
        {(name || meta) && <span className="vui-inst__name">{name}{name && meta ? ' · ' : ''}{meta}</span>}
      </span>
    </El>
  );
}
