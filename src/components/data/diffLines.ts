export interface DiffRow {
  t: 'eq' | 'add' | 'del';
  /** Line number in the old text. */
  o?: number;
  /** Line number in the new text. */
  n?: number;
  text: string;
  /** Word-level segments of a changed line: `[text, changed]`. */
  parts?: Array<[string, boolean]>;
}

type EditOp = { op: 'eq'; a: number; b: number } | { op: 'del'; a: number } | { op: 'add'; b: number };

/** Above this many token pairs the word diff is skipped and the whole line is marked changed. */
const WORD_DIFF_LIMIT = 40000;

/** Longest-common-subsequence edit script between two token lists. */
const lcs = (left: readonly string[], right: readonly string[]): EditOp[] => {
  const rows = left.length;
  const columns = right.length;
  const width = columns + 1;
  const table = new Uint32Array((rows + 1) * width);
  const at = (i: number, j: number): number => table[i * width + j] ?? 0;
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = columns - 1; j >= 0; j--) {
      table[i * width + j] = left[i] === right[j] ? at(i + 1, j + 1) + 1 : Math.max(at(i + 1, j), at(i, j + 1));
    }
  }
  const ops: EditOp[] = [];
  let i = 0;
  let j = 0;
  while (i < rows && j < columns) {
    if (left[i] === right[j]) ops.push({ op: 'eq', a: i++, b: j++ });
    else if (at(i + 1, j) >= at(i, j + 1)) ops.push({ op: 'del', a: i++ });
    else ops.push({ op: 'add', b: j++ });
  }
  while (i < rows) ops.push({ op: 'del', a: i++ });
  while (j < columns) ops.push({ op: 'add', b: j++ });
  return ops;
};

const tokenize = (text: string): string[] => text.split(/(\s+|[^\w\s])/u).filter(Boolean);

const wordDiff = (oldLine: string, newLine: string): [Array<[string, boolean]>, Array<[string, boolean]>] => {
  const oldTokens = tokenize(oldLine);
  const newTokens = tokenize(newLine);
  if (oldTokens.length * newTokens.length > WORD_DIFF_LIMIT) return [[[oldLine, true]], [[newLine, true]]];
  const removed: Array<[string, boolean]> = [];
  const added: Array<[string, boolean]> = [];
  for (const step of lcs(oldTokens, newTokens)) {
    if (step.op === 'eq') {
      removed.push([oldTokens[step.a] ?? '', false]);
      added.push([newTokens[step.b] ?? '', false]);
    } else if (step.op === 'del') removed.push([oldTokens[step.a] ?? '', true]);
    else added.push([newTokens[step.b] ?? '', true]);
  }
  return [removed, added];
};

/** The line + word diff DiffViewer renders — reuse for your own summaries. */
export const diffLines = (oldText = '', newText = ''): DiffRow[] => {
  const a = oldText.split('\n');
  const b = newText.split('\n');
  const lineAt = (lines: string[], index: number): string => lines[index] ?? '';

  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head++;
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;

  const rows: DiffRow[] = [];
  for (let k = 0; k < head; k++) rows.push({ t: 'eq', o: k + 1, n: k + 1, text: lineAt(a, k) });

  let deletions: DiffRow[] = [];
  let additions: DiffRow[] = [];
  const flush = () => {
    deletions.forEach((deleted, k) => {
      const added = additions[k];
      if (!added) return;
      [deleted.parts, added.parts] = wordDiff(deleted.text, added.text);
    });
    rows.push(...deletions, ...additions);
    deletions = [];
    additions = [];
  };
  for (const step of lcs(a.slice(head, a.length - tail), b.slice(head, b.length - tail))) {
    if (step.op === 'eq') {
      flush();
      rows.push({ t: 'eq', o: head + step.a + 1, n: head + step.b + 1, text: lineAt(a, head + step.a) });
    } else if (step.op === 'del') deletions.push({ t: 'del', o: head + step.a + 1, text: lineAt(a, head + step.a) });
    else additions.push({ t: 'add', n: head + step.b + 1, text: lineAt(b, head + step.b) });
  }
  flush();

  for (let k = tail; k > 0; k--)
    rows.push({ t: 'eq', o: a.length - k + 1, n: b.length - k + 1, text: lineAt(a, a.length - k) });
  return rows;
};
