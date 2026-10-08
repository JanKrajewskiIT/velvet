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
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Chevron } from '../primitives/Chevron';
import { Control, type ControlProps } from '../primitives/Control';
import { EmptyText } from '../primitives/EmptyText';
import { Field } from '../primitives/Field';
import { type CascaderActivation, CascaderColumns } from './CascaderColumns';
import { CascaderPath } from './CascaderPath';
import { type CascaderNode, hasChildren, lastOf, leafPaths, pathTo } from './cascaderPaths';

export interface CascaderProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  data: CascaderNode[];
  value?: string | null;
  defaultValue?: string | null;
  /** id of the picked node + the full node path from the root. */
  onValueChange?: (id: string, path: CascaderNode[]) => void;
  /** Alias of `onValueChange`. */
  onChange?: (id: string, path: CascaderNode[]) => void;
  /** @default localized "Select…" */
  placeholder?: string;
  /** Path separator in the trigger. @default '/' */
  separator?: string;
  /** Allow committing a parent (not only leaves). @default false */
  changeOnSelect?: boolean;
  /** Open child columns on hover instead of click. @default 'click' */
  expandTrigger?: CascaderActivation;
  /** Search across all leaf paths. @default false */
  searchable?: boolean;
  /** Show only the last label in the trigger. @default false */
  displayLast?: boolean;
  size?: ControlProps['size'];
  disabled?: boolean;
  id?: string;
}

const MAX_HITS = 50;

