import React from 'react';
import { cx } from '../primitives/cx.js';
const lcs = (A, B) => {
  const N = A.length, M = B.length;
  const dp = Array.from({ length: N + 1 }, () => new Uint32Array(M + 1));
  for (let i = N - 1; i >= 0; i--) for (let j = M - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = []; let i = 0, j = 0;
  while (i < N && j < M) { if (A[i] === B[j]) { ops.push(['=', i++, j++]); } else if (dp[i + 1][j] >= dp[i][j + 1]) ops.push(['-', i++]); else ops.push(['+', -1, j++]); }
  while (i < N) ops.push(['-', i++]);
  while (j < M) ops.push(['+', -1, j++]);
  return ops;
};
const tok = (s) => s.split(/(\s+|[^\w\s])/).filter(Boolean);
const words = (a, b) => {
  const A = tok(a), B = tok(b);
  if (A.length * B.length > 40000) return [[[a, true]], [[b, true]]];
  const L = [], R = [];
  lcs(A, B).forEach(([t, i, j]) => { if (t === '=') { L.push([A[i], false]); R.push([B[j], false]); } else if (t === '-') L.push([A[i], true]); else R.push([B[j], true]); });
  return [L, R];
};
export function diffLines(oldText = '', newText = '') {
  const a = oldText.split('\n'), b = newText.split('\n');
  let s = 0; while (s < a.length && s < b.length && a[s] === b[s]) s++;
  let e = 0; while (e < a.length - s && e < b.length - s && a[a.length - 1 - e] === b[b.length - 1 - e]) e++;
  const rows = [];
  for (let k = 0; k < s; k++) rows.push({ t: 'eq', o: k + 1, n: k + 1, text: a[k] });
  const mid = lcs(a.slice(s, a.length - e), b.slice(s, b.length - e));
  let dels = [], adds = [];
  const flush = () => {
    dels.forEach((d, k) => { if (adds[k]) { const [L, R] = words(d.text, adds[k].text); d.parts = L; adds[k].parts = R; } });
    rows.push(...dels, ...adds); dels = []; adds = [];
  };
  mid.forEach(([t, i, j]) => {
    if (t === '=') { flush(); rows.push({ t: 'eq', o: s + i + 1, n: s + j + 1, text: a[s + i] }); }
    else if (t === '-') dels.push({ t: 'del', o: s + i + 1, text: a[s + i] });
    else adds.push({ t: 'add', n: s + j + 1, text: b[s + j] });
  });
  flush();
  for (let k = e; k > 0; k--) rows.push({ t: 'eq', o: a.length - k + 1, n: b.length - k + 1, text: a[a.length - k] });
  return rows;
}
const Code = ({ r }) => <span className="vui-diff__txt">{r.parts ? r.parts.map(([t, c], k) => (c ? <mark key={k} className={'vui-diff__w vui-diff__w--' + r.t}>{t}</mark> : t)) : r.text || '\u00a0'}</span>;
const SIGN = { eq: ' ', add: '+', del: '−' };
export function DiffViewer({ oldText = '', newText = '', filename, mode: modeProp, defaultMode = 'unified', onModeChange, context = 3, className }) {
  const [mi, setMi] = React.useState(defaultMode);
  const mode = modeProp ?? mi;
  const setMode = (m) => { if (modeProp === undefined) setMi(m); onModeChange && onModeChange(m); };
  const [open, setOpen] = React.useState({});
  const rows = React.useMemo(() => diffLines(oldText, newText), [oldText, newText]);
  const added = rows.filter((r) => r.t === 'add').length, removed = rows.filter((r) => r.t === 'del').length;
  const view = [];
  for (let i = 0; i < rows.length;) {
    if (rows[i].t !== 'eq') { view.push(rows[i++]); continue; }
    let j = i; while (j < rows.length && rows[j].t === 'eq') j++;
    const head = i === 0 ? 0 : context, tail = j === rows.length ? 0 : context;
    if (j - i > head + tail + 1 && !open[i]) {
      for (let k = i; k < i + head; k++) view.push(rows[k]);
      view.push({ t: 'skip', key: i, count: j - i - head - tail });
      for (let k = j - tail; k < j; k++) view.push(rows[k]);
    } else for (let k = i; k < j; k++) view.push(rows[k]);
    i = j;
  }
  const skip = (r) => <button key={'s' + r.key} type="button" className="vui-diff__skip" onClick={() => setOpen({ ...open, [r.key]: true })}>⋯ Show {r.count} unchanged {r.count === 1 ? 'line' : 'lines'}</button>;
  let body;
  if (mode === 'split') {
    body = []; let i = 0;
    while (i < view.length) {
      const r = view[i];
      if (r.t === 'skip') { body.push(skip(r)); i++; continue; }
      if (r.t === 'eq') { body.push(<div key={i} className="vui-diff__row"><span className="vui-diff__ln">{r.o}</span><span className="vui-diff__sign" /><Code r={r} /><span className="vui-diff__ln">{r.n}</span><span className="vui-diff__sign" /><Code r={r} /></div>); i++; continue; }
      const D = [], A = [];
      while (i < view.length && view[i].t === 'del') D.push(view[i++]);
      while (i < view.length && view[i].t === 'add') A.push(view[i++]);
      for (let k = 0; k < Math.max(D.length, A.length); k++) {
        const d = D[k], a = A[k];
        body.push(
          <div key={'c' + i + '-' + k} className="vui-diff__row">
            {d ? <><span className="vui-diff__ln vui-diff__c--del">{d.o}</span><span className="vui-diff__sign vui-diff__c--del">−</span><span className="vui-diff__code vui-diff__c--del"><Code r={d} /></span></> : <span className="vui-diff__empty" />}
            {a ? <><span className="vui-diff__ln vui-diff__c--add">{a.n}</span><span className="vui-diff__sign vui-diff__c--add">+</span><span className="vui-diff__code vui-diff__c--add"><Code r={a} /></span></> : <span className="vui-diff__empty" />}
          </div>
        );
      }
    }
  } else {
    body = view.map((r, i) => (r.t === 'skip' ? skip(r) : (
      <div key={i} className={cx('vui-diff__row', r.t !== 'eq' && 'vui-diff__c--' + r.t)}>
        <span className="vui-diff__ln">{r.o}</span><span className="vui-diff__ln">{r.n}</span><span className="vui-diff__sign">{SIGN[r.t]}</span><span className="vui-diff__code"><Code r={r} /></span>
      </div>
    )));
  }
  return (
    <div className={cx('vui-code', 'vui-diff', 'vui-diff--' + mode, className)}>
      <div className="vui-code__bar">
        <span className="vui-code__title">{filename}</span>
        <span className="vui-diff__stats" aria-label={added + ' added, ' + removed + ' removed lines'}><span className="vui-diff__plus">+{added}</span><span className="vui-diff__minus">−{removed}</span></span>
        <div className="vui-diff__modes" role="group" aria-label="View">
          {['unified', 'split'].map((m) => <button key={m} type="button" className={cx('vui-code__tab', mode === m && 'vui-code__tab--on')} aria-pressed={mode === m} onClick={() => setMode(m)}>{m === 'unified' ? 'Unified' : 'Split'}</button>)}
        </div>
      </div>
      <div className="vui-diff__body" role="table" aria-label={(filename ? filename + ' — ' : '') + 'changes'}>{body}</div>
    </div>
  );
}
