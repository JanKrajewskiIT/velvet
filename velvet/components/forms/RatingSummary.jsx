import React from 'react';
import { Meter } from '../primitives/Meter.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Rating } from './Rating.jsx';
import { cx } from '../primitives/cx.js';
export function RatingSummary({ counts = [], average, noun = 'review', activeStar = null, onFilter, label = 'Rating breakdown', className }) {
  const max = counts.length || 5;
  const total = counts.reduce((a, b) => a + b, 0);
  const avg = average ?? (total ? counts.reduce((s, c, i) => s + c * (i + 1), 0) / total : 0);
  const peak = Math.max(1, ...counts);
  return (
    <div className={cx('vui-ratesum', className)}>
      <div className="vui-ratesum__score">
        <span className="vui-ratesum__avg">{avg.toFixed(1)}</span>
        <Rating readOnly value={avg} max={max} size="sm" label="Average rating" />
        <span className="vui-ratesum__count">{total.toLocaleString()} {noun}{total === 1 ? '' : 's'}</span>
      </div>
      <div className="vui-ratesum__rows" role="group" aria-label={label}>
        {Array.from({ length: max }).map((_, k) => {
          const star = max - k, n = counts[star - 1] || 0, on = activeStar === star;
          const Tag = onFilter ? 'button' : 'div';
          return (
            <Tag key={star} type={onFilter ? 'button' : undefined} className={cx('vui-ratesum__row', on && 'vui-ratesum__row--active')} aria-pressed={onFilter ? on : undefined}
              aria-label={star + ' star' + (star === 1 ? '' : 's') + ': ' + n + ' (' + (total ? Math.round((n / total) * 100) : 0) + '%)'} onClick={onFilter ? () => onFilter(on ? null : star) : undefined}>
              <span className="vui-ratesum__star">{star}<Glyph name="star" /></span>
              <Meter rating value={n} max={peak || 1} />
              <span className="vui-ratesum__n">{total ? Math.round((n / total) * 100) : 0}%</span>
            </Tag>
          );
        })}
      </div>
    </div>
  );
}