/** Single-path hierarchical pick shown as side-by-side columns (region → country → city). Keys: ↑↓ in a column · → into child column · ← back · Enter pick · Esc close. */
export const Cascader = (props: CascaderProps) => {
  const p = mergeProps(
    {
      separator: '/',
      changeOnSelect: false,
      expandTrigger: 'click',
      searchable: false,
      displayLast: false,
      size: 'md',
    } satisfies Partial<CascaderProps>,
    props,
  );
  const translate = useTranslate();
  const [value, setValue] = createControllable<string | null>({
    value: () => p.value,
    defaultValue: p.defaultValue ?? null,
  });
  const emit = (id: string, path: CascaderNode[]) => (p.onValueChange ?? p.onChange)?.(id, path);
  const listId = createUniqueId();
  const [open, setOpen] = createSignal(false);
  const [trail, setTrail] = createSignal<string[]>([]);
  const [column, setColumn] = createSignal(0);
  const [query, setQuery] = createSignal('');
  const [hitIndex, setHitIndex] = createSignal(0);
  const [root, setRoot] = createSignal<HTMLElement>();
  let menu: HTMLDivElement | undefined;
  let search: HTMLInputElement | undefined;

  const pickedPath = createMemo(() => {
    const id = value();
    return id == null ? [] : (pathTo(p.data, id) ?? []);
  });
  const columns = createMemo(() => {
    const result: CascaderNode[][] = [p.data];
    trail().forEach((id, level) => {
      const children = result[level]?.find((node) => node.id === id)?.children;
      if (children?.length) result.push(children);
    });
    return result;
  });
  const needle = () => query().trim().toLowerCase();
  const hits = createMemo(() => {
    const text = needle();
    if (!text) return [];
    return leafPaths(p.data)
      .filter((path) =>
        path.some((node) => (typeof node.label === 'string' ? node.label : '').toLowerCase().includes(text)),
      )
      .slice(0, MAX_HITS);
  });

  const closeToTrigger = () => {
    setOpen(false);
    root()?.querySelector<HTMLElement>('.vui-casc__trigger')?.focus();
  };
  createDismiss(open, () => setOpen(false), root, { escape: false });

  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) return;
      const ids = pickedPath().map((node) => node.id);
      const first = p.data[0]?.id;
      batch(() => {
        setTrail(ids.length ? ids : first ? [first] : []);
        setColumn(Math.max(0, ids.length - 1));
        setQuery('');
        setHitIndex(0);
      });
      (search ?? menu)?.focus();
    }),
  );

  const commit = (path: CascaderNode[]) => {
    const leaf = lastOf(path);
    if (!leaf) return;
    setValue(leaf.id);
    emit(leaf.id, path);
  };
  const commitAndClose = (path: CascaderNode[]) => {
    commit(path);
    closeToTrigger();
  };
  const activate = (level: number, node: CascaderNode, via: CascaderActivation) => {
    batch(() => {
      setTrail([...trail().slice(0, level), node.id]);
      setColumn(level);
    });
    const path = pathTo(p.data, node.id);
    if (!path || via !== 'click') return;
    if (!hasChildren(node)) commitAndClose(path);
    else if (p.changeOnSelect) commit(path);
  };

  const onSearchKey = (e: KeyboardEvent) => {
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
  const onColumnKey = (e: KeyboardEvent) => {
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
        const path = pathTo(p.data, node.id);
        if (!path) break;
        if (!hasChildren(node)) commitAndClose(path);
        else if (p.changeOnSelect) commitAndClose(path);
        else enterChildren(node);
        break;
      }
    }
  };
  const onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeToTrigger();
    } else if (needle()) onSearchKey(e);
    else onColumnKey(e);
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={p.id}>
      {(control) => (
        <div ref={setRoot} class="vui-casc">
          <Control
            size={p.size}
            invalid={control.invalid}
            disabled={p.disabled}
            class={cx(open() && 'vui-casc__control--open')}
          >
            <button
              id={control.id}
              type="button"
              class="vui-casc__trigger vui-tselect__trigger"
              disabled={p.disabled}
              aria-haspopup="dialog"
              aria-expanded={open()}
              aria-controls={listId}
              aria-describedby={control.describedBy}
              onClick={() => setOpen(!open())}
            >
              <Show
                when={pickedPath().length > 0}
                fallback={
                  <span class="vui-tselect__ph">{p.placeholder ?? translate('velvet.forms.cascader.placeholder')}</span>
                }
              >
                <Show
                  when={p.displayLast}
                  fallback={
                    <span class="vui-casc__path">
                      <CascaderPath path={pickedPath()} separator={p.separator} markLeaf />
                    </span>
                  }
                >
                  <span class="vui-tselect__val">{lastOf(pickedPath())?.label}</span>
                </Show>
              </Show>
            </button>
            <Chevron open={open()} class="vui-control__chevron vui-casc__chev" />
          </Control>
          <Show when={open()}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- dialog owns arrow/Enter/Escape navigation of its columns; tabIndex -1 is for programmatic focus */}
            <div
              ref={menu}
              id={listId}
              tabIndex={-1}
              class="vui-select__menu vui-casc__menu"
              role="dialog"
              aria-label={typeof p.label === 'string' ? p.label : translate('velvet.forms.cascader.dialogLabel')}
              onKeyDown={onMenuKeyDown}
            >
              <Show when={p.searchable}>
                <Control size="sm" class="vui-casc__search" iconLeft="search">
                  <input
                    ref={search}
                    class="vui-control__input"
                    placeholder={translate('velvet.common.search')}
                    aria-label={translate('velvet.forms.cascader.searchLabel')}
                    value={query()}
                    onInput={(e) => {
                      setQuery(e.currentTarget.value);
                      setHitIndex(0);
                    }}
                  />
                </Control>
              </Show>
              <Show
                when={needle()}
                fallback={
                  <CascaderColumns
                    columns={columns()}
                    trail={trail()}
                    activeColumn={column()}
                    picked={pickedPath()}
                    expandTrigger={p.expandTrigger}
                    onActivate={activate}
                  />
                }
              >
                <div class="vui-casc__results" role="listbox">
                  <Show when={hits().length === 0}>
                    <EmptyText class="vui-tselect__empty">{translate('velvet.forms.cascader.noMatches')}</EmptyText>
                  </Show>
                  <For each={hits()}>
                    {(path, index) => (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- keyboard handled by the dialog's onKeyDown with a virtual active option
                      <div
                        role="option"
                        aria-selected={lastOf(path)?.id === value()}
                        class={cx('vui-option', index() === hitIndex() && 'vui-option--active')}
                        onMouseEnter={() => setHitIndex(index())}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => commitAndClose(path)}
                      >
                        <span class="vui-option__label vui-casc__hit">
                          <CascaderPath path={path} separator={p.separator} query={needle()} />
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      )}
    </Field>
  );
};
