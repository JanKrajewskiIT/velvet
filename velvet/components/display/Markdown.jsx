import React from 'react';
import { cx } from '../primitives/cx.js';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeUrl = (u) => (/^(https?:|mailto:|#|\/|\.)/i.test(u) ? u : '#');
const refKey = (k) => esc(k.trim().replace(/\s+/g, ' ').toLowerCase());
const anchor = (u, text, title) => { const url = safeUrl(u); const ext = /^https?:/i.test(url); return '<a href="' + url + '"' + (title ? ' title="' + esc(title) + '"' : '') + (ext ? ' target="_blank" rel="noreferrer"' : '') + '>' + text + '</a>'; };
const img = (u, alt, title) => '<img src="' + safeUrl(u) + '" alt="' + alt + '"' + (title ? ' title="' + esc(title) + '"' : '') + ' loading="lazy">';
function emph(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w])__([^_\s](?:[^_]*[^_\s])?)__(?!\w)/g, '$1<strong>$2</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_([^_\s](?:[^_]*[^_\s])?)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>');
}
function inline(s, refs = {}) {
  const tok = []; const put = (h) => { tok.push(h); return '\u0000' + (tok.length - 1) + '\u0000'; };
  s = s.replace(/[ \t]+$/, '').replace(/( {2,}|\\)\n/g, '\u0001');
  s = s.replace(/`([^`]+)`/g, (_, c) => put('<code>' + esc(c) + '</code>'));
  s = s.replace(/<((?:https?:\/\/|mailto:)[^\s>]+)>/gi, (_, u) => put(anchor(u, esc(u.replace(/^mailto:/i, '')))));
  s = s.replace(/<([^\s@<>]+@[^\s@<>]+\.[a-z]{2,})>/gi, (_, e) => put(anchor('mailto:' + e, esc(e))));
  s = esc(s);
  const ref = (k) => refs[refKey(k)];
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;(.*?)&quot;)?\)/g, (_, a, u, t) => put(img(u, a, t)));
  s = s.replace(/!\[([^\]]*)\]\[([^\]]*)\]/g, (m, a, k) => { const r = ref(k || a); return r ? put(img(r.url, a, r.title)) : m; });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;(.*?)&quot;)?\)/g, (_, t, u, ti) => put(anchor(u, emph(t), ti)));
  s = s.replace(/\[([^\]]+)\]\[([^\]]*)\]/g, (m, t, k) => { const r = ref(k || t); return r ? put(anchor(r.url, emph(t), r.title)) : m; });
  s = s.replace(/\[([^\]]+)\](?![(\[:])/g, (m, t) => { const r = ref(t); return r ? put(anchor(r.url, emph(t), r.title)) : m; });
  s = s.replace(/(^|[\s(])((?:https?:\/\/|www\.)[^\s<]*[^\s<.,:;!?)\]'"])/gi, (_, p, u) => p + put(anchor(/^www\./i.test(u) ? 'https://' + u : u.replace(/&amp;/g, '&'), u)));
  s = emph(s).replace(/\u0001/g, '<br>');
  while (/\u0000\d+\u0000/.test(s)) s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => tok[+i]);
  return s;
}
const indentOf = (l) => l.match(/^ */)[0].length;
const LIST = /^( *)([-*+]|\d+[.)])( +|$)/;
function slug(html, ids) {
  const base = html.replace(/<[^>]+>/g, '').replace(/&\w+;|&#\d+;/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'section';
  let id = base; let n = 0;
  while (ids[id]) id = base + '-' + (++n);
  ids[id] = true; return id;
}
function heading(n, text, ctx) { const h = inline(text, ctx.refs); return '<h' + n + ' id="' + slug(h, ctx.ids) + '">' + h + '</h' + n + '>'; }
function renderList(block, ctx) {
  const first = block[0].match(LIST); const base = first[1].length; const ordered = /\d/.test(first[2]);
  const items = [];
  for (const l of block) {
    const m = l.match(LIST);
    if (m && m[1].length < base + 2) items.push({ head: l.slice(m[0].length), off: m[0].length, body: [] });
    else if (items.length) items[items.length - 1].body.push(l);
  }
  const li = items.map(({ head, off, body }) => {
    const ded = body.map((l) => l.slice(Math.min(off, indentOf(l))));
    const cut = ded.findIndex((l) => !l.trim() || LIST.test(l) || /^```/.test(l) || /^>/.test(l));
    const lead = [head, ...(cut < 0 ? ded : ded.slice(0, cut))].join('\n');
    const rest = cut < 0 ? '' : render(ded.slice(cut).join('\n'), ctx);
    const tm = lead.match(/^\[( |x)\]\s+([\s\S]*)/i);
    if (tm) { const on = tm[1] !== ' '; return '<li class="vui-prose__task"><span class="vui-prose__check' + (on ? ' vui-prose__check--on' : '') + '" aria-hidden="true"></span><span' + (on ? ' class="vui-prose__done"' : '') + '>' + inline(tm[2], ctx.refs) + '</span>' + rest + '</li>'; }
    return '<li>' + inline(lead, ctx.refs) + rest + '</li>';
  }).join('');
  const start = ordered ? parseInt(first[2], 10) : 1;
  return ordered ? '<ol' + (start !== 1 ? ' start="' + start + '"' : '') + '>' + li + '</ol>' : '<ul>' + li + '</ul>';
}
function render(src, ctx) {
  const lines = src.split('\n'); const out = []; let i = 0;
  const isBlock = (l) => /^(#{1,6}\s|>|\s*[-*+]\s|\s*\d+[.)]\s|```|---+\s*$|\|)/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^```(\w*)/))) { const buf = []; i++; while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]); i++; out.push('<pre data-lang="' + esc(m[1]) + '"><code>' + esc(buf.join('\n')) + '</code></pre>'); continue; }
    if ((m = l.match(/^(#{1,6})\s+(.*)/))) { out.push(heading(m[1].length, m[2].replace(/\s+#+\s*$/, ''), ctx)); i++; continue; }
    if (/^ {0,3}([-*_])( *\1){2,} *$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (l.startsWith('>')) { const buf = []; while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, '')); out.push('<blockquote>' + render(buf.join('\n'), ctx) + '</blockquote>'); continue; }
    if (/^\|/.test(l) && lines[i + 1] && /^\|?\s*:?-+/.test(lines[i + 1])) {
      const row = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = row(l); const al = row(lines[i + 1]).map((c) => (c.endsWith(':') ? (c.startsWith(':') ? 'center' : 'right') : 'left')); i += 2; const body = [];
      while (i < lines.length && /^\|/.test(lines[i])) body.push(row(lines[i++]));
      out.push('<div class="vui-prose__table"><table><thead><tr>' + head.map((h, k) => '<th style="text-align:' + al[k] + '">' + inline(h, ctx.refs) + '</th>').join('') + '</tr></thead><tbody>' + body.map((r) => '<tr>' + r.map((c, k) => '<td style="text-align:' + al[k] + '">' + inline(c, ctx.refs) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if ((m = l.match(LIST))) {
      const base = m[1].length; const block = [l]; i++;
      const kind = (x) => (/\d/.test(x[2]) ? 'o' : 'u');
      const fits = (n) => { if (indentOf(n) >= base + 2) return true; if (/^ {0,3}([-*_])( *\1){2,} *$/.test(n)) return false; const lm = n.match(LIST); return !!lm && lm[1].length >= base && kind(lm) === kind(m); };
      while (i < lines.length) {
        const n = lines[i];
        if (n.trim()) { if (fits(n)) { block.push(n); i++; continue; } break; }
        let j = i; while (j < lines.length && !lines[j].trim()) j++;
        if (j < lines.length && fits(lines[j])) { while (i < j) block.push(lines[i++]); continue; }
        break;
      }
      out.push(renderList(block, ctx)); continue;
    }
    const buf = [l]; i++;
    while (i < lines.length && lines[i].trim() && !isBlock(lines[i]) && !/^ {0,3}=+\s*$/.test(lines[i])) buf.push(lines[i++]);
    if (i < lines.length && (m = lines[i].match(/^ {0,3}(=+|-+)\s*$/))) { out.push(heading(m[1][0] === '=' ? 1 : 2, buf.join(' ').trim(), ctx)); i++; continue; }
    out.push('<p>' + inline(buf.join('\n'), ctx.refs) + '</p>');
  }
  return out.join('');
}
export function renderMarkdown(src = '') {
  const refs = {}; let fence = false;
  const lines = String(src).replace(/\r/g, '').replace(/^\t+/gm, (t) => '    '.repeat(t.length)).split('\n').filter((l) => {
    if (/^```/.test(l)) fence = !fence;
    if (fence) return true;
    const m = l.match(/^ {0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?(?:\s+["'(](.*)["')])?\s*$/);
    if (!m) return true;
    const k = refKey(m[1]); if (!refs[k]) refs[k] = { url: m[2], title: m[3] };
    return false;
  });
  return render(lines.join('\n'), { refs, ids: {} });
}
export function Markdown({ source, children, size = 'md', className }) {
  const src = source ?? (typeof children === 'string' ? children : '');
  const html = React.useMemo(() => renderMarkdown(src), [src]);
  return <div className={cx('vui-prose', size !== 'md' && 'vui-prose--' + size, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
