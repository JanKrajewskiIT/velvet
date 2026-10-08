import { createMemo, createSignal, For, Index, Match, mergeProps, Show, Switch, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Spinner } from '../feedback/Spinner';
import { Checkmark } from '../primitives/Checkmark';
import { Chevron } from '../primitives/Chevron';
import { Glyph } from '../primitives/Glyph';
import {
  checkStateOf,
  flattenTree,
  hasChildren,
  isBranch,
  leavesOf,
  type LoadStatuses,
  omitKey,
  reuseRows,
  type TreeNode,
  type TreeRow,
} from './treeData';

export interface TreeViewLabels {
  loading: string;
  loadFailed: string;
  retry: string;
}

export interface TreeViewProps {
  data: TreeNode[];
  /** Tri-state checkbox per row (permissions, filters). Row icons only render when a node sets icon. */
  checkable?: boolean;
  /** Checked leaf ids (controlled) */
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (leafIds: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Called when a lazy node without children expands. Resolve after you put the children into data; while pending a Loading… row shows, on reject an error row with Retry (Enter / Space on it retries). */
  onLoadChildren?: (node: TreeNode) => Promise<void>;
  /** Receives the rejection of `onLoadChildren`; the row itself only shows a generic message. */
  onLoadError?: (node: TreeNode, error: unknown) => void;
  /** Accessible name */
  label?: string;
  labels?: Partial<TreeViewLabels>;
  class?: string;
}

const GUIDE_BASE_PX = 17;
const GUIDE_STEP_PX = 20;

/**
 * Hierarchical list (files, categories, org). WAI-ARIA tree keyboard: ↑↓ move · → expand / into child · ← collapse / to parent ·
 * Home/End · Enter select · * expand siblings. With `checkable`: tri-state checkboxes (parent = all / some / none of its leaves),
 * Space or click toggles; the value is the list of checked LEAF ids.
 */
export const TreeView = (props: TreeViewProps) => {
  const p = mergeProps(
    { checkable: false, defaultExpanded: [], defaultChecked: [] } satisfies Partial<TreeViewProps>,
    props,
  );
  const translate = useTranslate();
  const labels = (): TreeViewLabels => ({
    loading: p.labels?.loading ?? translate('velvet.navigation.treeView.loading'),
    loadFailed: p.labels?.loadFailed ?? translate('velvet.navigation.treeView.loadFailed'),
    retry: p.labels?.retry ?? translate('velvet.common.retry'),
  });
  const [selected, setSelected] = createControllable<string | null>({
    value: () => p.selected,
    defaultValue: p.defaultSelected ?? null,
  });
  const [expanded, setExpanded] = createControllable<string[]>({
    value: () => p.expanded,
    defaultValue: p.defaultExpanded,
    onChange: (ids) => p.onExpandedChange?.(ids),
  });
  const [checked, setChecked] = createControllable<string[]>({
    value: () => p.checked,
    defaultValue: p.defaultChecked,
    onChange: (ids) => p.onCheckedChange?.(ids),
  });
  const open = createMemo(() => new Set(expanded()));
  const checkedSet = createMemo(() => new Set(checked()));
  const [load, setLoad] = createSignal<LoadStatuses>({});
  const rows = createMemo<TreeRow[]>((previous = []) => reuseRows(previous, flattenTree(p.data, open(), load())));
  const [focusId, setFocusId] = createSignal<string | undefined>(untrack(() => selected() ?? p.data[0]?.id));
  const tabbableId = () => (rows().some((row) => row.id === focusId()) ? focusId() : rows()[0]?.id);
  let root!: HTMLUListElement;

  const focusRow = (id: string) => {
    setFocusId(id);
    [...root.querySelectorAll<HTMLElement>('[role="treeitem"]')].find((el) => el.dataset.id === id)?.focus();
  };

  const loadChildren = async (node: TreeNode) => {
    if (!p.onLoadChildren || load()[node.id]?.kind === 'loading') return;
    setLoad((statuses) => ({ ...statuses, [node.id]: { kind: 'loading' } }));
    try {
      await p.onLoadChildren(node);
      setLoad((statuses) => omitKey(statuses, node.id));
    } catch (error) {
      setLoad((statuses) => ({ ...statuses, [node.id]: { kind: 'error' } }));
      p.onLoadError?.(node, error);
    }
  };

  const setNodeOpen = (node: TreeNode, want: boolean) => {
    const next = new Set(open());
    if (want) next.add(node.id);
    else next.delete(node.id);
    setExpanded([...next]);
    if (want && node.lazy && !hasChildren(node)) void loadChildren(node);
  };
  const toggleNode = (node: TreeNode) => setNodeOpen(node, !open().has(node.id));
  const expandSiblingsOf = (row: TreeRow) => {
    const next = new Set(open());
    for (const sibling of rows())
      if (sibling.kind === 'node' && sibling.parent === row.parent && hasChildren(sibling.node)) next.add(sibling.id);
    setExpanded([...next]);
  };

  const toggleCheck = (node: TreeNode) => {
    const leaves = leavesOf(node);
    const next = new Set(checkedSet());
    const all = leaves.every((id) => next.has(id));
    for (const id of leaves) {
      if (all) next.delete(id);
      else next.add(id);
    }
    setChecked([...next]);
  };
  const choose = (node: TreeNode) => {
    setSelected(node.id);
    p.onSelect?.(node.id, node);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const list = rows();
    const index = list.findIndex((row) => row.id === tabbableId());
    const row = list[index];
    if (!row) return;
    const move = (id: string | null | undefined) => {
      if (id == null) return;
      e.preventDefault();
      focusRow(id);
    };
    if (row.kind === 'status') {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') move(row.parent);
      else if (e.key === 'ArrowDown') move(list[index + 1]?.id);
      else if ((e.key === 'Enter' || e.key === ' ') && row.status.kind === 'error') {
        e.preventDefault();
        void loadChildren(row.owner);
      }
      return;
    }
    const { node } = row;
    const branch = isBranch(node);
    const isOpen = open().has(node.id);
    switch (e.key) {
      case 'ArrowDown':
        move(list[index + 1]?.id);
        break;
      case 'ArrowUp':
        move(list[index - 1]?.id);
        break;
      case 'Home':
        move(list[0]?.id);
        break;
      case 'End':
        move(list[list.length - 1]?.id);
        break;
      case 'ArrowRight': {
        e.preventDefault();
        const next = list[index + 1];
        if (branch && !isOpen) setNodeOpen(node, true);
        else if (branch && next?.parent === node.id) move(next.id);
        break;
      }
      case 'ArrowLeft':
        e.preventDefault();
        if (branch && isOpen) setNodeOpen(node, false);
        else move(row.parent);
        break;
      case ' ':
        e.preventDefault();
        if (p.checkable) toggleCheck(node);
        else choose(node);
        break;
      case 'Enter':
        e.preventDefault();
        choose(node);
        break;
      case '*':
        e.preventDefault();
        expandSiblingsOf(row);
        break;
    }
  };

  return (
    <ul
      ref={root}
      role="tree"
      aria-label={p.label}
      aria-multiselectable={p.checkable || undefined}
      class={cx('vui-tree', p.checkable && 'vui-tree--checkable', p.class)}
      onKeyDown={onKeyDown}
    >
      <For each={rows()}>
        {(row) => (
          <Switch>
            <Match when={row.kind === 'status' && row}>
              {(statusRow) => (
                <li
                  data-id={statusRow().id}
                  role="treeitem"
                  aria-level={statusRow().level}
                  aria-selected={false}
                  aria-disabled={statusRow().status.kind === 'loading' || undefined}
                  tabIndex={tabbableId() === statusRow().id ? 0 : -1}
                  class={cx(
                    'vui-tree__row',
                    'vui-tree__row--status',
                    statusRow().status.kind === 'error' && 'vui-tree__row--error',
                  )}
                  style={{ '--lvl': statusRow().level - 1 }}
                  onFocusIn={() => setFocusId(statusRow().id)}
                >
                  <span class="vui-tree__caret vui-tree__caret--leaf" aria-hidden="true" />
                  <Show
                    when={statusRow().status.kind === 'error'}
                    fallback={
                      <>
                        <Spinner size="sm" label={labels().loading} />
                        <span class="vui-tree__label">{labels().loading}</span>
                      </>
                    }
                  >
                    <Glyph name="alert-circle" class="vui-tree__icon" />
                    <span class="vui-tree__label">{labels().loadFailed}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="vui-tree__retry"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        void loadChildren(statusRow().owner);
                      }}
                    >
                      {labels().retry}
                    </Button>
                  </Show>
                </li>
              )}
            </Match>
            <Match when={row.kind === 'node' && row}>
              {(nodeRow) => {
                const node = () => nodeRow().node;
                const branch = () => isBranch(node());
                const isOpen = () => branch() && open().has(node().id);
                const checkState = () => checkStateOf(node(), checkedSet());
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- rows use roving tabindex and the tree owner handles keyboard activation (Enter/Space)
                  <li
                    data-id={nodeRow().id}
                    role="treeitem"
                    aria-level={nodeRow().level}
                    aria-setsize={nodeRow().size}
                    aria-posinset={nodeRow().pos}
                    aria-expanded={branch() ? isOpen() : undefined}
                    aria-selected={p.checkable ? undefined : selected() === node().id}
                    aria-checked={
                      p.checkable ? (checkState() === 'mixed' ? 'mixed' : checkState() === 'on') : undefined
                    }
                    tabIndex={tabbableId() === nodeRow().id ? 0 : -1}
                    class={cx('vui-tree__row', selected() === node().id && 'vui-tree__row--sel')}
                    style={{ '--lvl': nodeRow().level - 1 }}
                    onClick={() => {
                      setFocusId(nodeRow().id);
                      if (p.checkable) {
                        if (branch()) toggleNode(node());
                        else toggleCheck(node());
                        return;
                      }
                      choose(node());
                      if (branch()) toggleNode(node());
                    }}
                    onFocusIn={() => setFocusId(nodeRow().id)}
                  >
                    <Index each={Array.from({ length: nodeRow().level - 1 })}>
                      {(_, k) => (
                        <span
                          class="vui-tree__guide"
                          style={{ left: `${GUIDE_BASE_PX + k * GUIDE_STEP_PX}px` }}
                          aria-hidden="true"
                        />
                      )}
                    </Index>
                    <span
                      class={cx(
                        'vui-tree__caret',
                        isOpen() && 'vui-tree__caret--open',
                        !branch() && 'vui-tree__caret--leaf',
                      )}
                      aria-hidden="true"
                    >
                      <Show when={branch()}>
                        <Chevron direction="right" open={isOpen()} />
                      </Show>
                    </span>
                    <Show when={p.checkable}>
                      <Checkmark
                        size="sm"
                        class="vui-tree__check"
                        checked={checkState() === 'on'}
                        indeterminate={checkState() === 'mixed'}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFocusId(nodeRow().id);
                          toggleCheck(node());
                        }}
                      />
                    </Show>
                    <Show when={!p.checkable || node().icon}>
                      <Glyph name={node().icon ?? (branch() ? 'folder' : 'file')} class="vui-tree__icon" />
                    </Show>
                    <span class="vui-tree__label">{node().label}</span>
                    <Show when={node().meta != null}>
                      <span class="vui-tree__meta">{node().meta}</span>
                    </Show>
                  </li>
                );
              }}
            </Match>
          </Switch>
        )}
      </For>
    </ul>
  );
};
