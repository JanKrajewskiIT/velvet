import React from 'react';
import { Kbd } from '../primitives/Kbd.jsx';
import { cx } from '../primitives/cx.js';
export function Tooltip({ content, side = 'top', shortcut, open, className, children }) {
  return (
    <span className={cx('vui-tooltip-wrap', className)}>
      {children}
      <span role="tooltip" className={cx('vui-tooltip', side !== 'top' && 'vui-tooltip--' + side, open && 'vui-tooltip--open')}>
        {content}{shortcut && <Kbd plain className="vui-tooltip__kbd">{shortcut}</Kbd>}
      </span>
    </span>
  );
}
