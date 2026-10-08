import React from 'react';
import { Surface } from '../primitives/Surface.jsx';
import { cx } from '../primitives/cx.js';
export function StructuredCard({ as, media, mediaRatio = '16 / 9', mediaTag, mediaMeta, scrim, title, meta, badge, footer, footerAlign = 'between', hoverable, interactive, tonal, tone, accent, reveal, selected, className, children, ...rest }) {
  const showScrim = scrim ?? !!mediaMeta;
  const head = title || meta || badge;
  return (
    <Surface as={as} hoverable={hoverable} interactive={interactive} tonal={tonal} tone={tone} accent={accent} reveal={reveal} selected={selected} clip className={cx('vui-scard', className)} {...rest}>
      {media && (
        <div className="vui-scard__media" style={mediaRatio ? { aspectRatio: mediaRatio } : undefined}>
          {media}
          {showScrim && <span className="vui-scard__scrim" aria-hidden="true" />}
          {mediaTag && <span className="vui-scard__tag">{mediaTag}</span>}
          {mediaMeta && <span className="vui-scard__mmeta">{mediaMeta}</span>}
        </div>
      )}
      {head && (
        <div className="vui-scard__header">
          <div className="vui-scard__heading">{title && <div className="vui-scard__title">{title}</div>}{meta && <div className="vui-scard__meta">{meta}</div>}</div>
          {badge && <div className="vui-scard__badge">{badge}</div>}
        </div>
      )}
      {children != null && <div className="vui-scard__body">{children}</div>}
      {footer && <div className={cx('vui-scard__footer', 'vui-scard__footer--' + footerAlign)}>{footer}</div>}
    </Surface>
  );
}
