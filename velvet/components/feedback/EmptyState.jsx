import React from 'react';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { IconTile } from '../primitives/IconTile.jsx';
const TILE = { sm: 'lg', md: '2xl', lg: '3xl' };
const tile = (icon, size, tone) => <IconTile icon={icon} size={TILE[size] || '2xl'} shape="circle" tone={tone === 'neutral' ? undefined : tone} halo={size === 'sm' ? undefined : size === 'lg' ? 'lg' : 'md'} className="vui-empty__icon" />;
import { cx } from '../primitives/cx.js';
export function EmptyState({ icon = 'inbox', title, description, actions, size = 'md', tone = 'brand', className, children }) {
  return (
    <div className={cx('vui-empty', 'vui-empty--' + size, 'vui-tone--' + tone, className)}>
      {icon && tile(icon, size, tone)}
      <div className="vui-empty__text">
        {title && <div className="vui-empty__title">{title}</div>}
        {description && <div className="vui-empty__desc">{description}</div>}
      </div>
      {actions && <div className="vui-empty__actions">{actions}</div>}
      {children && <div className="vui-status-page__extra">{children}</div>}
    </div>
  );
}
export function ErrorState({ title = 'Something went wrong', description = 'We couldn’t load this. Check your connection and try again.', onRetry, retryLabel = 'Try again', details, icon = 'triangle-alert', size = 'md', className }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div role="alert" className={cx('vui-empty', 'vui-empty--error', 'vui-tone--danger', 'vui-empty--' + size, className)}>
      {tile(icon, size, 'danger')}
      <div className="vui-empty__text"><div className="vui-empty__title">{title}</div>{description && <div className="vui-empty__desc">{description}</div>}</div>
      {(onRetry || details) && (
        <div className="vui-empty__actions">
          {onRetry && <Button variant="secondary" size="sm" iconLeft="refresh" onClick={onRetry}>{retryLabel}</Button>}
          {details && <Button variant="ghost" size="sm" aria-expanded={open} onClick={() =>setOpen(!open)}>{open ? 'Hide' : 'Show'} details</Button>}
        </div>
      )}
      {details && open && <pre className="vui-empty__details">{details}</pre>}
    </div>
  );
}
const PAGES = {
  404: { tag: 'Not found', title: 'Page not found', description: 'The page you’re looking for doesn’t exist or has moved.', icon: 'search', tone: 'brand' },
  403: { tag: 'Access denied', title: 'You don’t have access', description: 'Ask a workspace admin to invite you, or switch to an account that has access.', icon: 'lock', tone: 'warning' },
  500: { tag: 'Server error', title: 'Something broke on our side', description: 'We’ve been notified and are looking into it. Try again in a moment.', icon: 'triangle-alert', tone: 'danger' },
  offline: { title: 'You’re offline', description: 'Reconnect to keep working — your changes are saved locally.', icon: 'globe', tone: 'info' },
  success: { title: 'All done', description: 'Everything went through. You can carry on.', icon: 'circle-check', tone: 'success' },
  warning: { title: 'Finished with warnings', description: 'Some items need your attention before they’re complete.', icon: 'triangle-alert', tone: 'warning' },
  info: { title: 'Request submitted', description: 'We’ll let you know as soon as it’s been reviewed.', icon: 'info', tone: 'info' },
};
const OUTCOME = { success: 1, warning: 1, info: 1, offline: 1 };
export function StatusPage({ code = 404, status, title, description, actions, icon, tone, size = 'lg', className, children }) {
  const k = status ?? code;
  const p = PAGES[k] || PAGES[404];
  const isErr = !OUTCOME[k];
  return (
    <div role={k == 500 ? 'alert' : 'status'} className={cx('vui-empty', 'vui-status-page', isErr && size === 'lg' && 'vui-status-page--hero', size !== 'lg' && 'vui-status-page--' + size, 'vui-tone--' + (tone || p.tone), className)}>
      {isErr && size === 'lg' ? (
        <div className="vui-status-page__hero">
          <span className="vui-status-page__tag"><Glyph name={(icon || p.icon)} />{'Error ' + k}{p.tag ? <span className="vui-status-page__tagsub">{p.tag}</span> : null}</span>
          <span className="vui-status-page__num" aria-hidden="true">{String(k).split('').map((ch, i) => <span key={i} style={{ '--d': i }}>{ch}</span>)}</span>
        </div>
      ) : (
        <>
          {isErr && <div className="vui-status-page__overline">{'Error ' + k}</div>}
          {tile(icon || p.icon, size, tone || p.tone)}
        </>
      )}
      <div className="vui-empty__text"><h1 className="vui-empty__title">{title || p.title}</h1><p className="vui-empty__desc">{description || p.description}</p></div>
      {actions && <div className="vui-empty__actions">{actions}</div>}
      {children && <div className="vui-status-page__extra">{children}</div>}
    </div>
  );
}
