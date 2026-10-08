import React from 'react';
import { Field } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
import { Option } from '../primitives/Option.jsx';
import { Surface } from '../primitives/Surface.jsx';
import { Avatar } from '../data/Avatar.jsx';
import { cx } from '../primitives/cx.js';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escClass = (s) => s.replace(/[\]\\^-]/g, '\\$&');
const COPY = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'wordSpacing', 'tabSize'];
export function MentionInput({ label, hint, error, optional, required, value, defaultValue = '', onValueChange, users = [], tags = [], sources, rows = 3, maxRows = 8, placeholder, maxResults = 6, onMention, disabled, id, className }) {
  const src = sources || (tags.length ? { '@': users, '#': tags } : { '@': users });
  const autoId = React.useId();
  const fid = id || autoId;
  const lid = fid + '-list';
  const [inner, setInner] = React.useState(defaultValue);
  const v = value !== undefined ? value : inner;
  const set = (x) => { if (value === undefined) setInner(x); onValueChange && onValueChange(x); };
  const [q, setQ] = React.useState(null);
  const [act, setAct] = React.useState(0);
  const [pos, setPos] = React.useState({ left: 0, top: 0 });
  const ta = React.useRef(null), hl = React.useRef(null), meas = React.useRef(null), caret = React.useRef(null);
  const trig = Object.keys(src).map(escClass).join('');
  const detect = (text, at) => {
    const m = text.slice(0, at).match(new RegExp('(?:^|\\s)([' + trig + '])([^\\s' + trig + ']{0,30})$', 'u'));
    return m ? { t: m[1], text: m[2], start: at - m[2].length - 1 } : null;
  };
  const list = q ? (src[q.t] || []).filter((o) => (o.label + ' ' + (o.description || '')).toLowerCase().includes(q.text.toLowerCase())).slice(0, maxResults) : [];
  const open = !!q && list.length > 0 && !disabled;
  React.useLayoutEffect(() => {
    const el = ta.current; if (!el) return;
    const cs = getComputedStyle(el);
    [hl.current, meas.current].forEach((m) => m && COPY.forEach((p) => { m.style[p] = cs[p]; }));
    const lh = parseFloat(cs.lineHeight) || 20; const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    el.style.height = 'auto';
    const max = maxRows * lh + pad;
    el.style.height = Math.min(Math.max(el.scrollHeight, rows * lh + pad), max) + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
    if (hl.current) hl.current.scrollTop = el.scrollTop;
  }, [v, rows, maxRows]);
  const qs = q ? q.start : -1;
  React.useLayoutEffect(() => {
    const c = caret.current, el = ta.current;
    if (qs < 0 || !c || !el) return;
    setPos({ left: Math.max(0, Math.min(c.offsetLeft - 8, el.clientWidth - 248)), top: c.offsetTop + c.offsetHeight - el.scrollTop + 6 });
  }, [qs, v]);
  const update = (e) => { setQ(detect(e.target.value, e.target.selectionStart)); setAct(0); };
  const pick = (o) => {
    const el = ta.current; const at = el.selectionStart;
    const ins = q.t + o.label + ' ';
    const nv = v.slice(0, q.start) + ins + v.slice(at);
    const p = q.start + ins.length;
    set(nv); setQ(null); onMention && onMention(o, q.t);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(p, p); });
  };
  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setAct((act + 1) % list.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAct((act - 1 + list.length) % list.length); }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(list[act]); }
    else if (e.key === 'Escape') { e.preventDefault(); setQ(null); }
  };
  const known = Object.entries(src).flatMap(([t, a]) => a.map((o) => t + o.label)).sort((a, b) => b.length - a.length);
  const re = known.length ? new RegExp('(' + known.map(esc).join('|') + ')(?![\\p{L}\\d])', 'gu') : null;
  const parts = re ? v.split(re) : [v];
  return (
    <Field label={label} hint={hint} error={error} optional={optional} required={required} id={fid}>
      {(ctl) => (
        <div className={cx('vui-mention', className)}>
          <Control multiline invalid={ctl.invalid} disabled={disabled}>
            <div className="vui-mention__wrap">
              <div ref={hl} className="vui-mention__hl" aria-hidden="true">{parts.map((p, i) => (i % 2 ? <mark key={i} className="vui-mention__tok">{p}</mark> : p))}{'\u200b'}</div>
              <div ref={meas} className="vui-mention__hl vui-mention__meas" aria-hidden="true">{q ? v.slice(0, q.start) : ''}<span ref={caret}>{q ? q.t : ''}</span></div>
              <textarea ref={ta} id={ctl.id} rows={rows} className="vui-control__input vui-mention__input" value={v} placeholder={placeholder} disabled={disabled} required={required}
                role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? lid : undefined} aria-activedescendant={open ? lid + '-' + act : undefined}
                aria-invalid={ctl.invalid || undefined} aria-describedby={ctl.describedBy}
                onChange={(e) => { set(e.target.value); update(e); }} onKeyDown={onKeyDown}
                onKeyUp={(e) => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) update(e); }} onClick={update}
                onBlur={() => setTimeout(() => setQ(null), 120)} onScroll={(e) => { if (hl.current) hl.current.scrollTop = e.target.scrollTop; }} />
            </div>
          </Control>
          {open && (
            <Surface variant="overlay" className="vui-mention__pop" role="listbox" id={lid} aria-label={q.t === '@' ? 'People' : 'Suggestions'} style={{ left: pos.left, top: pos.top }}>
              {list.map((o, i) => (
                <Option key={o.id ?? o.label} id={lid + '-' + i} active={i === act} label={o.label} description={o.description}
                  icon={q.t === '@' ? <Avatar size="xs" name={o.label} src={o.src} /> : (o.icon || 'tag')}
                  onMouseDown={(e) => { e.preventDefault(); pick(o); }} onMouseEnter={() => setAct(i)} />
              ))}
            </Surface>
          )}
        </div>
      )}
    </Field>
  );
}
