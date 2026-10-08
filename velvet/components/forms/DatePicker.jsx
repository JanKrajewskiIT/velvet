import React from 'react';
import { Control } from '../primitives/Control.jsx';
import { Button } from '../actions/Button.jsx';
import { pad } from '../primitives/date.js';
import { useDismiss } from '../primitives/useDismiss.js';
import { CloseButton } from '../primitives/CloseButton.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Calendar, fmtDate, startOfDay, addDays, sameDay } from './Calendar.jsx';
import { cx } from '../primitives/cx.js';
function usePop(initial = false) {
  const [open, setOpen] = React.useState(initial);
  const wrap = React.useRef(null);
  const close = (refocus) => { setOpen(false); if (refocus) { const b = wrap.current && wrap.current.querySelector('.vui-datefield'); b && b.focus(); } };
  useDismiss(open, setOpen, wrap, { refocus: '.vui-datefield' });
  React.useEffect(() => { if (open && wrap.current) requestAnimationFrame(() => { const d = wrap.current && wrap.current.querySelector('.vui-cal__day[tabindex="0"]'); d && d.focus(); }); }, [open]);
  return { open, setOpen, wrap, close };
}
function DateField({ id, label, hint, error, optional, size, disabled, text, placeholder, open, onToggle, onClear, icon = 'calendar' }) {
  return (
    <>
      {label && <FieldLabel htmlFor={id} optional={optional}>{label}</FieldLabel>}
      <Control size={size} invalid={!!(error)} disabled={disabled}>
        <button id={id} type="button" className="vui-datefield" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} onClick={onToggle}>
          <Glyph name={icon} />
          <span className={cx('vui-datefield__text', !text && 'vui-datefield__text--empty')}>{text || placeholder}</span>
        </button>
        {text && onClear && !disabled && <CloseButton variant="field" aria-label="Clear date" onClick={onClear} />}
      </Control>
    </>
  );
}
export function DatePicker({ label, hint, error, optional, value, defaultValue = null, onChange: onChangeProp, onValueChange, placeholder = 'Select date', min, max, isDisabled, locale = 'en-US', weekStartsOn = 1, format, clearable = true, align = 'start', size = 'md', disabled, defaultOpen = false, id }) {
  const onChange = onChangeProp || onValueChange;
  const autoId = React.useId(); const fid = id || autoId;
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const set = (v) => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const p = usePop(defaultOpen);
  const text = cur ? (format ? format(cur) : fmtDate(cur, locale)) : '';
  return (
    <div className="vui-field">
      <span ref={p.wrap} className="vui-popover-wrap vui-datepicker">
        <div className="vui-field" style={{ width: '100%' }}>
          <DateField id={fid} label={label} optional={optional} error={error} size={size} disabled={disabled} text={text} placeholder={placeholder} open={p.open} onToggle={() => p.setOpen(!p.open)} onClear={clearable ? () => set(null) : null} />
        </div>
        {p.open && (
          <div className={cx('vui-popover', 'vui-datepop', align === 'end' && 'vui-popover--end')} role="dialog" aria-label="Choose date">
            <Calendar value={cur} onChange={(d) => { set(d); p.close(true); }} min={min} max={max} isDisabled={isDisabled} locale={locale} weekStartsOn={weekStartsOn} />
            <div className="vui-datepop__foot">
              <Button variant="ghost" size="sm" onClick={() =>{ set(startOfDay(new Date())); p.close(true); }}>Today</Button>
              {clearable && cur && <Button variant="ghost" size="sm" onClick={() =>{ set(null); p.close(true); }}>Clear</Button>}
            </div>
          </div>
        )}
      </span>
      {(error || hint) && <span className={cx('vui-hint', error && 'vui-hint--error')}>{error || hint}</span>}
    </div>
  );
}
const som = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
export const DEFAULT_RANGE_PRESETS = [
  { label: 'Today', range: () => { const t = startOfDay(new Date()); return { start: t, end: t }; } },
  { label: 'Last 7 days', range: () => { const t = startOfDay(new Date()); return { start: addDays(t, -6), end: t }; } },
  { label: 'Last 30 days', range: () => { const t = startOfDay(new Date()); return { start: addDays(t, -29), end: t }; } },
  { label: 'This month', range: () => { const t = startOfDay(new Date()); return { start: som(t), end: t }; } },
  { label: 'Last month', range: () => { const t = new Date(); const s = new Date(t.getFullYear(), t.getMonth() - 1, 1); return { start: s, end: new Date(t.getFullYear(), t.getMonth(), 0) }; } },
  { label: 'This year', range: () => { const t = startOfDay(new Date()); return { start: new Date(t.getFullYear(), 0, 1), end: t }; } },
];
export function DateRangePicker({ label, hint, error, optional, value, defaultValue = { start: null, end: null }, onChange, presets = DEFAULT_RANGE_PRESETS, placeholder = 'Select dates', min, max, isDisabled, locale = 'en-US', weekStartsOn = 1, align = 'start', size = 'md', disabled, defaultOpen = false, id }) {
  const autoId = React.useId(); const fid = id || autoId;
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const [draft, setDraft] = React.useState(cur);
  const p = usePop(defaultOpen);
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => { if (p.open) { setDraft(cur); setNarrow(window.matchMedia('(max-width: 599px)').matches); } }, [p.open]);
  const fmtR = (r) => (r && r.start ? fmtDate(r.start, locale, { month: 'short', day: 'numeric', ...(r.end && r.end.getFullYear() !== r.start.getFullYear() ? { year: 'numeric' } : {}) }) + ' – ' + (r.end ? fmtDate(r.end, locale) : '…') : '');
  const days = draft.start && draft.end ? Math.round((draft.end - draft.start) / 864e5) + 1 : 0;
  const activePreset = presets.findIndex((pr) => { const r = pr.range(); return sameDay(r.start, draft.start) && sameDay(r.end, draft.end); });
  const apply = () => { if (value === undefined) setInner(draft); onChange && onChange(draft); p.close(true); };
  return (
    <div className="vui-field">
      <span ref={p.wrap} className="vui-popover-wrap vui-datepicker">
        <div className="vui-field" style={{ width: '100%' }}>
          <DateField id={fid} label={label} optional={optional} error={error} size={size} disabled={disabled} text={fmtR(cur)} placeholder={placeholder} open={p.open} onToggle={() => p.setOpen(!p.open)} onClear={() => { const e = { start: null, end: null }; if (value === undefined) setInner(e); onChange && onChange(e); }} />
        </div>
        {p.open && (
          <div className={cx('vui-popover', 'vui-datepop', 'vui-rangepop', align === 'end' && 'vui-popover--end')} role="dialog" aria-label="Choose date range">
            <div className="vui-rangepop__body">
              {presets && presets.length > 0 && (
                <div className="vui-rangepop__presets" role="listbox" aria-label="Presets">
                  {presets.map((pr, i) => <button key={pr.label} type="button" role="option" aria-selected={i === activePreset} className={cx('vui-rangepop__preset', i === activePreset && 'vui-rangepop__preset--on')} onClick={() => setDraft(pr.range())}>{pr.label}</button>)}
                </div>
              )}
              <Calendar key={activePreset + String(draft.start)} mode="range" months={narrow ? 1 : 2} value={draft} onChange={setDraft} defaultMonth={draft.start && narrow ? draft.start : draft.end ? addMonthsSafe(draft.end, -1) : undefined} min={min} max={max} isDisabled={isDisabled} locale={locale} weekStartsOn={weekStartsOn} />
            </div>
            <div className="vui-datepop__foot vui-rangepop__foot">
              <span className="vui-rangepop__sum">{draft.start ? fmtR(draft) + (days ? ' · ' + days + (days === 1 ? ' day' : ' days') : '') : 'Pick a start date'}</span>
              <Button variant="ghost" size="sm" onClick={() =>p.close(true)}>Cancel</Button>
              <Button size="sm" disabled={!draft.start || !draft.end} onClick={apply}>Apply</Button>
            </div>
          </div>
        )}
      </span>
      {(error || hint) && <span className={cx('vui-hint', error && 'vui-hint--error')}>{error || hint}</span>}
    </div>
  );
}
const addMonthsSafe = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
export function parseTime(s) {
  const m = String(s || '').trim().toLowerCase().match(/^(\d{1,2})(?:[:.h]?(\d{2}))?\s*(a|am|p|pm)?$/);
  if (!m) return null;
  let h = +m[1]; const mi = m[2] ? +m[2] : 0;
  if (m[3]) { if (h > 12 || h < 1) return null; if (m[3][0] === 'p' && h < 12) h += 12; if (m[3][0] === 'a' && h === 12) h = 0; }
  if (h > 23 || mi > 59) return null;
  return pad(h) + ':' + pad(mi);
}
const show = (t, h12) => { if (!t) return ''; if (!h12) return t; const [h, m] = t.split(':').map(Number); return ((h + 11) % 12 + 1) + ':' + pad(m) + (h < 12 ? ' AM' : ' PM'); };
export function TimePicker({ label, hint, error, optional, value, defaultValue = null, onChange, step = 15, min = '00:00', max = '23:59', hour12 = false, placeholder, size = 'md', disabled, id }) {
  const autoId = React.useId(); const fid = id || autoId; const listId = fid + '-list';
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const [text, setText] = React.useState(show(cur, hour12));
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [bad, setBad] = React.useState(false);
  const wrap = React.useRef(null), list = React.useRef(null);
  const opts = React.useMemo(() => { const r = []; const [a, b] = [min, max].map((t) => t.split(':').map(Number)).map(([h, m]) => h * 60 + m); for (let x = a; x <= b; x += step) r.push(pad(Math.floor(x / 60)) + ':' + pad(x % 60)); return r; }, [step, min, max]);
  React.useEffect(() => { setText(show(cur, hour12)); }, [cur, hour12]);
  React.useEffect(() => {
    if (!open) return;
    const i = cur ? opts.findIndex((o) => o >= cur) : opts.findIndex((o) => o >= pad(new Date().getHours()) + ':00');
    setActive(i < 0 ? 0 : i);
    const h = (e) => { if (wrap.current && !wrap.current.contains(e.target)) { setOpen(false); commit(text); } };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  React.useEffect(() => { const el = list.current && list.current.children[active]; if (el) list.current.scrollTop = el.offsetTop - list.current.clientHeight / 2 + el.offsetHeight / 2; }, [active, open]);
  const set = (v) => { setBad(false); if (value === undefined) setInner(v); onChange && onChange(v); setText(show(v, hour12)); };
  const commit = (t) => { if (!t.trim()) { set(null); return; } const p = parseTime(t); if (p) set(p); else setBad(true); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(opts.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (open && active >= 0 && parseTime(text) === cur) set(opts[active]); else commit(text); setOpen(false); }
    else if (e.key === 'Escape') { setOpen(false); setText(show(cur, hour12)); }
    else if (e.key === 'Tab') { setOpen(false); commit(text); }
  };
  const err = error || (bad ? 'Enter a time like ' + (hour12 ? '9:30 AM' : '09:30') : null);
  return (
    <div className="vui-field">
      {label && <FieldLabel htmlFor={fid} optional={optional}>{label}</FieldLabel>}
      <div ref={wrap} className="vui-select">
        <Control size={size} invalid={!!(err)} disabled={disabled} iconLeft="clock">
          <input id={fid} role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open && active >= 0 ? listId + '-' + active : undefined} aria-invalid={!!err || undefined}
            className="vui-control__input vui-time__input" value={text} placeholder={placeholder || (hour12 ? '9:30 AM' : '09:30')} disabled={disabled} autoComplete="off" inputMode="numeric"
            onChange={(e) => { setText(e.target.value); setBad(false); const p = parseTime(e.target.value); if (p) { const i = opts.findIndex((o) => o >= p); if (i >= 0) setActive(i); } }}
            onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onKeyDown={onKey} />
        </Control>
        {open && (
          <ul ref={list} id={listId} role="listbox" className="vui-select__menu vui-time__menu">
            {opts.map((o, i) => (
              <li key={o} id={listId + '-' + i} role="option" aria-selected={o === cur} className={cx('vui-select__option', i === active && 'vui-select__option--active')}
                onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => { set(o); setOpen(false); }}>
                <span className="vui-select__label" style={{ fontVariantNumeric: 'tabular-nums' }}>{show(o, hour12)}</span>
                {o === cur && <Glyph name="check" className="vui-select__check" />}
              </li>
            ))}
          </ul>
        )}
      </div>
      {(err || hint) && <span className={cx('vui-hint', err && 'vui-hint--error')}>{err || hint}</span>}
    </div>
  );
}
