import React from 'react';
import { FieldLabel } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';

/* ---------- model: allowed markup ---------- */
const MARKS = { bold: 'STRONG', italic: 'EM', underline: 'U', strike: 'S', code: 'CODE' };
const MARK_SEL = 'strong,em,u,s,code,a';
const LEAF_SEL = ':scope>p,:scope>h2,:scope>h3,:scope>blockquote,:scope>pre,li';
const TOP = /^(P|H2|H3|BLOCKQUOTE|PRE|UL|OL)$/;
const ALIAS = { B: 'STRONG', I: 'EM', STRIKE: 'S', DEL: 'S', INS: 'U', DIV: 'P', H1: 'H2', H4: 'H3', H5: 'H3', H6: 'H3', TT: 'CODE', KBD: 'CODE' };
const ALLOWED = { P: 1, H2: 1, H3: 1, BLOCKQUOTE: 1, PRE: 1, UL: 1, OL: 1, LI: 1, STRONG: 1, EM: 1, U: 1, S: 1, CODE: 1, A: 1, BR: 1 };
const DROP = /^(SCRIPT|STYLE|TEMPLATE|IFRAME|OBJECT|EMBED|SVG|MATH|HEAD|META|LINK|TITLE|NOSCRIPT|IMG|VIDEO|AUDIO|CANVAS|INPUT|BUTTON|SELECT|TEXTAREA)$/;
const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;

function cleanTree(node) {
  [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) return;
    if (n.nodeType !== 1) { n.remove(); return; }
    const raw = n.tagName.toUpperCase();
    if (DROP.test(raw)) { n.remove(); return; }
    const tag = ALIAS[raw] || raw;
    if (!ALLOWED[tag]) { cleanTree(n); n.replaceWith(...n.childNodes); return; }
    const href = tag === 'A' ? (n.getAttribute('href') || '').trim() : null;
    let el = n;
    if (tag !== raw) { el = document.createElement(tag); el.append(...n.childNodes); n.replaceWith(el); }
    [...el.attributes].forEach((a) => el.removeAttribute(a.name));
    if (tag === 'A') { if (href && SAFE_URL.test(href)) el.setAttribute('href', href); else { cleanTree(el); el.replaceWith(...el.childNodes); return; } }
    cleanTree(el);
  });
}
function fill(el) {
  el.querySelectorAll(MARK_SEL).forEach((m) => { if (!m.textContent) m.replaceWith(...m.childNodes); });
  if (!el.textContent && !el.querySelector('br')) el.append(document.createElement('br'));
}
function structure(root) {
  root.querySelectorAll('li > ul, li > ol').forEach((l) => { l.parentNode.after(...l.children); l.remove(); });
  root.querySelectorAll('li p, li h2, li h3, li blockquote, li pre, p p, h2 p, h3 p, blockquote p, pre p, p h2, p h3').forEach((b) => { if (b.nextSibling) b.after(document.createElement('br')); b.replaceWith(...b.childNodes); });
  let run = null;
  [...root.childNodes].forEach((n) => {
    if (n.nodeType === 1 && TOP.test(n.tagName)) { run = null; return; }
    if (n.nodeType === 1 && n.tagName === 'LI') { const p = n.previousElementSibling; if (p && /^(UL|OL)$/.test(p.tagName) && n.previousSibling === p) p.append(n); else { const l = document.createElement('ul'); n.before(l); l.append(n); } run = null; return; }
    if (!run && ((n.nodeType === 3 && !n.data.trim()) || (n.nodeType === 1 && n.tagName === 'BR'))) { n.remove(); return; }
    if (!run) { run = document.createElement('p'); n.before(run); }
    run.append(n);
  });
  root.querySelectorAll('ul,ol').forEach((l) => {
    [...l.childNodes].forEach((c) => { if (c.nodeType === 1 && c.tagName === 'LI') return; if (c.nodeType === 3 && !c.data.trim()) { c.remove(); return; } const li = document.createElement('li'); c.before(li); li.append(c); });
    if (!l.children.length) l.remove();
  });
  root.querySelectorAll(LEAF_SEL).forEach(fill);
  if (!root.firstChild) root.innerHTML = '<p><br></p>';
}
/** Allow-list sanitizer used for defaultValue, paste and output. */
export function sanitizeRichText(html) {
  const t = document.createElement('template');
  t.innerHTML = html || '';
  cleanTree(t.content);
  const d = document.createElement('div');
  d.append(t.content);
  structure(d);
  tidy(d);
  return d.innerHTML;
}

