import { type Accessor, createMemo, createSignal } from 'solid-js';

import { type CascaderNode, leafPaths } from './cascaderPaths';

const MAX_HITS = 50;

export interface CascaderSearch {
  query: Accessor<string>;
  /** Trimmed, lower-cased query; empty while not searching. */
  needle: () => string;
  hits: Accessor<CascaderNode[][]>;
  hitIndex: Accessor<number>;
  selectHit: (index: number) => void;
  input: (text: string) => void;
  reset: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

/** Search across every leaf path with a virtual active hit (↑↓ move, Enter commits). */
export const createCascaderSearch = (
  data: Accessor<CascaderNode[]>,
  commitAndClose: (path: CascaderNode[]) => void,
): CascaderSearch => {
  const [query, setQuery] = createSignal('');
  const [hitIndex, setHitIndex] = createSignal(0);
  const needle = () => query().trim().toLowerCase();
  const hits = createMemo(() => {
    const text = needle();
    if (!text) return [];
    return leafPaths(data())
      .filter((path) =>
        path.some((node) => (typeof node.label === 'string' ? node.label : '').toLowerCase().includes(text)),
      )
      .slice(0, MAX_HITS);
  });

  const selectHit = (index: number) => setHitIndex(index);
  const input = (text: string) => {
    setQuery(text);
    setHitIndex(0);
  };
  const reset = () => {
    setQuery('');
    setHitIndex(0);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const count = hits().length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHitIndex(Math.min(count - 1, hitIndex() + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHitIndex(Math.max(0, hitIndex() - 1));
    } else if (e.key === 'Enter') {
      const hit = hits()[hitIndex()];
      if (!hit) return;
      e.preventDefault();
      commitAndClose(hit);
    }
  };

  return { query, needle, hits, hitIndex, selectHit, input, reset, onKeyDown };
};
