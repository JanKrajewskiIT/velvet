import type { DiffRow } from './diffLines';

/** A folded run of unchanged rows; `key` is the index of the run's first row in the full diff. */
export interface SkipRow {
  t: 'skip';
  key: number;
  count: number;
}

export type ViewRow = DiffRow | SkipRow;

export type SplitRow =
  | { kind: 'skip'; skip: SkipRow }
  | { kind: 'eq'; row: DiffRow }
  | { kind: 'pair'; del: DiffRow | undefined; add: DiffRow | undefined };

/** Folds each run of unchanged rows to `context` rows around changes, unless its `key` is in `expanded`. */
export const foldUnchanged = (rows: readonly DiffRow[], context: number, expanded: ReadonlySet<number>): ViewRow[] => {
  const view: ViewRow[] = [];
  let i = 0;
  while (i < rows.length) {
    const row = rows[i];
    if (!row) break;
    if (row.t !== 'eq') {
      view.push(row);
      i++;
      continue;
    }
    let end = i;
    while (rows[end]?.t === 'eq') end++;
    const head = i === 0 ? 0 : context;
    const tail = end === rows.length ? 0 : context;
    if (end - i > head + tail + 1 && !expanded.has(i)) {
      view.push(
        ...rows.slice(i, i + head),
        { t: 'skip', key: i, count: end - i - head - tail },
        ...rows.slice(end - tail, end),
      );
    } else view.push(...rows.slice(i, end));
    i = end;
  }
  return view;
};

/** Pairs each run of deletions with the following additions so they sit side by side. */
export const toSplitRows = (view: readonly ViewRow[]): SplitRow[] => {
  const out: SplitRow[] = [];
  let i = 0;
  while (i < view.length) {
    const row = view[i];
    if (!row) break;
    if (row.t === 'skip') {
      out.push({ kind: 'skip', skip: row });
      i++;
    } else if (row.t === 'eq') {
      out.push({ kind: 'eq', row });
      i++;
    } else {
      const deletions: DiffRow[] = [];
      const additions: DiffRow[] = [];
      for (let next = view[i]; next?.t === 'del'; next = view[i]) {
        deletions.push(next);
        i++;
      }
      for (let next = view[i]; next?.t === 'add'; next = view[i]) {
        additions.push(next);
        i++;
      }
      for (let k = 0; k < Math.max(deletions.length, additions.length); k++)
        out.push({ kind: 'pair', del: deletions[k], add: additions[k] });
    }
  }
  return out;
};

export const DIFF_SIGN = { eq: ' ', add: '+', del: '−' } as const;
