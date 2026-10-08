import React from 'react';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function highlight(code, lang) {
  if (lang === 'bash' || lang === 'sh') return esc(code).replace(/(^|\n)(\$ )/g, '$1<span class="tk-p">$2</span>').replace(/(#.*)/g, '<span class="tk-c">$1</span>');
  const rules = [
    [/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;)/g, 'c'],
    [/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, 's'],
    [/\b(import|from|export|default|const|let|var|function|return|if|else|for|while|class|extends|new|await|async|try|catch|throw|typeof|interface|type|true|false|null|undefined)\b/g, 'k'],
    [/\b(\d+(?:\.\d+)?)\b/g, 'n'],
    [/(&lt;\/?)([A-Za-z][\w.-]*)/g, 't'],
  ];
  let out = esc(code); const store = [];
  for (const [re, cls] of rules) out = out.replace(re, (m, a, b) => { if (cls === 't') { store.push('<span class="tk-t">' + b + '</span>'); return a + '\u0000' + String.fromCharCode(0xe000 + store.length - 1) + '\u0000'; } store.push('<span class="tk-' + cls + '">' + m + '</span>'); return '\u0000' + String.fromCharCode(0xe000 + store.length - 1) + '\u0000'; });
  let prev; do { prev = out; out = out.replace(/\u0000([\ue000-\uf8ff])\u0000/g, (_, k) => store[k.charCodeAt(0) - 0xe000]); } while (out !== prev);
  return out;
}
export function CodeSnippet({ code = '', language = 'jsx', title, tabs, showLineNumbers = true, maxHeight = 320, wrap = false, className }) {
  const [tab, setTab] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const cur = tabs ? tabs[tab] : { code, language, label: title };
  const lines = cur.code.replace(/\n$/, '').split('\n');
  const copy = async () => { try { await navigator.clipboard.writeText(cur.code); } catch (e) {} setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <div className={cx('vui-code', className)}>
      <div className="vui-code__bar">
        {tabs ? <div role="tablist" className="vui-code__tabs">{tabs.map((t, k) => <button key={k} role="tab" type="button" aria-selected={k === tab} className={cx('vui-code__tab', k === tab && 'vui-code__tab--on')} onClick={() => setTab(k)}>{t.label}</button>)}</div>
          : <span className="vui-code__title">{cur.label || cur.language}</span>}
        <button type="button" className={cx('vui-code__copy', copied && 'vui-code__copy--done')} onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'}><Glyph name={(copied ? 'check' : 'copy')} /><span>{copied ? 'Copied' : 'Copy'}</span></button>
        <span className="vui-sr-only" aria-live="polite">{copied ? 'Copied to clipboard' : ''}</span>
      </div>
      <pre className={cx('vui-code__pre', wrap && 'vui-code__pre--wrap')} style={{ maxHeight }} tabIndex={0}><code>
        {lines.map((l, k) => <span key={k} className="vui-code__line">{showLineNumbers && <span className="vui-code__ln" aria-hidden="true">{k + 1}</span>}<span dangerouslySetInnerHTML={{ __html: highlight(l, cur.language) || ' ' }} /></span>)}
      </code></pre>
    </div>
  );
}
