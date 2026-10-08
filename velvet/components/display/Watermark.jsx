import React from 'react';
import { cx } from '../primitives/cx.js';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function Watermark({ text = 'Confidential', lines, rotate = -24, gap = [96, 72], fontSize = 14, fontWeight = 600, opacity = 0.08, children, className, style, ...rest }) {
  const L = lines || [].concat(text);
  const tw = Math.max(...L.map((s) => String(s).length)) * fontSize * 0.62;
  const lh = fontSize * 1.4, th = L.length * lh;
  const w = Math.ceil(tw + gap[0]), h = Math.ceil(th + gap[1]);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><g transform="rotate(' + rotate + ' ' + w / 2 + ' ' + h / 2 + ')" font-family="Hanken Grotesk, system-ui, sans-serif" font-size="' + fontSize + '" font-weight="' + fontWeight + '" text-anchor="middle">'
    + L.map((s, i) => '<text x="' + w / 2 + '" y="' + (h / 2 - th / 2 + lh * (i + 0.72)) + '">' + esc(s) + '</text>').join('') + '</g></svg>';
  const url = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  const sz = w + 'px ' + h + 'px';
  return (
    <div className={cx('vui-watermark', className)} style={style} {...rest}>
      {children}
      <div className="vui-watermark__layer" aria-hidden="true" style={{ WebkitMaskImage: url, maskImage: url, WebkitMaskSize: sz, maskSize: sz, opacity }} />
    </div>
  );
}
