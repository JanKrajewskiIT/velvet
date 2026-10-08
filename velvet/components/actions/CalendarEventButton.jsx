import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { Chevron } from '../primitives/Chevron.jsx';
import { cx } from '../primitives/cx.js';
import { toDate } from '../primitives/date.js';
const span = (ev) => { const s = toDate(ev.start); const e = ev.end ? toDate(ev.end) : new Date(s.getTime() + (ev.durationMinutes ?? (ev.allDay ? 1440 : 60)) * 60000); return [s, e]; };
const utc = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const ymd = (d) => d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
export function buildGoogleCalendarUrl(ev) {
  const [s, e] = span(ev);
  const dates = ev.allDay ? ymd(s) + '/' + ymd(new Date(e.getTime() + (ymd(e) === ymd(s) ? 86400000 : 0))) : utc(s) + '/' + utc(e);
  const p = new URLSearchParams({ action: 'TEMPLATE', text: ev.title || '', dates });
  if (ev.description) p.set('details', ev.description);
  if (ev.location) p.set('location', ev.location);
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}
export function buildOutlookCalendarUrl(ev) {
  const [s, e] = span(ev);
  const p = new URLSearchParams({ path: '/calendar/action/compose', rru: 'addevent', subject: ev.title || '', startdt: s.toISOString(), enddt: e.toISOString() });
  if (ev.allDay) p.set('allday', 'true');
  if (ev.description) p.set('body', ev.description);
  if (ev.location) p.set('location', ev.location);
  return 'https://outlook.live.com/calendar/0/deeplink/compose?' + p.toString();
}
export function buildIcs(ev) {
  const [s, e] = span(ev);
  const esc = (t) => String(t || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (m) => '\\' + m);
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Velvet UI//Calendar//EN', 'BEGIN:VEVENT', 'UID:' + (ev.id || Date.now() + '@velvet-ui'), 'DTSTAMP:' + utc(new Date()),
    ev.allDay ? 'DTSTART;VALUE=DATE:' + ymd(s) : 'DTSTART:' + utc(s), ev.allDay ? 'DTEND;VALUE=DATE:' + ymd(new Date(e.getTime() + (ymd(e) === ymd(s) ? 86400000 : 0))) : 'DTEND:' + utc(e),
    'SUMMARY:' + esc(ev.title), ev.description && 'DESCRIPTION:' + esc(ev.description), ev.location && 'LOCATION:' + esc(ev.location), 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
}
const PROVIDERS = {
  google: { label: 'Google Calendar', icon: 'calendar', go: (ev) => window.open(buildGoogleCalendarUrl(ev), '_blank', 'noopener') },
  outlook: { label: 'Outlook.com', icon: 'mail', go: (ev) => window.open(buildOutlookCalendarUrl(ev), '_blank', 'noopener') },
  ics: { label: 'Apple / other (.ics)', icon: 'download', go: (ev) => { const url = URL.createObjectURL(new Blob([buildIcs(ev)], { type: 'text/calendar' })); const a = document.createElement('a'); a.href = url; a.download = (ev.title || 'event').replace(/[^\w-]+/g, '_') + '.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); } },
};
export function CalendarEventButton({ event, providers = ['google', 'outlook', 'ics'], label = 'Add to calendar', variant = 'secondary', size = 'md', iconOnly = false, added = false, addedLabel = 'In calendar', onAdd, disabled, className }) {
  const [open, setOpen] = React.useState(false);
  const [done, setDone] = React.useState(added);
  React.useEffect(() => setDone(added), [added]);
  const root = React.useRef(null); const menuId = React.useId();
  const valid = event && event.start && !isNaN(toDate(event.start).getTime());
  React.useEffect(() => {
    if (!open) return;
    const off = (e) => { if (root.current && !root.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); root.current && root.current.querySelector('button').focus(); } };
    document.addEventListener('mousedown', off); document.addEventListener('keydown', key);
    requestAnimationFrame(() => { const f = root.current && root.current.querySelector('[role=menuitem]'); f && f.focus(); });
    return () => { document.removeEventListener('mousedown', off); document.removeEventListener('keydown', key); };
  }, [open]);
  const pick = (k) => { PROVIDERS[k].go(event); setOpen(false); setDone(true); onAdd && onAdd(k); };
  const single = providers.length === 1;
  const text = done ? addedLabel : label;
  const onMenuKey = (e) => {
    const items = [...e.currentTarget.querySelectorAll('[role=menuitem]')]; const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
    if (e.key === 'Tab') setOpen(false);
  };
  return (
    <span ref={root} className={cx('vui-calbtn', className)}>
      <button type="button" className={cx('vui-btn', 'vui-btn--' + variant, size !== 'md' && 'vui-btn--' + size, iconOnly && 'vui-btn--icon', done && 'vui-calbtn--done')} disabled={disabled || !valid}
        aria-haspopup={single ? undefined : 'menu'} aria-expanded={single ? undefined : open} aria-controls={single ? undefined : menuId} aria-label={iconOnly ? text : undefined} title={iconOnly ? text : undefined}
        onClick={() => (single ? pick(providers[0]) : setOpen(!open))}>
        <Glyph name={(done ? 'check' : 'calendar-plus')} />{!iconOnly && text}{!iconOnly && !single && <Chevron open={open} className="vui-calbtn__chev" />}
      </button>
      {open && (
        <div id={menuId} role="menu" className="vui-calbtn__menu" aria-label={label} onKeyDown={onMenuKey}>
          {providers.map((k) => PROVIDERS[k] && <button key={k} type="button" role="menuitem" className="vui-calbtn__item" onClick={() => pick(k)}><Glyph name={PROVIDERS[k].icon} />{PROVIDERS[k].label}{k !== 'ics' && <Glyph name="external-link" className="vui-calbtn__ext" />}</button>)}
        </div>
      )}
    </span>
  );
}
