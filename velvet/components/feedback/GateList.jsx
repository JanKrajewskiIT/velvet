import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const ICON = { pass: 'circle-check', fail: 'circle-x', warn: 'triangle-alert', pending: 'clock', skip: 'minus' };
export function GateList({ items = [], ordered = true, stopAtFirstFail = true, size = 'md', className, ...rest }) {
  const firstFail = items.findIndex((g) => g.status === 'fail');
  const passed = items.filter((g) => g.status === 'pass').length;
  const List = ordered ? 'ol' : 'ul';
  return (
    <div className={cx('vui-gates', size === 'sm' && 'vui-gates--sm', className)} {...rest}>
      <List className="vui-gates__list" aria-label={passed + ' of ' + items.length + ' gates passed'}>
        {items.map((g, i) => {
          const blocking = stopAtFirstFail && i === firstFail;
          const after = stopAtFirstFail && firstFail >= 0 && i > firstFail && g.status !== 'fail';
          return (
            <li key={g.id || i} className={cx('vui-gates__it', blocking && 'vui-gates__it--block', after && 'vui-gates__it--after')} data-status={g.status}>
              <span className="vui-gates__ic"><Glyph name={ICON[g.status] || 'minus'} label={g.status} /></span>
              <span className="vui-gates__txt"><span className="vui-gates__t">{g.label}</span>{g.detail && <span className="vui-gates__d">{g.detail}</span>}</span>
              {blocking ? <span className="vui-gates__tag">Blocks</span> : g.code ? <span className="vui-gates__code">{g.code}</span> : null}
            </li>
          );
        })}
      </List>
    </div>
  );
}
