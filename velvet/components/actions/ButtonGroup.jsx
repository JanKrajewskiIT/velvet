import React from 'react';
import { cx } from '../primitives/cx.js';
export function ButtonGroup({ attached = true, orientation = 'horizontal', size, label, className, children, ...rest }) {
  const kids = size ? React.Children.map(children, (c) => (React.isValidElement(c) && c.props.size === undefined ? React.cloneElement(c, { size }) : c)) : children;
  return <div role="group" aria-label={label} className={cx('vui-btngroup', attached && 'vui-btngroup--attached', orientation === 'vertical' && 'vui-btngroup--vertical', className)} {...rest}>{kids}</div>;
}
