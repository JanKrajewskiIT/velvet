import { createEffect, createSignal, createUniqueId, For, mergeProps, Show } from 'solid-js';

import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { useTranslate } from '../../i18n/useTranslate';
import { classSelector } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Control } from '../primitives/Control';
import { ControlInput } from '../primitives/ControlInput';
import { EmptyText } from '../primitives/EmptyText';
import { Field } from '../primitives/Field';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { createFormValidation } from './createFormValidation';
import { createTreeSelectKeyboard } from './createTreeSelectKeyboard';
import { createTreeSelectPopup } from './createTreeSelectPopup';
import { createTreeSelectSelection } from './createTreeSelectSelection';
import { createTreeSelectView } from './createTreeSelectView';
import { FormValue } from './FormValue';
import styles from './TreeSelect.module.css';
import { TreeSelectRow } from './TreeSelectRow';
import { selectionState, type TreeSelectNode } from './treeSelectRows';
import type { TreeSelectModelProps, TreeSelectProps } from './treeSelectTypes';
import { TreeSelectValue } from './TreeSelectValue';

export type { TreeSelectProps };

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
  const selection = createTreeSelectSelection(p);
  const validation = createFormValidation();
  const listId = createUniqueId();
  const [open, setOpen] = createSignal(false);
  const [root, setRoot] = createSignal<HTMLElement>();
  createEffect(() => {
    if (p.disabled) setOpen(false);
  });
  const floating = createFloating(open, root, { matchWidth: true });
  const view = createTreeSelectView(() => p.data, p.defaultExpanded);
  const rowId = (id: string) => `${listId}-${id}`;

  createDismiss(open, () => setOpen(false), root);
  const popup = createTreeSelectPopup(open, view);

  const pick = (node: TreeSelectNode, hasChildren: boolean) => {
    if (p.disabled) return;
    if (p.multiple) selection.toggleLeaves(node);
    else if (hasChildren && p.leavesOnly) view.toggleExpanded(node.id);
    else {
      selection.setValue(node.id);
      setOpen(false);
      root()?.querySelector<HTMLElement>(classSelector(styles.tselectPartTrigger))?.focus();
    }
  };
  const onKeyDown = createTreeSelectKeyboard(view, pick);
  const serialized = () => {
    const value = selection.value();
    return Array.isArray(value) ? value : (value ?? '');
  };

  return (
    <Field label={p.label} hint={p.hint} error={p.error} optional={p.optional} required={p.required} id={p.id}>
      {(control) => (
        <div ref={setRoot} class={cx(styles.select, styles.tselect)}>
          <Control
            size={p.size}
            invalid={control.invalid || validation.invalid()}
            disabled={p.disabled}
            class={cx(p.multiple && selection.picked().length > 0 && styles.tselectPartControlVariantTags)}
          >
            <Show when={p.multiple && selection.picked().length > 0}>
              <TreeSelectValue
                picked={selection.picked()}
                multiple
                maxTags={p.maxTags}
                disabled={p.disabled}
                onRemove={selection.removePicked}
              />
            </Show>
            <button
              id={control.id}
              type="button"
              class={cx(styles.tselectPartTrigger, typographyClass('body'))}
              role="combobox"
              disabled={p.disabled}
              aria-haspopup="tree"
              aria-expanded={open()}
              aria-controls={listId}
              aria-describedby={validation.describedBy(control.describedBy)}
              aria-label={p['aria-label']}
              aria-labelledby={p['aria-labelledby'] ?? (p.label ? `${control.id}-label` : undefined)}
              onClick={() => setOpen(!open())}
            >
              <Show when={!p.multiple || selection.picked().length === 0}>
                <TreeSelectValue
                  picked={selection.picked()}
                  multiple={p.multiple}
                  maxTags={p.maxTags}
                  placeholder={p.placeholder}
                  onRemove={selection.removePicked}
                />
              </Show>
              <Show when={p.multiple && selection.picked().length > 0}>
                <Text as="span" variant="caption" tone="inherit" class={styles.srOnly}>
                  {translate('velvet.forms.treeSelect.placeholder')}
                </Text>
              </Show>
            </button>
            <Glyph name="chevron-down" class={styles.controlPartChevron} />
          </Control>
          <FormValue
            name={p.name}
            form={p.form}
            required={p.required}
            disabled={p.disabled}
            validation={validation}
            value={serialized()}
            focusInvalid={() => root()?.querySelector<HTMLElement>(classSelector(styles.tselectPartTrigger))?.focus()}
            onReset={() => {
              selection.reset();
              setOpen(false);
              view.search('');
            }}
          />
          <Show when={open()}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- relays key events bubbling from the search input and the tree */}
            <div
              ref={floating.ref}
              style={floating.style()}
              class={cx(styles.selectPartMenu, styles.tselectPartMenu)}
              onKeyDown={onKeyDown}
            >
              <Show when={p.searchable}>
                <Control size="sm" class={styles.tselectPartSearch} iconLeft="search">
                  <ControlInput
                    ref={popup.setSearch}
                    placeholder={translate('velvet.common.search')}
                    aria-label={translate('velvet.forms.treeSelect.searchLabel')}
                    aria-controls={listId}
                    aria-activedescendant={view.activeRow() ? rowId(view.activeRow()?.node.id ?? '') : undefined}
                    value={view.query()}
                    onInput={(e) => view.search(e.currentTarget.value)}
                  />
                </Control>
              </Show>
              <div
                ref={popup.setTree}
                id={listId}
                role="tree"
                aria-multiselectable={p.multiple || undefined}
                aria-label={typeof p.label === 'string' ? p.label : translate('velvet.forms.treeSelect.treeLabel')}
                tabIndex={p.searchable ? -1 : 0}
                class={styles.tselectPartTree}
                aria-activedescendant={
                  !p.searchable && view.activeRow() ? rowId(view.activeRow()?.node.id ?? '') : undefined
                }
              >
                <Show when={view.rows().length === 0}>
                  <EmptyText class={styles.tselectPartEmpty}>
                    {translate('velvet.forms.treeSelect.noMatches')}
                  </EmptyText>
                </Show>
                <For each={view.rows()}>
                  {(row, index) => (
                    <TreeSelectRow
                      id={rowId(row.node.id)}
                      row={row}
                      active={index() === view.active()}
                      multiple={p.multiple}
                      expanded={view.isExpanded(row.node.id)}
                      state={selectionState(row.node, selection.selected(), p.multiple)}
                      onHover={() => view.setActive(index())}
                      onPick={() => pick(row.node, row.hasChildren)}
                      onToggle={() => view.toggleExpanded(row.node.id)}
                    />
                  )}
                </For>
              </div>
              <Show when={p.multiple && selection.picked().length > 0}>
                <div class={styles.fchipPartFoot}>
                  <Text as="span" variant="caption" tone="inherit" class={styles.tselectPartSum}>
                    {translate('velvet.forms.treeSelect.selectedCount', { count: selection.picked().length })}
                  </Text>
                  <Button variant="ghost" size="sm" onClick={selection.clear}>
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
