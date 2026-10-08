import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { cx } from '../primitives/cx.js';
import { TONE_ICON as ICONS } from '../primitives/tone.js';
export function Toast({ tone = 'neutral', title, description, action, icon, onClose, duration, onUndo, undoLabel = 'Undo', className, ...rest }) {
  const glyph = icon === undefined ? ICONS[tone] : icon;
  return (
    <div role="status" className={cx('vui-toast', 'vui-toast--' + tone, className)} {...rest}>
      {glyph && <Glyph name={glyph} className="vui-toast__icon" />}
      <div className="vui-toast__content">
        {title && <div className="vui-toast__title">{title}</div>}
        {description && <div className="vui-toast__desc">{description}</div>}
        {(action || onUndo) && (
          <div className="vui-toast__action">
            {onUndo && <Button variant="soft" size="sm" iconLeft="refresh" onClick={onUndo}>{undoLabel}</Button>}
            {action}
          </div>
        )}
      </div>
      {onClose && (
        <CloseButton aria-label="Dismiss" onClick={onClose} />
      )}
      {duration > 0 && <span className="vui-toast__progress" style={{ animationDuration: duration + 'ms' }} onAnimationEnd={() => onClose && onClose()} aria-hidden="true" />}
    </div>
  );
}
export function ToastRegion({ children, className }) {
  return <div className={cx('vui-toast-region', className)} aria-live="polite">{children}</div>;
}
