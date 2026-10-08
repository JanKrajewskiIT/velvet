import React from 'react';
import { cx } from './cx.js';
export function Surface({ as: Tag = 'div', variant = 'default', padding = 'none', tone, accent = false, hoverable = false, interactive = false, tonal = false, reveal, selected = false, clip = false, style, className, children, ...rest }) {
  const lifts = hoverable || interactive || tonal;
  return (
    <Tag className={cx('vui-surface', variant !== 'default' && 'vui-surface--' + variant, padding !== 'none' && 'vui-surface--pad-' + padding, accent && 'vui-surface--accent', lifts && 'vui-surface--hoverable', interactive && 'vui-surface--interactive', tonal && 'vui-surface--tonal', reveal != null && reveal !== false && 'vui-reveal', selected && 'vui-surface--selected', clip && 'vui-surface--clip', className)} data-tone={tone} style={typeof reveal === 'number' ? { '--i': reveal, ...style } : style} tabIndex={interactive && Tag === 'div' ? 0 : undefined} {...rest}>
      {children}
    </Tag>
  );
}
