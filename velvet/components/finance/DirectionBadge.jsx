import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const MAP = { LONG: ['up', 'arrow-up'], BUY: ['up', 'arrow-up'], ADD: ['up', 'plus'], SHORT: ['down', 'arrow-down'], SELL: ['down', 'arrow-down'], TRIM: ['down', 'minus'], WAIT: ['flat', 'clock'], HOLD: ['flat', 'pause'], NO_TRADE: ['off', 'x'], SKIP: ['off', 'x'] };
export function DirectionBadge({ direction, suffix, icon = false, variant = 'solid', size = 'md', className, ...rest }) {
  const key = String(direction || '').toUpperCase();
  const [dir, ic] = MAP[key] || ['flat', null];
  return (
    <span className={cx('vui-dirb', 'vui-dirb--' + variant, size === 'sm' && 'vui-dirb--sm', className)} data-dir={dir} {...rest}>
      {icon && ic && <Glyph name={ic} />}{key.replace('_', ' ')}{suffix != null && <span className="vui-dirb__sfx">{suffix}</span>}
    </span>
  );
}
