import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  type JSX,
  mergeProps,
  on,
  Show,
  untrack,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Tag } from '../display/Tag';
import { Control, type ControlProps } from '../primitives/Control';
import { EmptyText } from '../primitives/EmptyText';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { callbackAlias } from './callbackAlias';
import { TreeSelectRow } from './TreeSelectRow';
import { findNode, leafIds, selectionState, type TreeSelectNode, visibleRows } from './treeSelectRows';

export type { TreeSelectNode };

interface TreeSelectBaseProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  data: TreeSelectNode[];
  /** @default localized "Select…" */
  placeholder?: string;
  /** @default true */
  searchable?: boolean;
  defaultExpanded?: string[];
  /** Tags shown before "+N" (multiple). @default 2 */
  maxTags?: number;
  size?: ControlProps['size'];
  disabled?: boolean;
  id?: string;
}

export interface TreeSelectSingleProps extends TreeSelectBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: string | null) => void;
  /** Parents only expand, they cannot be picked. @default false */
  leavesOnly?: boolean;
}

export interface TreeSelectMultipleProps extends TreeSelectBaseProps {
  /** Tri-state checkboxes: a parent selects all its leaves; the value holds leaf ids. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Alias of `onValueChange`. */
  onChange?: (value: string[]) => void;
}

export type TreeSelectProps = TreeSelectSingleProps | TreeSelectMultipleProps;

type SelectionValue = string | string[] | null;

/** Both modes seen through one value type; the public union keeps each mode's callback precisely typed. */
interface TreeSelectModelProps extends TreeSelectBaseProps {
  multiple?: boolean;
  leavesOnly?: boolean;
  value?: SelectionValue;
  defaultValue?: SelectionValue;
  onValueChange?: (value: SelectionValue) => void;
  onChange?: (value: SelectionValue) => void;
}

/**
 * Select over hierarchical options — departments, categories, locations. Expand with the chevron or →/←, search filters and
 * auto-expands matches. multiple: tri-state checkboxes with tags in the field. Use Select for flat lists.
 */
