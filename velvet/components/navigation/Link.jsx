import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function Link({ href, variant = 'default', standalone = false, external = false, disabled = false, className, children, ...rest }) {
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a href={disabled ? undefined : href} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined}
      className={cx('vui-link', variant !== 'default' && 'vui-link--' + variant, standalone && 'vui-link--standalone', disabled && 'vui-link--disabled', className)} {...ext} {...rest}>
      {children}
      {external && <><Glyph name="external-link" className="vui-link__icon" /><span className="vui-sr-only"> (opens in new tab)</span></>}
      {standalone && !external && <Glyph name="arrow-right" className="vui-link__icon vui-link__arrow" />}
    </a>
  );
}