/* ---------- selection helpers ---------- */
const getSel = () => window.getSelection();
function rangeIn(root) { const s = getSel(); if (!root || !s || !s.rangeCount) return null; const r = s.getRangeAt(0); return root.contains(r.startContainer) && root.contains(r.endContainer) ? r : null; }
function select(r) { const s = getSel(); s.removeAllRanges(); s.addRange(r); }
function caretTo(node, off) { const r = document.createRange(); r.setStart(node, off); r.collapse(true); select(r); }
function caretAfter(node) { const r = document.createRange(); r.setStartAfter(node); r.collapse(true); select(r); }
function closestTag(n, tag, root) { while (n && n !== root) { if (n.nodeType === 1 && n.tagName === tag) return n; n = n.parentNode; } return null; }
function blockOf(n, root) {
  if (!n || n === root || !root.contains(n)) return null;
  while (n.parentNode !== root) { if (n.nodeType === 1 && n.tagName === 'LI') return n; n = n.parentNode; }
  if (n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName)) return n.querySelector('li');
  return n.nodeType === 1 ? n : null;
}
const leaves = (root) => [...root.querySelectorAll(LEAF_SEL)];
function textBefore(b, node, off) { const r = document.createRange(); r.setStart(b, 0); r.setEnd(node, off); return r.toString(); }
function pointIn(b, n) { const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let t, last = null; while ((t = w.nextNode())) { last = t; if (n <= t.length) return [t, n]; n -= t.length; } return last ? [last, last.length] : [b, 0]; }
function endOf(el) { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t, last = null; while ((t = w.nextNode())) last = t; return last ? [last, last.length] : [el, el.childNodes.length]; }
function saveSel(root) {
  const r = rangeIn(root); if (!r) return null;
  const L = leaves(root);
  const p = (node, off) => { const b = blockOf(node, root); return b ? [L.indexOf(b), textBefore(b, node, off).length] : [0, 0]; };
  return [p(r.startContainer, r.startOffset), p(r.endContainer, r.endOffset)];
}
function restoreSel(root, s) {
  if (!s) return; const L = leaves(root); if (!L.length) return;
  const at = ([i, o]) => pointIn(L[Math.max(0, Math.min(i, L.length - 1))], o);
  const r = document.createRange(); r.setStart(...at(s[0])); r.setEnd(...at(s[1])); select(r);
}
function textNodesIn(r, root) {
  const c = r.commonAncestorContainer;
  const ok = (t) => t.length && !(t === r.startContainer && r.startOffset >= t.length) && !(t === r.endContainer && r.endOffset === 0) && blockOf(t, root) && !/^(UL|OL)$/.test(t.parentNode.tagName);
  if (c.nodeType === 3) return ok(c) ? [c] : [];
  const out = []; const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let t;
  while ((t = w.nextNode())) if (r.intersectsNode(t) && ok(t)) out.push(t);
  return out;
}
function splitRange(r) {
  let sc = r.startContainer, so = r.startOffset, ec = r.endContainer, eo = r.endOffset;
  if (ec.nodeType === 3 && eo > 0 && eo < ec.length) ec.splitText(eo);
  if (sc.nodeType === 3 && so > 0 && so < sc.length) { const n = sc.splitText(so); if (ec === sc) { ec = n; eo -= so; } sc = n; so = 0; }
  const out = document.createRange(); out.setStart(sc, so); out.setEnd(ec, eo); return out;
}
const unwrap = (m) => m.replaceWith(...m.childNodes);
function isolate(m, t) {
  const a = document.createRange(); a.setStart(m, 0); a.setEnd(t, 0);
  const fa = a.extractContents(); if (fa.textContent) { const c = m.cloneNode(false); c.append(fa); m.before(c); } else m.before(fa);
  const b = document.createRange(); b.setStart(t, t.length); b.setEnd(m, m.childNodes.length);
  const fb = b.extractContents(); if (fb.textContent) { const c = m.cloneNode(false); c.append(fb); m.after(c); } else m.after(fb);
}
function tidy(root) {
  root.querySelectorAll('strong strong, em em, u u, s s, code code, a a').forEach(unwrap);
  root.querySelectorAll(MARK_SEL).forEach((m) => { if (!m.textContent) m.replaceWith(...m.childNodes); });
  for (let again = true; again;) {
    again = false;
    for (const m of root.querySelectorAll(MARK_SEL)) { const n = m.nextSibling; if (n && n.nodeType === 1 && n.tagName === m.tagName && n.getAttribute('href') === m.getAttribute('href')) { m.append(...n.childNodes); n.remove(); again = true; break; } }
  }
  root.querySelectorAll('ul+ul,ol+ol').forEach((l) => { const p = l.previousElementSibling; if (p && p.tagName === l.tagName) { p.append(...l.childNodes); l.remove(); } });
  root.normalize();
}
const keepSel = (root, fn) => { const s = saveSel(root); fn(); tidy(root); restoreSel(root, s); };

