import React from 'react';
import { R_MARK, R_WORD } from './recron-logo-paths.js';
import { Q_MARK, Q_WORD } from './quantcore-logo-data.js';
import { cx } from '../primitives/cx.js';
const VELVET = { name: 'Velvet UI', letter: 'v', word: 'velvet', accent: '/ui' };
const R_SIZES = { sm: 24, md: 32, lg: 48, xl: 64 };
const recronPaths = (list) => list.map((d, i) => <path key={i} d={d} />);
export function BrandLogo({ brand = 'velvet', variant = 'lockup', tone = 'default', size = 'md', glow = true, label, className, style }) {
  const px = typeof size === 'number';
  if (brand === 'recron') {
    const h = px ? size : (R_SIZES[size] || 32);
    const markOnly = variant === 'mark';
    const box = markOnly ? '318 264 182 232' : '320 268 772 224';
    return (
      <svg role="img" aria-label={label || 'Recron'} viewBox={box} className={cx('vui-logo-r', tone === 'inverse' && 'vui-logo-r--inverse', className)} style={{ height: h, ...style }}>
        <g transform="translate(0,752) scale(0.1,-0.1)">
          <g className="vui-logo-r__mark">{recronPaths(R_MARK)}</g>
          {markOnly ? null : <g className="vui-logo-r__word">{recronPaths(R_WORD)}</g>}
        </g>
      </svg>
    );
  }
  if (brand === 'quantcore') {
    const h = px ? size : (R_SIZES[size] || 32);
    const markOnly = variant === 'mark';
    return (
      <svg role="img" aria-label={label || 'QuantCore'} viewBox={markOnly ? '64 76 172 176' : '64 76 884 176'} className={cx('vui-logo-r', tone === 'inverse' && 'vui-logo-r--inverse', className)} style={{ height: h, ...style }}>
        <path className="vui-logo-r__mark" fillRule="evenodd" d={Q_MARK} />
        {markOnly ? null : <path className="vui-logo-r__word" fillRule="evenodd" d={Q_WORD} />}
      </svg>
    );
  }
  const b = VELVET;
  return (
    <span role="img" aria-label={label || b.name} className={cx('vui-logo', 'vui-logo--velvet', !px && 'vui-logo--' + size, tone === 'inverse' && 'vui-logo--inverse', !glow && 'vui-logo--plain', className)} style={px ? { fontSize: size, ...style } : style}>
      {variant !== 'wordmark' && <span className="vui-logo__mark" aria-hidden="true"><span>{b.letter}</span></span>}
      {variant !== 'mark' && <span className="vui-logo__word" aria-hidden="true">{b.word}<span className="vui-logo__accent">{b.accent}</span></span>}
    </span>
  );
}
