import React from 'react';
import { renderIcon } from './Glyph.jsx';
import { cx } from './cx.js';
export function SectionLabel({ as: Tag = 'div', icon, end, tone, sticky = false, className, children, ...rest }) {
  return (
    <Tag className={cx('vui-section-label', tone && 'vui-section-label--' + tone, sticky && 'vui-section-label--sticky', className)} {...rest}>
      {renderIcon(icon)}
      <span className="vui-section-label__text">{children}</span>
      {end != null && <span className="vui-section-label__end">{end}</span>}
    </Tag>
  );
}