/* ---------- commands ---------- */
function applyMark(root, tag, on, attrs) {
  const r0 = rangeIn(root); if (!r0 || r0.collapsed) return;
  const r = splitRange(r0);
  const texts = textNodesIn(r, root).filter((t) => !(tag === 'CODE' && closestTag(t, 'PRE', root)));
  if (!texts.length) return;
  if (on === undefined) on = !texts.every((t) => closestTag(t, tag, root));
  texts.forEach((t) => {
    const m = closestTag(t, tag, root);
    if (m && (!on || attrs)) { isolate(m, t); unwrap(m); }
    if (on && (!m || attrs)) { const el = document.createElement(tag); if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); t.before(el); el.append(t); }
  });
  const sr = document.createRange(); const l = texts[texts.length - 1]; sr.setStart(texts[0], 0); sr.setEnd(l, l.length); select(sr);
  keepSel(root, () => {});
}
function removeLinks(root) {
  const r = rangeIn(root); if (!r) return;
  const nodes = r.collapsed ? [r.startContainer] : textNodesIn(r, root);
  keepSel(root, () => nodes.forEach((t) => { const a = closestTag(t, 'A', root); if (a) unwrap(a); }));
}
function retag(b, tag) { const el = document.createElement(tag); el.append(...b.childNodes); b.replaceWith(el); fill(el); return el; }
function liftLi(li, tag = 'P') {
  const list = li.parentNode; const after = []; for (let n = li.nextSibling; n; n = n.nextSibling) after.push(n);
  const el = document.createElement(tag); el.append(...li.childNodes); fill(el); list.after(el);
  if (after.length) { const nl = document.createElement(list.tagName); nl.append(...after); el.after(nl); }
  li.remove(); if (!list.children.length) list.remove();
  return el;
}
function blocksIn(root) {
  const r = rangeIn(root); if (!r) return [];
  const a = blockOf(r.startContainer, root), b = blockOf(r.endContainer, root); if (!a) return [];
  const L = leaves(root); const i = L.indexOf(a), j = b ? L.indexOf(b) : i;
  return L.slice(i, Math.max(i, j) + 1);
}
function setBlock(root, tag) {
  const bs = blocksIn(root); if (!bs.length) return;
  const target = bs.every((b) => b.tagName === tag) ? 'P' : tag;
  keepSel(root, () => bs.forEach((b) => { if (b.tagName === 'LI') liftLi(b, target); else if (b.tagName !== target) retag(b, target); }));
}
function setList(root, type) {
  const bs = blocksIn(root); if (!bs.length) return;
  const all = bs.every((b) => b.tagName === 'LI' && b.parentNode.tagName === type);
  keepSel(root, () => bs.forEach((b) => {
    if (all) { liftLi(b, 'P'); return; }
    if (b.tagName === 'LI') { const l = b.parentNode; if (l.tagName !== type) { const nl = document.createElement(type); nl.append(...l.childNodes); l.replaceWith(nl); } return; }
    const li = document.createElement('li'); li.append(...b.childNodes); fill(li);
    const prev = b.previousElementSibling;
    if (prev && prev.tagName === type) { prev.append(li); b.remove(); } else { const nl = document.createElement(type); nl.append(li); b.replaceWith(nl); }
  }));
}
function splitBlock(b, r) {
  const tail = document.createRange(); tail.setStart(r.startContainer, r.startOffset); tail.setEnd(b, b.childNodes.length);
  const frag = tail.extractContents();
  const tag = /^H[23]$/.test(b.tagName) && !frag.textContent ? 'P' : b.tagName;
  const el = document.createElement(tag); el.append(frag); fill(b); fill(el); b.after(el);
  return el;
}
function onEnter(root) {
  let r = rangeIn(root); if (!r) return; if (!r.collapsed) { r.deleteContents(); r = rangeIn(root); }
  const b = blockOf(r.startContainer, root); if (!b) return;
  if (b.tagName === 'PRE') {
    const before = textBefore(b, r.startContainer, r.startOffset); const after = b.textContent.slice(before.length);
    if (before.endsWith('\n') && /^\n?$/.test(after)) { b.textContent = before.slice(0, -1); fill(b); const p = document.createElement('p'); p.append(document.createElement('br')); b.after(p); caretTo(p, 0); return; }
    const tn = document.createTextNode(after ? '\n' : '\n\n'); r.insertNode(tn); caretTo(tn, 1); return;
  }
  if (!b.textContent && /^(LI|BLOCKQUOTE|H2|H3)$/.test(b.tagName)) { const el = b.tagName === 'LI' ? liftLi(b, 'P') : retag(b, 'P'); caretTo(el, 0); return; }
  const el = splitBlock(b, r); caretTo(...pointIn(el, 0));
}
function onBreak(root) {
  const r = rangeIn(root); if (!r) return; if (!r.collapsed) r.deleteContents();
  const b = blockOf(r.startContainer, root); if (!b) return;
  if (b.tagName === 'PRE') { const after = b.textContent.slice(textBefore(b, r.startContainer, r.startOffset).length); const tn = document.createTextNode(after ? '\n' : '\n\n'); r.insertNode(tn); caretTo(tn, 1); return; }
  const br = document.createElement('br'); r.insertNode(br);
  const rest = document.createRange(); rest.setStartAfter(br); rest.setEnd(b, b.childNodes.length);
  if (!rest.toString() && !rest.cloneContents().querySelector('br')) br.after(document.createElement('br'));
  caretAfter(br);
}
function insertPending(root, text, pend) {
  const r = rangeIn(root); if (!r) return; if (!r.collapsed) r.deleteContents();
  const pos = r.cloneRange();
  Object.entries(pend).forEach(([tag, on]) => {
    if (on) return; const m = closestTag(pos.startContainer, tag, root); if (!m) return;
    const tail = document.createRange(); tail.setStart(pos.startContainer, pos.startOffset); tail.setEnd(m, m.childNodes.length);
    const f = tail.extractContents(); if (f.textContent) { const c = m.cloneNode(false); c.append(f); m.after(c); }
    pos.setStartAfter(m); pos.collapse(true);
  });
  const t = document.createTextNode(text); let node = t;
  Object.entries(pend).forEach(([tag, on]) => { if (on && !closestTag(pos.startContainer, tag, root)) { const el = document.createElement(tag); el.append(node); node = el; } });
  pos.insertNode(node); caretTo(t, t.length);
  keepSel(root, () => {});
}
function insertContent(root, html) {
  const r = rangeIn(root); if (!r) return; if (!r.collapsed) r.deleteContents();
  const t = document.createElement('template'); t.innerHTML = html; const blocks = [...t.content.children];
  if (!blocks.length) return;
  const b = blockOf(r.startContainer, root);
  if (!b || (blocks.length === 1 && !/^(UL|OL)$/.test(blocks[0].tagName))) {
    const inner = document.createDocumentFragment(); inner.append(...blocks[0].childNodes); const last = inner.lastChild;
    if (b) { r.insertNode(inner); if (last) caretAfter(last); } else { root.append(...blocks); caretTo(...endOf(root.lastElementChild)); }
    return;
  }
  const tail = splitBlock(b, r);
  let nodes = blocks;
  if (b.tagName === 'LI') nodes = blocks.flatMap((x) => { if (/^(UL|OL)$/.test(x.tagName)) return [...x.children]; const li = document.createElement('li'); li.append(...x.childNodes); return [li]; });
  let ref = b; nodes.forEach((n) => { ref.after(n); ref = n; });
  if (!b.textContent) b.remove();
  if (!tail.textContent) tail.remove();
  const last = /^(UL|OL)$/.test(ref.tagName) ? ref.lastElementChild : ref;
  caretTo(...endOf(last));
}
function markdown(root, ch, beforeMutate) {
  const r = rangeIn(root); if (!r || !r.collapsed) return false;
  const b = blockOf(r.startContainer, root); if (!b) return false;
  if (ch === ' ' && b.tagName === 'P') {
    const m = textBefore(b, r.startContainer, r.startOffset).match(/^(#{1,2}|[-*+]|1[.)]|>|```)[\s\u00a0]$/);
    if (m) {
      beforeMutate();
      const pre = document.createRange(); pre.setStart(b, 0); pre.setEnd(r.startContainer, r.startOffset); pre.deleteContents(); fill(b); caretTo(...pointIn(b, 0));
      const k = m[1];
      if (k === '#') setBlock(root, 'H2'); else if (k === '##') setBlock(root, 'H3'); else if (k === '>') setBlock(root, 'BLOCKQUOTE'); else if (k === '```') setBlock(root, 'PRE'); else setList(root, k[0] === '1' ? 'OL' : 'UL');
      return true;
    }
  }
  const node = r.startContainer;
  if (node.nodeType !== 3 || b.tagName === 'PRE' || closestTag(node, 'CODE', root)) return false;
  const before = node.data.slice(0, r.startOffset);
  const rules = [[/\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/, 'STRONG', 2], [/~~([^~\s](?:[^~]*[^~\s])?)~~$/, 'S', 2], [/(?:^|[^*\w])\*([^*\s](?:[^*]*[^*\s])?)\*$/, 'EM', 1], [/(?:^|[^_\w])_([^_\s](?:[^_]*[^_\s])?)_$/, 'EM', 1], [/`([^`]+)`$/, 'CODE', 1]];
  for (const [re, tag, n] of rules) {
    const m = before.match(re); if (!m || closestTag(node, tag, root)) continue;
    beforeMutate();
    const end = r.startOffset, start = end - m[1].length - 2 * n;
    const tail = node.splitText(end); const mid = node.splitText(start); mid.data = m[1];
    const el = document.createElement(tag); mid.before(el); el.append(mid); caretTo(tail, 0);
    return tag;
  }
  return false;
}
function fixLive(root) {
  const bad = !root.firstChild || root.querySelector(':scope>div,:scope>br,:scope>strong,:scope>em,:scope>u,:scope>s,:scope>code,:scope>a,span,font,b,i,[style]') || [...root.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
  if (!bad) return;
  const r = rangeIn(root); const raw = r && [r.startContainer, r.startOffset]; const s = saveSel(root);
  root.querySelectorAll('[style]').forEach((n) => n.removeAttribute('style'));
  root.querySelectorAll('span,font').forEach(unwrap);
  root.querySelectorAll('b,i').forEach((n) => { const el = document.createElement(n.tagName === 'B' ? 'strong' : 'em'); el.append(...n.childNodes); n.replaceWith(el); });
  root.querySelectorAll(':scope>div').forEach((d) => retag(d, 'P'));
  structure(root);
  if (raw && raw[0].isConnected && root.contains(raw[0])) caretTo(raw[0], Math.min(raw[1], raw[0].nodeType === 3 ? raw[0].length : raw[0].childNodes.length));
  else if (s) restoreSel(root, s); else caretTo(...pointIn(root.querySelector(LEAF_SEL), 0));
}
function getHTML(root) {
  const c = root.cloneNode(true);
  c.querySelectorAll(LEAF_SEL).forEach((b) => { const l = b.lastChild; if (b.textContent && l && l.nodeName === 'BR' && !(l.previousSibling && l.previousSibling.nodeName === 'BR')) l.remove(); });
  return sanitizeRichText(c.innerHTML);
}

/* ---------- keyboard ---------- */
const MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
function matches(e, keys) {
  const p = keys.split('+'); const k = p[p.length - 1];
  const code = /^[a-z]$/.test(k) ? 'Key' + k.toUpperCase() : /^\d$/.test(k) ? 'Digit' + k : k;
  return (e.metaKey || e.ctrlKey) === p.includes('mod') && e.shiftKey === p.includes('shift') && e.altKey === p.includes('alt') && e.code === code;
}
const fmtKeys = (keys) => { const p = keys.split('+'); return MAC ? p.map((x) => ({ mod: '⌘', shift: '⇧', alt: '⌥' }[x] || x.toUpperCase())).join('') : p.map((x) => ({ mod: 'Ctrl', shift: 'Shift', alt: 'Alt' }[x] || x.toUpperCase())).join('+'); };
const NAV = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);
const TOOLS = [
  { id: 'bold', icon: 'bold', label: 'Bold', keys: 'mod+b', min: 1 },
  { id: 'italic', icon: 'italic', label: 'Italic', keys: 'mod+i', min: 1 },
  { id: 'underline', icon: 'underline', label: 'Underline', keys: 'mod+u' },
  { id: 'strike', icon: 'strikethrough', label: 'Strikethrough', keys: 'mod+shift+x' },
  { id: 'code', icon: 'code', label: 'Inline code', keys: 'mod+e' },
  { sep: 1 },
  { id: 'H2', text: 'H2', label: 'Heading', keys: 'mod+alt+2' },
  { id: 'H3', text: 'H3', label: 'Subheading', keys: 'mod+alt+3' },
  { id: 'UL', icon: 'list', label: 'Bulleted list', keys: 'mod+shift+8', min: 1 },
  { id: 'OL', icon: 'list-ordered', label: 'Numbered list', keys: 'mod+shift+7', min: 1 },
  { id: 'BLOCKQUOTE', icon: 'message-square', label: 'Quote', keys: 'mod+shift+9' },
  { id: 'PRE', text: '{ }', label: 'Code block', keys: 'mod+alt+c' },
  { sep: 1, min: 1 },
  { id: 'link', icon: 'link', label: 'Link', keys: 'mod+k', min: 1 },
  { spacer: 1 },
  { id: 'undo', icon: 'rotate-ccw', label: 'Undo', keys: 'mod+z' },
  { id: 'redo', icon: 'rotate-ccw', label: 'Redo', keys: 'mod+shift+z', flip: 1 },
];
const normUrl = (v) => { v = (v || '').trim(); if (!v) return ''; if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(v)) return 'mailto:' + v; if (!/^[a-z][\w+.-]*:/i.test(v) && !/^[/#]/.test(v)) { if (!/^[\w-]+(\.[\w-]+)+/.test(v)) return null; v = 'https://' + v; } return SAFE_URL.test(v) ? v : null; };

export function RichTextEditor({ label, hint, error, defaultValue = '', onChange: onChangeProp, onValueChange, placeholder = 'Write something…', minHeight = 140, maxHeight, maxLength, toolbar = 'full', disabled, readOnly, className }) {
  const onChange = onChangeProp || onValueChange;
  const ed = React.useRef(null);
  const bar = React.useRef(null);
  const id = React.useId();
  const [st, setSt] = React.useState({});
  const [len, setLen] = React.useState(0);
  const [empty, setEmpty] = React.useState(true);
  const [link, setLink] = React.useState(null);
  const [rove, setRove] = React.useState(0);
  const [, force] = React.useReducer((x) => x + 1, 0);
  const pend = React.useRef({});
  const hist = React.useRef({ stack: [], i: -1, t: null });
  const lastOut = React.useRef(null);
  const api = React.useRef({});
  const editable = !disabled && !readOnly;

  const refresh = () => {
    const root = ed.current; const r = rangeIn(root); if (!r) return;
    const texts = r.collapsed ? null : textNodesIn(r, root); const s = {};
    Object.entries(MARKS).forEach(([k, tag]) => { s[k] = tag in pend.current ? pend.current[tag] : r.collapsed ? !!closestTag(r.startContainer, tag, root) : texts.length > 0 && texts.every((t) => closestTag(t, tag, root)); });
    const b = blockOf(r.startContainer, root); s.block = b ? b.tagName : 'P'; s.list = b && b.tagName === 'LI' ? b.parentNode.tagName : null;
    s.link = !!closestTag(r.startContainer, 'A', root) || !!(texts && texts.some((t) => closestTag(t, 'A', root)));
    setSt(s);
  };
  const after = () => {
    const root = ed.current; const text = root.innerText.replace(/\n+$/, '');
    const isEmpty = !root.textContent && root.children.length <= 1 && !root.querySelector('li,h2,h3,blockquote,pre');
    setEmpty(isEmpty); setLen(text.trim() ? [...text].length : 0); refresh();
    const out = isEmpty ? '' : getHTML(root);
    if (lastOut.current !== null && out !== lastOut.current && onChange) onChange(out, text);
    lastOut.current = out;
  };
  const record = () => {
    const h = hist.current; clearTimeout(h.t); h.t = null; const root = ed.current;
    const snap = { html: root.innerHTML, sel: saveSel(root) }; const cur = h.stack[h.i];
    if (cur && cur.html === snap.html) { if (snap.sel) cur.sel = snap.sel; return; }
    h.stack = h.stack.slice(0, h.i + 1); h.stack.push(snap); if (h.stack.length > 200) h.stack.shift(); h.i = h.stack.length - 1; force();
  };
  const recordSoon = () => { const h = hist.current; clearTimeout(h.t); h.t = setTimeout(record, 500); };
  const travel = (d) => {
    if (hist.current.t) record();
    const h = hist.current; const j = h.i + d; if (j < 0 || j >= h.stack.length) return;
    h.i = j; const s = h.stack[j]; const root = ed.current; root.innerHTML = s.html; root.focus(); restoreSel(root, s.sel); pend.current = {}; after(); force();
  };
  const run = (fn) => {
    const root = ed.current; if (!editable) return;
    const saved = saveSel(root); if (document.activeElement !== root) root.focus();
    if (saved) restoreSel(root, saved); else if (!rangeIn(root)) caretTo(...endOf(root.lastElementChild || root));
    if (hist.current.t) record();
    fn(root); record(); after();
  };
  const toggleMark = (k) => run((root) => {
    const tag = MARKS[k]; const r = rangeIn(root); if (!r) return;
    if (!r.collapsed) { applyMark(root, tag); return; }
    const active = tag in pend.current ? pend.current[tag] : !!closestTag(r.startContainer, tag, root);
    const base = !!closestTag(r.startContainer, tag, root);
    if (!active === base) delete pend.current[tag]; else pend.current[tag] = !active;
  });
  const openLink = () => {
    const root = ed.current; if (!editable) return; if (!rangeIn(root)) { root.focus(); if (!rangeIn(root)) caretTo(...endOf(root.lastElementChild || root)); }
    const r = rangeIn(root); if (!r) return;
    const a = closestTag(r.startContainer, 'A', root) || (!r.collapsed && textNodesIn(r, root).map((t) => closestTag(t, 'A', root)).find(Boolean));
    setLink({ href: a ? a.getAttribute('href') : '', sel: saveSel(root), existing: !!a, err: null });
  };
  const closeLink = () => { const l = link; setLink(null); const root = ed.current; root.focus(); if (l) restoreSel(root, l.sel); };
  const commitLink = (remove) => {
    const l = link; const url = remove ? '' : normUrl(l.href);
    if (url === null) { setLink({ ...l, err: 'Enter a web address like velvet.design or an email' }); return; }
    setLink(null); const root = ed.current; root.focus(); restoreSel(root, l.sel);
    run((root) => {
      const r = rangeIn(root); if (!r) return;
      if (!url) { removeLinks(root); return; }
      if (r.collapsed) {
        const a = closestTag(r.startContainer, 'A', root); if (a) { a.setAttribute('href', url); return; }
        const el = document.createElement('a'); el.setAttribute('href', url); el.textContent = l.href.trim().replace(/^mailto:/, ''); r.insertNode(el); caretAfter(el); pend.current = { A: false }; return;
      }
      applyMark(root, 'A', true, { href: url });
    });
  };
  const exec = (tid) => {
    if (MARKS[tid]) return toggleMark(tid);
    if (tid === 'link') return openLink();
    if (tid === 'undo') return travel(-1);
    if (tid === 'redo') return travel(1);
    if (tid === 'UL' || tid === 'OL') return run((root) => setList(root, tid));
    run((root) => setBlock(root, tid));
  };
  api.current = { run, travel, after, recordSoon, record, refresh };

  React.useEffect(() => {
    const root = ed.current;
    root.innerHTML = sanitizeRichText(defaultValue);
    record(); after();
    const bi = (e) => {
      const t = e.inputType; const A = api.current;
      if (t === 'historyUndo' || t === 'historyRedo') { e.preventDefault(); A.travel(t === 'historyUndo' ? -1 : 1); return; }
      if (/^format/.test(t)) { e.preventDefault(); return; }
      if (t === 'insertParagraph') { e.preventDefault(); A.run(onEnter); return; }
      if (t === 'insertLineBreak') { e.preventDefault(); A.run(onBreak); return; }
      if (t === 'insertText' && e.data && !e.isComposing && Object.keys(pend.current).length) { e.preventDefault(); insertPending(root, e.data, pend.current); pend.current = {}; A.after(); A.recordSoon(); }
    };
    let raf = 0;
    const sc = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (rangeIn(root)) api.current.refresh(); }); };
    root.addEventListener('beforeinput', bi); document.addEventListener('selectionchange', sc);
    return () => { root.removeEventListener('beforeinput', bi); document.removeEventListener('selectionchange', sc); cancelAnimationFrame(raf); clearTimeout(hist.current.t); };
  }, []);

  const onInput = (e) => {
    const root = ed.current; const ne = e.nativeEvent; fixLive(root);
    if (ne.inputType === 'insertText' && ne.data && !ne.isComposing && /[ *_`~]$/.test(ne.data)) {
      const tag = markdown(root, ne.data.slice(-1), record);
      if (tag) { if (typeof tag === 'string') pend.current = { [tag]: false }; record(); } else recordSoon();
    } else recordSoon();
    after();
  };
  const onKeyDown = (e) => {
    if (NAV.has(e.key)) pend.current = {};
    if (!(e.metaKey || e.ctrlKey)) return;
    const hit = TOOLS.find((t) => t.keys && matches(e, t.keys)) || (matches(e, 'mod+y') && { id: 'redo' });
    if (hit) { e.preventDefault(); exec(hit.id); }
  };
  const onPaste = (e) => {
    e.preventDefault(); const cd = e.clipboardData; const html = cd.getData('text/html'); const text = cd.getData('text/plain');
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const fromText = () => text.split(/\r?\n/).filter((l, i, a) => l.trim() || (i > 0 && i < a.length - 1)).map((l) => '<p>' + (esc(l) || '<br>') + '</p>').join('');
    run((root) => insertContent(root, sanitizeRichText(html || fromText())));
  };
  const tools = toolbar === 'minimal' ? TOOLS.filter((t) => t.min || t.spacer) : TOOLS;
  const btns = tools.filter((t) => t.id);
  const isOn = (t) => (MARKS[t.id] ? !!st[t.id] : t.id === 'UL' || t.id === 'OL' ? st.list === t.id : t.id === 'link' ? !!st.link : st.block === t.id);
  const canUndo = hist.current.i > 0, canRedo = hist.current.i < hist.current.stack.length - 1;
  const onBarKey = (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; let n = null;
    if (d) n = (rove + d + btns.length) % btns.length; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = btns.length - 1;
    if (n == null) return; e.preventDefault(); setRove(n); bar.current.querySelectorAll('button')[n].focus();
  };
  let bi = -1;
  return (
    <div className={cx('vui-field', className)}>
      {label && <FieldLabel id={id + '-l'}>{label}</FieldLabel>}
      <div className={cx('vui-rte', disabled && 'vui-rte--disabled', error && 'vui-rte--invalid')}>
        {toolbar && !readOnly && (
          <div ref={bar} role="toolbar" aria-label="Formatting" aria-controls={id + '-ed'} className="vui-rte__bar" onKeyDown={onBarKey}>
            {tools.map((t, i) => {
              if (t.sep) return <span key={i} className="vui-toolbar__sep" role="separator" />;
              if (t.spacer) return <span key={i} className="vui-rte__spacer" />;
              bi++; const k = bi; const pressable = t.id !== 'undo' && t.id !== 'redo';
              const dis = disabled || (t.id === 'undo' && !canUndo) || (t.id === 'redo' && !canRedo);
              return (
                <button key={t.id} type="button" tabIndex={k === rove ? 0 : -1} className={cx('vui-toolbar__btn', t.flip && 'vui-rte__flip')} aria-label={t.label} title={t.label + ' (' + fmtKeys(t.keys) + ')'}
                  aria-pressed={pressable ? isOn(t) : undefined} aria-keyshortcuts={t.keys.replace('mod', MAC ? 'Meta' : 'Control')} disabled={dis}
                  onMouseDown={(e) => e.preventDefault()} onFocus={() => setRove(k)} onClick={() => exec(t.id)}>
                  {t.icon ? <Glyph name={t.icon} /> : <span className="vui-rte__tt" aria-hidden="true">{t.text}</span>}
                </button>
              );
            })}
          </div>
        )}
        {link && (
          <div className="vui-rte__link" role="dialog" aria-label="Edit link" onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeLink(); } }}>
            <div className="vui-rte__link-row">
              <Control size="sm" invalid={!!(link.err)} style={{ flex: 1 }} iconLeft="link">
                <input className="vui-control__input" autoFocus value={link.href} placeholder="Paste or type a link" aria-label="Link address" aria-invalid={!!link.err || undefined}
                  onChange={(e) => setLink({ ...link, href: e.target.value, err: null })} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitLink(false); } }} />
              </Control>
              <Button size="sm" onClick={() =>commitLink(false)}>Apply</Button>
            </div>
            {link.err && <span className="vui-hint vui-hint--error" role="alert">{link.err}</span>}
            <div className="vui-rte__link-row vui-rte__link-foot">
              {link.existing && <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => commitLink(true)}>Remove link</Button>}
              <Button variant="ghost" size="sm" style={{ marginLeft: 'auto' }} onClick={closeLink}>Cancel</Button>
            </div>
          </div>
        )}
        <div ref={ed} id={id + '-ed'} className="vui-rte__area" contentEditable={editable} suppressContentEditableWarning spellCheck
          role="textbox" aria-multiline="true" aria-labelledby={label ? id + '-l' : undefined} aria-label={label ? undefined : placeholder} aria-describedby={hint || error ? id + '-h' : undefined}
          aria-placeholder={placeholder} aria-invalid={!!error || undefined} aria-disabled={disabled || undefined} aria-readonly={readOnly || undefined}
          data-placeholder={placeholder} data-empty={empty || undefined} style={{ minHeight, maxHeight }}
          onInput={onInput} onKeyDown={onKeyDown} onPaste={onPaste} onMouseDown={() => (pend.current = {})}
          onClick={(e) => { const a = (e.metaKey || e.ctrlKey) && e.target.closest && e.target.closest('a[href]'); if (a) { e.preventDefault(); window.open(a.href, '_blank', 'noopener'); } }} />
      </div>
      {(hint || error || maxLength) && (
        <div className="vui-field__foot">
          <span id={id + '-h'} className={cx('vui-hint', error && 'vui-hint--error')}>{error || hint}</span>
          {maxLength && <span className={cx('vui-hint', 'vui-field__count', len > maxLength && 'vui-field__count--max')} aria-live="polite">{len}/{maxLength}</span>}
        </div>
      )}
    </div>
  );
}
