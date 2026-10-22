import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function PriceChange({ value, format = 'percent', digits = 2, unit, arrow = true, variant = 'text', size = 'md', flatThreshold = 0, label, className, ...rest }) {
  if (value == null || Number.isNaN(+value)) return <span className={cx('vui-pc', size !== 'md' && 'vui-pc--' + size, className)} data-dir="none" {...rest}>—</span>;
  const v = +value; const dir = Math.abs(v) <= flatThreshold ? 'flat' : v > 0 ? 'up' : 'down';
  const abs = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const sign = dir === 'up' ? '+' : dir === 'down' ? '−' : '';
  const suffix = unit != null ? unit : format === 'percent' ? '%' : format === 'bp' ? ' bp' : format === 'pp' ? ' pp' : '';
  const word = dir === 'up' ? 'up' : dir === 'down' ? 'down' : 'unchanged';
  return (
    <span className={cx('vui-pc', size !== 'md' && 'vui-pc--' + size, variant !== 'text' && 'vui-pc--' + variant, className)} data-dir={dir} aria-label={(label ? label + ' ' : '') + word + ' ' + abs + suffix} {...rest}>
      {arrow && dir !== 'flat' && <Glyph name={dir === 'up' ? 'arrow-up' : 'arrow-down'} />}
      <span aria-hidden="true">{sign}{abs}{suffix}</span>
    </span>
  );
}
