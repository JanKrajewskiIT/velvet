import React from 'react';
import { Surface } from '../primitives/Surface.jsx';
import { cx } from '../primitives/cx.js';
export function Card({ title, description, actions, footer, footerAlign = 'end', padding = 'md', className, children, ...surface }) {
  return (
    <Surface {...surface} className={cx('vui-card', padding !== 'md' && 'vui-card--p-' + padding, className)}>
      {(title || actions) && (
        <div className="vui-card__header">
          <div className="vui-card__heading">{title && <div className="vui-card__title">{title}</div>}{description && <div className="vui-card__desc">{description}</div>}</div>
          {actions && <div className="vui-card__actions">{actions}</div>}
        </div>
      )}
      {children != null && <div className="vui-card__body">{children}</div>}
      {footer && <div className={cx('vui-card__footer', footerAlign !== 'end' && 'vui-card__footer--' + footerAlign)}>{footer}</div>}
    </Surface>
  );
}
