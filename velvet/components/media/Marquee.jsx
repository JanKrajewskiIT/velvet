import React from 'react';
import { cx } from '../primitives/cx.js';
export function Marquee({ children, speed = 40, direction = 'left', gap = 48, pauseOnHover = true, fade = true, label, className }) {
  const inner = React.useRef(null);
  const [dur, setDur] = React.useState(20);
  React.useLayoutEffect(() => { if (inner.current) setDur(Math.max(4, inner.current.scrollWidth / speed)); }, [children, speed]);
  return (
    <div className={cx('vui-marquee', pauseOnHover && 'vui-marquee--pause', fade && 'vui-marquee--fade', className)} role="region" aria-label={label}>
      <div className="vui-marquee__track" style={{ animationDuration: dur + 's', animationDirection: direction === 'right' ? 'reverse' : 'normal', gap }}>
        <div ref={inner} className="vui-marquee__group" style={{ gap }}>{children}</div>
        <div className="vui-marquee__group" style={{ gap }} aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
