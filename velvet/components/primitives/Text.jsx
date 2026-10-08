import React from 'react';
import { cx } from './cx.js';
const TAGS = { 'display-lg': 'h1', 'display-md': 'h1', 'display-sm': 'h2', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', title: 'h3', kpi: 'span', overline: 'span', section: 'span', caption: 'span', label: 'span' };
const CLS = { label: 'vui-label-text', section: 'vui-section-label' };
export function Text({ as, variant = 'body', tone, truncate = false, tabular = false, mono = false, className, children, ...rest }) {
  const Tag = as || TAGS[variant] || 'p';
  return (
    <Tag className={cx('vui-text', CLS[variant] || 'vui-' + variant, tone && 'vui-text--' + tone, truncate && 'vui-text--truncate', tabular && 'vui-text--tabular', mono && 'vui-text--mono', className)} {...rest}>
      {children}
    </Tag>
  );
}
