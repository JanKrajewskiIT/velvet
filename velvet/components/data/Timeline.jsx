import React from 'react';
import { Badge } from '../display/Badge.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
import { Marker } from '../primitives/Marker.jsx';
import { Rail, RailItem } from '../primitives/Rail.jsx';
function Actions({ it, onAction, confirmId, setConfirm }) {
  const acts = it.actions || [];
  if (!acts.length) return null;
  return (
    <span className="vui-timeline__actions" role="group" aria-label="Actions">
      {acts.map((a) => (
        <button key={a.id} type="button" className={cx('vui-timeline__act', a.tone === 'danger' && 'vui-timeline__act--danger')} title={a.label} aria-label={a.label + (typeof it.title === 'string' ? ': ' + it.title : '')} disabled={a.disabled} aria-expanded={a.confirm ? confirmId === it.id + ':' + a.id : undefined}
          onClick={() => { if (a.confirm) { setConfirm(confirmId === it.id + ':' + a.id ? null : it.id + ':' + a.id); return; } a.onClick ? a.onClick(it) : onAction && onAction(a.id, it); }}>
          {a.icon ? <Glyph name={a.icon} /> : a.label}
        </button>
      ))}
    </span>
  );
}
const markerProps = (it, compact) => {
  const s = it.status, t = it.tone && it.tone !== 'neutral' ? it.tone : undefined;
  return { size: compact ? 'sm' : 'lg', gap: !compact, appearance: s === 'current' ? 'solid' : s === 'upcoming' ? 'outline' : 'soft', tone: s === 'done' ? 'success' : s === 'current' ? (t || 'brand') : s === 'upcoming' ? undefined : t, ring: s === 'current' };
};
export function Timeline({ items = [], variant = 'default', divided = false, onAction, onAdd, addLabel = 'Add event', className }) {
  const [confirm, setConfirm] = React.useState(null);
  const [busy, setBusy] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const run = async (a, it) => {
    setBusy(it.id + ':' + a.id); setErr(null);
    try { await (a.onClick ? a.onClick(it) : onAction && onAction(a.id, it)); setConfirm(null); }
    catch (e) { setErr((e && e.message) || 'That didn’t work — try again.'); }
    finally { setBusy(null); }
  };
  return (
    <Rail size={variant === 'compact' ? 'sm' : 'lg'} line={variant !== 'compact'} className={cx('vui-timeline', variant === 'compact' && 'vui-timeline--compact', divided && 'vui-timeline--divided', className)}>
      {items.map((it, i) => {
        const key = it.id ?? i;
        const c = confirm && (it.actions || []).find((a) => confirm === it.id + ':' + a.id);
        return (
          <RailItem key={key} state={it.status === 'done' ? 'done' : it.status === 'upcoming' ? 'dashed' : undefined} className={cx('vui-timeline__item', 'vui-timeline__item--' + (it.tone || 'neutral'), it.status && 'vui-timeline__item--s-' + it.status, it.actions && it.actions.length && 'vui-timeline__item--actionable', c && 'vui-timeline__item--confirming')}>
            <Marker className="vui-timeline__marker" aria-hidden="true" {...markerProps(it, variant === 'compact')} dot={!it.avatar && !it.icon && it.status !== 'done'}>{it.avatar || <Glyph name={it.icon || 'check'} />}</Marker>
            <div className="vui-timeline__body">
              <div className="vui-timeline__head">
                <span className="vui-timeline__title">{it.title}</span>
                {it.badge && <Badge size="sm" tone={it.badge.tone || 'neutral'} icon={it.badge.icon} className="vui-timeline__badge">{it.badge.label}</Badge>}
                {it.time && <time className="vui-timeline__time" dateTime={it.datetime}>{it.time}</time>}
                <Actions it={{ ...it, id: key }} onAction={onAction} confirmId={confirm} setConfirm={(v) => { setConfirm(v); setErr(null); }} />
              </div>
              {it.description && <div className="vui-timeline__desc">{it.description}</div>}
              {it.meta && it.meta.length > 0 && <ul className="vui-timeline__meta">{it.meta.map((m, k) => <li key={k}>{m.icon && <Glyph name={m.icon} />}{m.label}</li>)}</ul>}
              {it.content && <div className="vui-timeline__content">{it.content}</div>}
              {c && (
                <div className="vui-timeline__confirm" role="alert">
                  <span>{c.confirm === true ? c.label + '?' : c.confirm}</span>
                  {err && <span className="vui-timeline__err">{err}</span>}
                  <Button variant="ghost" size="sm" autoFocus disabled={!!busy} onClick={() =>{ setConfirm(null); setErr(null); }}>Cancel</Button>
                  <Button size="sm" variant={c.tone === 'danger' ? 'danger' : 'primary'} loading={!!busy} onClick={() => run(c, { ...it, id: key })}>{c.confirmLabel || c.label}</Button>
                </div>
              )}
            </div>
          </RailItem>
        );
      })}
      {onAdd && (
        <RailItem className="vui-timeline__item vui-timeline__item--add">
          <Marker className="vui-timeline__marker" appearance="outline" size={variant === 'compact' ? 'sm' : 'lg'} gap={variant !== 'compact'} aria-hidden="true"><Glyph name="plus" /></Marker>
          <div className="vui-timeline__body"><Button variant="dashed" size="sm" className="vui-timeline__addbtn" onClick={onAdd}>{addLabel}</Button></div>
        </RailItem>
      )}
    </Rail>
  );
}
