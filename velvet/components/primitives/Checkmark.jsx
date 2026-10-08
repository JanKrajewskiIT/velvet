import React from 'react';
import { cx } from './cx.js';
export function Checkmark({ checked = false, indeterminate = false, radio = false, round = false, size = 'md', disabled, className, ...rest }) {
  return <span className={cx('vui-checkmark', size === 'sm' && 'vui-checkmark--sm', radio && 'vui-checkmark--radio', round && 'vui-checkmark--round', indeterminate ? 'vui-checkmark--mixed' : checked && 'vui-checkmark--on', className)} aria-hidden={rest.role ? undefined : true} aria-disabled={disabled || undefined} {...rest} />;
}