export const TreeSelect = (props: TreeSelectProps) => {
  const p = mergeProps(
    {
      multiple: false,
      leavesOnly: false,
      searchable: true,
      maxTags: 2,
      size: 'md',
    } satisfies Partial<TreeSelectModelProps>,
    props as TreeSelectModelProps,
  );
  const translate = useTranslate();
  const [value, setValue] = createControllable<SelectionValue>({
    value: () => p.value,
    defaultValue: untrack(() => p.defaultValue ?? (p.multiple ? [] : null)),
    onChange: callbackAlias(
      () => p.onValueChange,
      () => p.onChange,
    ),
  });
  const listId = createUniqueId();
  const [open, setOpen] = createSignal(false);
  const [expanded, setExpanded] = createSignal<ReadonlySet<string>>(new Set(p.defaultExpanded));
  const [query, setQuery] = createSignal('');
  const [active, setActive] = createSignal(0);
  const [root, setRoot] = createSignal<HTMLElement>();
  let search: HTMLInputElement | undefined;
  let tree: HTMLDivElement | undefined;

  const selected = createMemo((): ReadonlySet<string> => {
    const v = value();
    if (Array.isArray(v)) return new Set(v);
    return new Set(v == null ? [] : [v]);
  });
  const selectedIds = () => [...selected()];
  const picked = createMemo(() => selectedIds().flatMap((id) => findNode(p.data, id) ?? []));
  const needle = () => query().trim().toLowerCase();
  const rows = createMemo(() => visibleRows(p.data, expanded(), needle()));
  const isExpanded = (id: string) => !!needle() || expanded().has(id);
  const rowId = (id: string) => `${listId}-${id}`;
  const activeRow = () => rows()[active()];

  createDismiss(open, () => setOpen(false), root);
  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) return;
      batch(() => {
        setQuery('');
        setActive(0);
      });
      (search ?? tree)?.focus();
    }),
  );
  createEffect(() => {
    const row = tree?.children[active()];
    if (!open() || !tree || !(row instanceof HTMLElement)) return;
    if (row.offsetTop < tree.scrollTop) tree.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > tree.scrollTop + tree.clientHeight)
      tree.scrollTop = row.offsetTop + row.offsetHeight - tree.clientHeight;
  });

  const toggleExpanded = (id: string, force?: boolean) => {
    const next = new Set(expanded());
    if (force ?? !next.has(id)) next.add(id);
    else next.delete(id);
    setExpanded(next);
  };
  const removePicked = (id: string) => setValue(selectedIds().filter((x) => x !== id));
  const pick = (node: TreeSelectNode, hasChildren: boolean) => {
    if (p.multiple) {
      const leaves = leafIds(node);
      const all = leaves.every((id) => selected().has(id));
      const next = new Set(selected());
      leaves.forEach((id) => (all ? next.delete(id) : next.add(id)));
      setValue([...next]);
    } else if (hasChildren && p.leavesOnly) toggleExpanded(node.id);
    else {
      setValue(node.id);
      setOpen(false);
      root()?.querySelector<HTMLElement>('.vui-tselect__trigger')?.focus();
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const row = activeRow();
    const canExpand = !!row?.hasChildren && !needle();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(rows().length - 1, active() + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(0, active() - 1));
    } else if (e.key === 'ArrowRight' && row && canExpand) {
      e.preventDefault();
      toggleExpanded(row.node.id, true);
    } else if (e.key === 'ArrowLeft' && row && canExpand) {
      e.preventDefault();
      toggleExpanded(row.node.id, false);
    } else if (e.key === 'Enter' && row) {
      e.preventDefault();
      pick(row.node, row.hasChildren);
    }
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={p.id}>
      {(control) => (
        <div ref={setRoot} class="vui-select vui-tselect">
          <Control
            size={p.size}
            invalid={control.invalid}
            disabled={p.disabled}
            class={cx(p.multiple && picked().length > 0 && 'vui-tselect__control--tags')}
          >
            <button
              id={control.id}
              type="button"
              class="vui-tselect__trigger"
              disabled={p.disabled}
              aria-haspopup="tree"
              aria-expanded={open()}
              aria-controls={listId}
              aria-describedby={control.describedBy}
              onClick={() => setOpen(!open())}
            >
              <Show when={picked().length === 0}>
                <span class="vui-tselect__ph">{p.placeholder ?? translate('velvet.forms.treeSelect.placeholder')}</span>
              </Show>
              <Show when={!p.multiple && picked()[0]}>
                {(node) => <span class="vui-tselect__val">{node().label}</span>}
              </Show>
              <Show when={p.multiple}>
                <For each={picked().slice(0, p.maxTags)}>
                  {(node) => (
                    <Tag size="sm" onRemove={() => removePicked(node.id)}>
                      {node.label}
                    </Tag>
                  )}
                </For>
                <Show when={picked().length > p.maxTags}>
                  <Tag size="sm">{`+${picked().length - p.maxTags}`}</Tag>
                </Show>
              </Show>
            </button>
            <Glyph name="chevron-down" class="vui-control__chevron" />
          </Control>
          <Show when={open()}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- relays key events bubbling from the search input and the tree */}
            <div class="vui-select__menu vui-tselect__menu" onKeyDown={onKeyDown}>
              <Show when={p.searchable}>
                <Control size="sm" class="vui-tselect__search" iconLeft="search">
                  <input
                    ref={search}
                    class="vui-control__input"
                    placeholder={translate('velvet.common.search')}
                    aria-label={translate('velvet.forms.treeSelect.searchLabel')}
                    aria-controls={listId}
                    aria-activedescendant={activeRow() ? rowId(activeRow()?.node.id ?? '') : undefined}
                    value={query()}
                    onInput={(e) => {
                      setQuery(e.currentTarget.value);
                      setActive(0);
                    }}
                  />
                </Control>
              </Show>
              <div
                ref={tree}
                id={listId}
                role="tree"
                aria-multiselectable={p.multiple || undefined}
                aria-label={typeof p.label === 'string' ? p.label : translate('velvet.forms.treeSelect.treeLabel')}
                tabIndex={p.searchable ? -1 : 0}
                class="vui-tselect__tree"
                aria-activedescendant={!p.searchable && activeRow() ? rowId(activeRow()?.node.id ?? '') : undefined}
              >
                <Show when={rows().length === 0}>
                  <EmptyText class="vui-tselect__empty">{translate('velvet.forms.treeSelect.noMatches')}</EmptyText>
                </Show>
                <For each={rows()}>
                  {(row, index) => (
                    <TreeSelectRow
                      id={rowId(row.node.id)}
                      row={row}
                      active={index() === active()}
                      multiple={p.multiple}
                      expanded={isExpanded(row.node.id)}
                      state={selectionState(row.node, selected(), p.multiple)}
                      onHover={() => setActive(index())}
                      onPick={() => pick(row.node, row.hasChildren)}
                      onToggle={() => toggleExpanded(row.node.id)}
                    />
                  )}
                </For>
              </div>
              <Show when={p.multiple && picked().length > 0}>
                <div class="vui-fchip__foot">
                  <span class="vui-tselect__sum">
                    {translate('velvet.forms.treeSelect.selectedCount', { count: picked().length })}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setValue([])}>
                    {translate('velvet.common.clear')}
                  </Button>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      )}
    </Field>
  );
};
