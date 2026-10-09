import { type Accessor, batch, createMemo, createSignal } from 'solid-js';

import type { CascaderActivation } from './CascaderColumns';
import { type CascaderNode, hasChildren, pathTo } from './cascaderPaths';

export interface CascaderNavigationOptions {
  data: Accessor<CascaderNode[]>;
  changeOnSelect: Accessor<boolean>;
  /** Stores the picked path without closing the menu. */
  commit: (path: CascaderNode[]) => void;
  commitAndClose: (path: CascaderNode[]) => void;
}

export interface CascaderNavigation {
  /** Highlighted node id per column. */
  trail: Accessor<string[]>;
  /** Column that owns keyboard focus. */
  column: Accessor<number>;
  columns: Accessor<CascaderNode[][]>;
  /** Re-opens on the committed path, or on the first root node when nothing is committed. */
  reset: (pickedIds: readonly string[]) => void;
  activate: (level: number, node: CascaderNode, via: CascaderActivation) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

/** Column trail and the ↑↓ / → / ← / Enter keyboard model of the Cascader menu. */
export const createCascaderNavigation = (options: CascaderNavigationOptions): CascaderNavigation => {
  const [trail, setTrail] = createSignal<string[]>([]);
  const [column, setColumn] = createSignal(0);
  const columns = createMemo(() => {
    const result: CascaderNode[][] = [options.data()];
    trail().forEach((id, level) => {
      const children = result[level]?.find((node) => node.id === id)?.children;
      if (children?.length) result.push(children);
    });
    return result;
  });

  const reset = (pickedIds: readonly string[]) => {
    const first = options.data()[0]?.id;
    batch(() => {
      setTrail(pickedIds.length ? [...pickedIds] : first ? [first] : []);
      setColumn(Math.max(0, pickedIds.length - 1));
    });
  };
  const activate = (level: number, node: CascaderNode, via: CascaderActivation) => {
    batch(() => {
      setTrail([...trail().slice(0, level), node.id]);
      setColumn(level);
    });
    const path = pathTo(options.data(), node.id);
    if (!path || via !== 'click') return;
    if (!hasChildren(node)) options.commitAndClose(path);
    else if (options.changeOnSelect()) options.commit(path);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const list = () => columns()[column()] ?? [];
    const index = Math.max(
      0,
      list().findIndex((node) => node.id === trail()[column()]),
    );
    const node = list()[index];
    const moveTo = (to: number) => {
      const target = list()[to];
      if (!target) return;
      e.preventDefault();
      setTrail([...trail().slice(0, column()), target.id]);
    };
    const enterChildren = (parent: CascaderNode) => {
      const child = parent.children?.[0];
      if (!child) return;
      e.preventDefault();
      batch(() => {
        setTrail([...trail().slice(0, column() + 1), child.id]);
        setColumn(column() + 1);
      });
    };
    switch (e.key) {
      case 'ArrowDown':
        moveTo(Math.min(list().length - 1, index + 1));
        break;
      case 'ArrowUp':
        moveTo(Math.max(0, index - 1));
        break;
      case 'ArrowRight':
        if (node && hasChildren(node)) enterChildren(node);
        break;
      case 'ArrowLeft':
        if (column() > 0) {
          e.preventDefault();
          batch(() => {
            setTrail(trail().slice(0, column()));
            setColumn(column() - 1);
          });
        }
        break;
      case 'Enter': {
        if (!node || node.disabled) break;
        e.preventDefault();
        const path = pathTo(options.data(), node.id);
        if (!path) break;
        if (!hasChildren(node)) options.commitAndClose(path);
        else if (options.changeOnSelect()) options.commitAndClose(path);
        else enterChildren(node);
        break;
      }
    }
  };

  return { trail, column, columns, reset, activate, onKeyDown };
};
