import React from 'react';
import { IconTile } from '../primitives/IconTile.jsx';
import { ListItem } from '../primitives/ListItem.jsx';
import { Count } from '../primitives/Count.jsx';
import { Badge } from '../display/Badge.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { EmptyText } from '../primitives/EmptyText.jsx';
import { Dot } from '../primitives/Dot.jsx';
import { cx } from '../primitives/cx.js';
import { TONE_ICON } from '../primitives/tone.js';
export function NotificationList({ items = [], onItemClick, emptyText = 'You’re all caught up.' }) {
  if (!items.length) return <EmptyText icon="circle-check" className="vui-notif__empty">{emptyText}</EmptyText>;
  return (
    <ul className="vui-notif__list">
      {items.map((n) => (
        <li key={n.id}>
          <ListItem as="button" align="start" clamp={2} className={cx('vui-notif__item', n.unread && 'vui-notif__item--unread')} onClick={() => onItemClick && onItemClick(n)}
            leading={n.avatar || <IconTile size="sm" shape="circle" tone={n.tone && n.tone !== 'neutral' ? n.tone : undefined} icon={n.icon || TONE_ICON[n.tone || 'neutral']} />}
            title={n.title} description={n.body} meta={n.time}
            trailing={n.unread && <Dot size="lg" tone="brand" label="Unread" className="vui-notif__dot" />} />
        </li>
      ))}
    </ul>
  );
}
export function NotificationCenter({ items = [], onItemClick, onMarkAllRead, onViewAll, title = 'Notifications', open, defaultOpen = false, onOpenChange, align = 'end', className }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : inner;
  const set = (v) => { if (open === undefined) setInner(v); onOpenChange && onOpenChange(v); };
  const wrap = React.useRef(null);
  const unread = items.filter((n) => n.unread).length;
  React.useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) set(false); };
    const k = (e) => { if (e.key === 'Escape') { set(false); wrap.current.querySelector('button').focus(); } };
    document.addEventListener('mousedown', h); window.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); window.removeEventListener('keydown', k); };
  }, [isOpen]);
  return (
    <span ref={wrap} className={cx('vui-popover-wrap', className)}>
      <button type="button" className="vui-btn vui-btn--ghost vui-btn--icon vui-notif__bell" aria-label={title + (unread ? ', ' + unread + ' unread' : '')} aria-haspopup="dialog" aria-expanded={isOpen} onClick={() => set(!isOpen)}>
        <Glyph name="bell" />
        {unread > 0 && <Count value={unread} max={9} size="sm" className="vui-indicator__item" aria-hidden="true" />}
      </button>
      {isOpen && (
        <div role="dialog" aria-label={title} className={cx('vui-popover', 'vui-notif', align === 'end' && 'vui-popover--end')}>
          <div className="vui-notif__head"><span className="vui-notif__heading">{title}{unread > 0 && <Badge size="sm" tone="brand">{unread} new</Badge>}</span>{onMarkAllRead && unread > 0 && <Button variant="link" size="sm" onClick={onMarkAllRead}>Mark all read</Button>}</div>
          <NotificationList items={items} onItemClick={onItemClick} />
          {onViewAll && <button type="button" className="vui-notif__foot" onClick={onViewAll}>View all activity<Glyph name="arrow-right" /></button>}
        </div>
      )}
    </span>
  );
}
