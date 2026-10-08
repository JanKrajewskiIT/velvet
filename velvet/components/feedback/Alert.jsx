import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { cx } from '../primitives/cx.js';
import { TONE_ICON } from '../primitives/tone.js';
const ICONS = { ...TONE_ICON, neutral: 'info' };
export function Alert({ tone = 'info', title, children, action, onClose, icon, variant = 'soft', className }) {
  const glyph = icon === undefined ? ICONS[tone] : icon;
  return (
    <div role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'} className={cx('vui-alert', 'vui-alert--' + tone, 'vui-alert--' + variant, className)}>
      {glyph && <Glyph name={glyph} className="vui-alert__icon" />}
      <div className="vui-alert__body">
        {title && <div className="vui-alert__title">{title}</div>}
        {children && <div className="vui-alert__text">{children}</div>}
        {action && <div className="vui-alert__actions">{action}</div>}
      </div>
      {onClose && <CloseButton className="vui-alert__close" aria-label="Dismiss" onClick={onClose} />}
    </div>
  );
}
export function Banner({ tone = 'brand', children, action, onClose, icon, sticky = false, className }) {
  const glyph = icon === undefined ? ICONS[tone] : icon;
  return (
    <div role="region" aria-label="Announcement" className={cx('vui-banner', 'vui-banner--' + tone, sticky && 'vui-banner--sticky', className)}>
      <div className="vui-banner__inner">
        {glyph && <Glyph name={glyph} />}
        <div className="vui-banner__text">{children}</div>
        {action && <div className="vui-banner__action">{action}</div>}
      </div>
      {onClose && <CloseButton variant="bare" className="vui-banner__close" aria-label="Dismiss" onClick={onClose} />}
    </div>
  );
}
