import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const LEVELS = ['debug', 'info', 'warn', 'error'];
const detect = (s) => {
  const m = /\b(ERROR|ERR|FATAL|WARN(?:ING)?|INFO|DEBUG|TRACE)\b/i.exec(s || '');
  if (!m) return 'info';
  const k = m[1].toUpperCase();
  return k.startsWith('ERR') || k === 'FATAL' ? 'error' : k.startsWith('WARN') ? 'warn' : k === 'INFO' ? 'info' : 'debug';
};
const ts = (t) => {
  if (t == null) return '';
  if (typeof t === 'string') return t;
  const d = new Date(t);
  return d.toLocaleTimeString('en-GB', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
};
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function LogViewer({ lines = [], title = 'Logs', height = 320, follow: followProp = true, showTimestamps = true, lineNumbers = true, wrap: wrapProp = false, levels: levelsProp, className }) {
  const rows = React.useMemo(() => lines.map((l, i) => (typeof l === 'string' ? { message: l, level: detect(l), i } : { ...l, level: l.level || detect(l.message), i })), [lines]);
  const [q, setQ] = React.useState('');
  const [lv, setLv] = React.useState(() => new Set(levelsProp || LEVELS));
  const [wrap, setWrap] = React.useState(wrapProp);
  const [follow, setFollow] = React.useState(followProp);
  const [unseen, setUnseen] = React.useState(0);
  const body = React.useRef(null), seen = React.useRef(rows.length);
  const counts = LEVELS.reduce((o, l) => ({ ...o, [l]: rows.filter((r) => r.level === l).length }), {});
  const ql = q.trim().toLowerCase();
  const shown = rows.filter((r) => lv.has(r.level) && (!ql || (r.message + ' ' + (r.source || '')).toLowerCase().includes(ql)));
  React.useLayoutEffect(() => {
    const el = body.current; if (!el) return;
    if (follow) { el.scrollTop = el.scrollHeight; setUnseen(0); } else if (rows.length > seen.current) setUnseen((u) => u + rows.length - seen.current);
    seen.current = rows.length;
  }, [rows.length, follow, shown.length]);
  const hl = (text) => {
    if (!ql) return text;
    return String(text).split(new RegExp('(' + reEsc(q.trim()) + ')', 'gi')).map((p, k) => (k % 2 ? <mark key={k}>{p}</mark> : p));
  };
  const toggle = (l) => { const n = new Set(lv); if (n.has(l)) n.delete(l); else n.add(l); setLv(n.size ? n : new Set(LEVELS)); };
  return (
    <div className={cx('vui-code', 'vui-log', className)}>
      <div className="vui-code__bar vui-log__bar">
        <span className="vui-code__title">{title}</span>
        <div className="vui-log__levels" role="group" aria-label="Levels">
          {LEVELS.map((l) => <button key={l} type="button" className={'vui-log__lvl vui-log__lvl--' + l} aria-pressed={lv.has(l)} onClick={() => toggle(l)}>{l}<span>{counts[l]}</span></button>)}
        </div>
        <label className="vui-log__search"><Glyph name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" aria-label="Filter log lines" /></label>
        <button type="button" className="vui-code__copy" aria-pressed={wrap} onClick={() => setWrap(!wrap)}>{wrap ? 'No wrap' : 'Wrap'}</button>
      </div>
      <div ref={body} className={cx('vui-log__body', wrap && 'vui-log__body--wrap')} style={{ height }} tabIndex={0} role="log" aria-live="off" aria-label={title}
        onScroll={(e) => { const el = e.currentTarget; const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24; if (bottom !== follow) setFollow(bottom); }}>
        {shown.length ? shown.map((r) => (
          <div key={r.i} className={'vui-log__row vui-log__row--' + r.level}>
            {lineNumbers && <span className="vui-log__ln">{r.i + 1}</span>}
            {showTimestamps && r.ts != null && <span className="vui-log__ts">{ts(r.ts)}</span>}
            <span className="vui-log__lv">{r.level.toUpperCase()}</span>
            {r.source && <span className="vui-log__src">{r.source}</span>}
            <span className="vui-log__msg">{hl(r.message)}</span>
          </div>
        )) : <div className="vui-log__empty">No lines match the filter.</div>}
      </div>
      {!follow && <button type="button" className="vui-log__jump" onClick={() => setFollow(true)}><Glyph name="arrow-down" />{unseen ? unseen + ' new' : 'Latest'}</button>}
    </div>
  );
}
