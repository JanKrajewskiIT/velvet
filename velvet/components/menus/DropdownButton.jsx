import React from 'react';
import { Spinner } from '../feedback/Spinner.jsx';
import { Glyph, renderIcon } from '../primitives/Glyph.jsx';
import { Menu } from './Menu.jsx';
import { cx } from '../primitives/cx.js';
export function DropdownButton({ children, onClick, items = [], variant = 'primary', size = 'md', icon, disabled, loading, menuLabel = 'More options', className }) {
  const b = cx('vui-btn', 'vui-btn--' + variant, size !== 'md' && 'vui-btn--' + size);
  if (!onClick) {
    return <Menu align="end" items={items} className={className} trigger={<button type="button" className={b} disabled={disabled}>{renderIcon(icon)}{children}<Glyph name="chevron-down" /></button>} />;
  }
  return (
    <div className={cx('vui-btn-split', 'vui-btn-split--' + variant, className)} role="group">
      <button type="button" className={cx(b)} disabled={disabled || loading} onClick={onClick}>{loading && <Spinner size="inline" tone="current" />}{renderIcon(icon)}{children}</button>
      <Menu align="end" items={items} trigger={<button type="button" className={cx(b, 'vui-btn--icon')} aria-label={menuLabel} disabled={disabled}><Glyph name="chevron-down" /></button>} />
    </div>
  );
}
