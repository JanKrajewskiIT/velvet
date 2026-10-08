import React from 'react';
import { cx } from '../primitives/cx.js';
import { Dot } from '../primitives/Dot.jsx';
const hashColor = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (s.charCodeAt(i) + ((h << 5) - h)) | 0; return 'var(--dv-' + ((Math.abs(h) % 8) + 1) + ')'; };
const STATUS_TONE = { online: 'success', away: 'warning', busy: 'danger', offline: 'neutral' };
export function Avatar({ name, initials, src, size = 'md', tone = 'brand', color: colorProp, status, className, style, children, ...rest }) {
  const color = colorProp === 'auto' ? ((name || initials) ? hashColor(name || initials) : undefined) : colorProp;
  const text = initials || (name ? name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() : '');
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => setBroken(false), [src]);
  const el = (
    <span className={cx('vui-avatar', size !== 'md' && 'vui-avatar--' + size, tone === 'neutral' && 'vui-avatar--neutral', color && 'vui-avatar--solid', !status && className)} style={color ? { '--avatar-c': color, ...style } : style} title={name} {...(status ? {} : rest)}>
      {children ?? (src && !broken ? <img src={src} alt={name || ''} onError={() => setBroken(true)} /> : text)}
    </span>
  );
  if (!status) return el;
  return (
    <span className={cx('vui-avatar-wrap', className)} {...rest}>
      {el}
      <Dot tone={STATUS_TONE[status] || 'neutral'} ring label={status} className="vui-avatar__status" />
    </span>
  );
}
export function AvatarGroup({ children, className }) {
  return <span className={cx('vui-avatar-group', className)}>{children}</span>;
}
