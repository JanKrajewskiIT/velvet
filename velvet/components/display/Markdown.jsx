import React from 'react';
import { cx } from '../primitives/cx.js';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeUrl = (u) => (/^(https?:|mailto:|#|\/|\.)/i.test(u) ? u : '#');
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => '<img src="' + safeUrl(u) + '" alt="' + a + '" loading="lazy">');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => { const url = safeUrl(u); const ext = /^https?:/i.test(url); return '<a href="' + url + '"' + (ext ? ' target="_blank" rel="noreferrer"' : '') + '>' + t + '</a>'; });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>').replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => '<code>' + esc(codes[+i]) + '</code>');
}
export function renderMarkdown(src = '') {
  const lines = String(src).replace(/\r/g, '').split('\n'); const out = []; let i = 0;
  const isBlock = (l) => /^(#{1,6}\s|>|\s*[-*+]\s|\s*\d+[.)]\s|```|---+\s*$|\|)/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^```(\w*)/))) { const buf = []; i++; while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]); i++; out.push('<pre data-lang="' + esc(m[1]) + '"><code>' + esc(buf.join('\n')) + '</code></pre>'); continue; }
    if ((m = l.match(/^(#{1,6})\s+(.*)/))) { const n = m[1].length; const id = m[2].toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, ''); out.push('<h' + n + ' id="' + id + '">' + inline(m[2]) + '</h' + n + '>'); i++; continue; }
    if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l.startsWith('>')) { const buf = []; while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, '')); out.push('<blockquote>' + renderMarkdown(buf.join('\n')) + '</blockquote>'); continue; }
    if (/^\|/.test(l) && lines[i + 1] && /^\|?\s*:?-+/.test(lines[i + 1])) {
      const row = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = row(l); const al = row(lines[i + 1]).map((c) => (c.endsWith(':') ? (c.startsWith(':') ? 'center' : 'right') : 'left')); i += 2; const body = [];
      while (i < lines.length && /^\|/.test(lines[i])) body.push(row(lines[i++]));
      out.push('<div class="vui-prose__table"><table><thead><tr>' + head.map((h, k) => '<th style="text-align:' + al[k] + '">' + inline(h) + '</th>').join('') + '</tr></thead><tbody>' + body.map((r) => '<tr>' + r.map((c, k) => '<td style="text-align:' + al[k] + '">' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if ((m = l.match(/^\s*([-*+]|\d+[.)])\s/))) {
      const ordered = /\d/.test(m[1]); const items = [];
      while (i < lines.length && /^\s*([-*+]|\d+[.)])\s/.test(lines[i])) { items.push(lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, '')); i++; }
      const li = items.map((t) => { const tm = t.match(/^\[( |x)\]\s+(.*)/i); return tm ? '<li class="vui-prose__task"><span class="vui-prose__check' + (tm[1] !== ' ' ? ' vui-prose__check--on' : '') + '" aria-hidden="true"></span><span' + (tm[1] !== ' ' ? ' class="vui-prose__done"' : '') + '>' + inline(tm[2]) + '</span></li>' : '<li>' + inline(t) + '</li>'; }).join('');
      out.push(ordered ? '<ol>' + li + '</ol>' : '<ul>' + li + '</ul>'); continue;
    }
    const buf = [l]; i++; while (i < lines.length && lines[i].trim() && !isBlock(lines[i])) buf.push(lines[i++]);
    out.push('<p>' + inline(buf.join(' ')) + '</p>');
  }
  return out.join('');
}
export function Markdown({ source, children, size = 'md', className }) {
  const src = source ?? (typeof children === 'string' ? children : '');
  const html = React.useMemo(() => renderMarkdown(src), [src]);
  return <div className={cx('vui-prose', size !== 'md' && 'vui-prose--' + size, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
