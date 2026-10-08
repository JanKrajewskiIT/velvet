import React from 'react';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { cx } from '../primitives/cx.js';
const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
export function Dialog({ open, onClose, title, description, footer, size = 'md', placement = 'center', dismissible = true, className, children }) {
  const ref = React.useRef(null);
  const titleId = React.useId();
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const node = ref.current;
    const first = node && (node.querySelector('[autofocus]') || node.querySelector(FOCUSABLE));
    (first || node) && (first || node).focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissible) closeRef.current && closeRef.current();
      if (e.key === 'Tab' && node) {
        const f = [...node.querySelectorAll(FOCUSABLE)]; if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev && prev.focus && prev.focus(); };
  }, [open, dismissible]);
  if (!open) return null;
  const drawer = placement === 'right' || placement === 'left';
  return (
    <div className={cx('vui-dialog-backdrop', drawer && 'vui-dialog-backdrop--' + placement)} onMouseDown={(e) => { if (dismissible && e.target === e.currentTarget) onClose && onClose(); }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} className={cx('vui-dialog', drawer && 'vui-dialog--drawer', size !== 'md' && 'vui-dialog--' + size, className)} style={{ outline: 'none' }}>
        {dismissible && (
          <CloseButton className="vui-dialog__close" aria-label="Close" onClick={onClose} />
        )}
        {(title || description) && (
          <div className="vui-dialog__header">
            {title && <h2 id={titleId} className="vui-dialog__title">{title}</h2>}
            {description && <p className="vui-dialog__desc">{description}</p>}
          </div>
        )}
        {children != null ? <div className="vui-dialog__body">{children}</div> : <div style={{ height: 'var(--space-6)' }} />}
        {footer && <div className="vui-dialog__footer">{footer}</div>}
      </div>
    </div>
  );
}
