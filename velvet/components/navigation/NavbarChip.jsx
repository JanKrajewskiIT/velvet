import React from 'react';
import { renderIcon } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function NavbarChip({ icon, children, onClick, href, tone = 'on-color', iconOnly = false, collapse = false, label, pressed, className, ...rest }) {
  const El = href ? 'a' : 'button';
  return (
    <El href={href} type={href ? undefined : 'button'} onClick={onClick} aria-label={label} title={label} aria-pressed={pressed} data-tone={tone} className={cx('vui-navchip', iconOnly && 'vui-navchip--icon', collapse && 'vui-navchip--collapse', className)} {...rest}>
      {renderIcon(icon)}{!iconOnly && <span className="vui-navchip__txt">{children}</span>}
    </El>
  );
}
