import React from 'react';
import { cx } from '../primitives/cx.js';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const KW = /\b(and|or|not|if|else|elif|when|then|def|return|import|from|in|is|true|false|True|False|None|null|for|while|let|const)\b/g;
export function highlightCode(src) {
  return esc(src).split('\n').map((line) => {
    const ci = line.search(/(^|\s)(#|\/\/)/);
    let code = ci >= 0 ? line.slice(0, ci) : line; const com = ci >= 0 ? line.slice(ci) : '';
    const parts = code.split(/("[^"]*"|'[^']*')/);
    code = parts.map((p, i) => i % 2 ? '<span class="tk-s">' + p + '</span>' : p
      .replace(/^(\s*-?\s*)([A-Za-z_][\w.]*)(\s*:)(?!\S)/, '$1<span class="tk-k">$2</span>$3')
      .replace(/^(\s*-?\s*)([A-Za-z_][\w.]*)(\s*:\s)/, '$1<span class="tk-k">$2</span>$3')
      .replace(KW, '<span class="tk-w">$1</span>')
      .replace(/\b([a-z_][\w]*)(?=\()/g, '<span class="tk-f">$1</span>')
      .replace(/(^|[^\w#])(-?\d+(?:\.\d+)?)(?![\w])/g, '$1<span class="tk-n">$2</span>')).join('');
    return code + (com ? '<span class="tk-c">' + com + '</span>' : '');
  }).join('\n');
}
export function CodeEditor({ value, defaultValue = '', onChange, onValueChange, label, hint, error, language = 'text', rows = 12, maxHeight, readOnly = false, lineNumbers = true, highlight = true, placeholder, id, className, ...rest }) {
  const [inner, setInner] = React.useState(defaultValue);
  const v = value != null ? value : inner;
  const taRef = React.useRef(null); const preRef = React.useRef(null); const gutRef = React.useRef(null);
  const autoId = React.useId(); const fid = id || 'ce' + autoId.replace(/:/g, '');
  const lines = v.split('\n').length;
  const sync = () => { const t = taRef.current; if (!t) return; if (preRef.current) { preRef.current.scrollTop = t.scrollTop; preRef.current.scrollLeft = t.scrollLeft; } if (gutRef.current) gutRef.current.scrollTop = t.scrollTop; };
  const change = (e) => { if (value == null) setInner(e.target.value); onChange && onChange(e); onValueChange && onValueChange(e.target.value); };
  const onKeyDown = (e) => {
    if (e.key === 'Tab' && !e.shiftKey && !readOnly) { e.preventDefault(); const t = e.target; const s = t.selectionStart, en = t.selectionEnd; const nv = v.slice(0, s) + '  ' + v.slice(en); if (value == null) setInner(nv); onValueChange && onValueChange(nv); onChange && onChange({ target: { value: nv } }); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2; }); }
  };
  const h = (maxHeight ? undefined : rows * 20 + 24);
  return (
    <div className={cx('vui-ce', error && 'vui-ce--invalid', readOnly && 'vui-ce--ro', className)}>
      {label && <label htmlFor={fid} className="vui-ce__label">{label}<span className="vui-ce__lang">{language}</span></label>}
      <div className="vui-ce__box" style={{ height: h, maxHeight }}>
        {lineNumbers && <div ref={gutRef} className="vui-ce__gutter" aria-hidden="true">{Array.from({ length: lines }, (_, i) => <div key={i}>{i + 1}</div>)}</div>}
        <div className="vui-ce__area">
          {highlight && <pre ref={preRef} className="vui-ce__pre" aria-hidden="true" dangerouslySetInnerHTML={{ __html: highlightCode(v) + '\n' }} />}
          <textarea ref={taRef} id={fid} className={cx('vui-ce__ta', highlight && 'vui-ce__ta--hl')} value={v} onChange={change} onScroll={sync} onKeyDown={onKeyDown} readOnly={readOnly} spellCheck={false} autoCapitalize="off" autoCorrect="off" placeholder={placeholder} aria-invalid={!!error} aria-describedby={hint || error ? fid + '-h' : undefined} {...rest} />
        </div>
      </div>
      {(error || hint) && <div id={fid + '-h'} className={cx('vui-ce__hint', error && 'vui-ce__hint--err')}>{error || hint}</div>}
    </div>
  );
}
