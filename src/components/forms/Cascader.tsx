import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
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
import { Field } from '../primitives/Field';
import { type CascaderActivation, CascaderColumns } from './CascaderColumns';
import { CascaderPath } from './CascaderPath';
import { type CascaderNode, lastOf, pathTo } from './cascaderPaths';
import { CascaderSearchResults } from './CascaderSearchResults';
import { createCascaderNavigation } from './createCascaderNavigation';
import { createCascaderSearch } from './createCascaderSearch';

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
  const [root, setRoot] = createSignal<HTMLElement>();
  let menu: HTMLDivElement | undefined;
  let search: HTMLInputElement | undefined;

  const pickedPath = createMemo(() => {
    const id = value();
    return id == null ? [] : (pathTo(p.data, id) ?? []);
  });

  const closeToTrigger = () => {
    setOpen(false);
    root()?.querySelector<HTMLElement>('.vui-casc__trigger')?.focus();
  };
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
  const nav = createCascaderNavigation({
    data: () => p.data,
    changeOnSelect: () => p.changeOnSelect,
    commit,
    commitAndClose,
  });
  const finder = createCascaderSearch(() => p.data, commitAndClose);

  createDismiss(open, () => setOpen(false), root, { escape: false });
  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) return;
      batch(() => {
        nav.reset(pickedPath().map((node) => node.id));
        finder.reset();
      });
      (search ?? menu)?.focus();
    }),
  );

  const onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeToTrigger();
    } else if (finder.needle()) finder.onKeyDown(e);
    else nav.onKeyDown(e);
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
                    value={finder.query()}
                    onInput={(e) => finder.input(e.currentTarget.value)}
                  />
                </Control>
              </Show>
              <Show
                when={finder.needle()}
                fallback={
                  <CascaderColumns
                    columns={nav.columns()}
                    trail={nav.trail()}
                    activeColumn={nav.column()}
                    picked={pickedPath()}
                    expandTrigger={p.expandTrigger}
                    onActivate={nav.activate}
                  />
                }
              >
                <CascaderSearchResults
                  hits={finder.hits()}
                  activeIndex={finder.hitIndex()}
                  selectedId={value()}
                  separator={p.separator}
                  query={finder.needle()}
                  onHover={finder.selectHit}
                  onPick={commitAndClose}
                />
              </Show>
            </div>
          </Show>
        </div>
      )}
    </Field>
  );
};
