import React from 'react';
import { Card } from '../display/Card.jsx';
import { cx } from '../primitives/cx.js';
export function FlipCard({ front, back, flipped, defaultFlipped = false, onFlip, height = 220, label = 'Flip card', variant, backVariant = 'brand-solid', tone, accent, width, align = 'center', flipOnHover = false, className }) {
  const [inner, setInner] = React.useState(defaultFlipped);
  const on = flipped !== undefined ? flipped : inner;
  const flip = () => { if (flipped === undefined) setInner(!on); onFlip && onFlip(!on); };
  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } };
  return (
    <div role="button" tabIndex={0} className={cx('vui-flip', on && 'vui-flip--on', align === 'start' && 'vui-flip--start', flipOnHover && 'vui-flip--hover', className)} style={{ height, width }} aria-pressed={on} aria-label={label + (on ? ' (showing back)' : ' (showing front)')} onClick={flip} onKeyDown={onKey}>
      <div className="vui-flip__inner">
        <Card variant={variant} tone={tone} accent={accent} className="vui-flip__face vui-flip__face--front" aria-hidden={on}>{front}</Card>
        <Card variant={backVariant} className="vui-flip__face vui-flip__face--back" aria-hidden={!on}>{back}</Card>
      </div>
    </div>
  );
}
