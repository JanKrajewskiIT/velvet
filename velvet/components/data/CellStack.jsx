import React from 'react';
import { cx } from '../primitives/cx.js';
export function CellStack({ primary, secondary, mono = false, secondaryMono = false, leading, trailing, align = 'left', strong = true, className, ...rest }) {
  return (
    <span className={cx('vui-cellstack', align === 'right' && 'vui-cellstack--end', className)} {...rest}>
      {leading && <span className="vui-cellstack__lead">{leading}</span>}
      <span className="vui-cellstack__txt">
        <span className={cx('vui-cellstack__p', mono && 'vui-cellstack--mono', strong && 'vui-cellstack__p--strong')}>{primary}</span>
        {secondary != null && secondary !== '' && <span className={cx('vui-cellstack__s', secondaryMono && 'vui-cellstack--mono')}>{secondary}</span>}
      </span>
      {trailing && <span className="vui-cellstack__trail">{trailing}</span>}
    </span>
  );
}
