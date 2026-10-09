import { Index, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph } from '../primitives/Glyph';
import { createCollectionDrag } from './createCollectionDrag';
import { createCollectionRows } from './createCollectionRows';
import { EditableCollectionRow } from './EditableCollectionRow';
import type { EditableItem, EditableItemId, EditableReorder } from './editableItem';

export type { EditableItem, EditableItemId };

export interface EditableCollectionProps {
  /** Controlled items. */
  items?: ReadonlyArray<EditableItem>;
  /** @default [] */
  defaultItems?: ReadonlyArray<EditableItem>;
  onItemsChange?: (items: ReadonlyArray<EditableItem>) => void;
  /** Header title. */
  title?: JSX.Element;
  /** Live item count in the header. @default true when `title` is set */
  showCount?: boolean;
  /** Count text. @default localized "N items" */
  countLabel?: (count: number) => JSX.Element;
  /** Per-row select, e.g. Basic / Intermediate / Advanced / Expert. */
  levels?: ReadonlyArray<string>;
  /** @default localized "Level" */
  levelLabel?: string;
  /** Importance stars per row. @default false */
  weighted?: boolean;
  /** @default 5 */
  maxWeight?: number;
  /** `drag` = grip handle (+ ↑↓ on it) · `buttons` = up / down icon buttons. @default 'drag' */
  reorder?: EditableReorder;
  /** Flag empty rows after blur. @default true */
  required?: boolean;
  /** @default localized "This field can’t be empty" */
  requiredText?: string;
  /** Input placeholder. @default localized "Name" */
  placeholder?: string;
  /** @default localized "Add item" */
  addLabel?: string;
  /** Text of a freshly added row. @default '' */
  newItemText?: string;
  /** @default localized "Nothing here yet." */
  emptyText?: JSX.Element;
  /** Hides Add at this length. */
  maxItems?: number;
  /** Accessible list name. @default localized "Items" */
  label?: string;
  class?: string;
}

/** Repeatable editable rows — skills with a level, requirements, checklist. Each row: grip (or ↑↓ on it) · text input · optional level select · optional importance stars · delete. Empty rows are flagged after blur; Add focuses the new row. */
export const EditableCollection = (props: EditableCollectionProps) => {
  const p = mergeProps(
    {
      defaultItems: [],
      weighted: false,
      maxWeight: 5,
      reorder: 'drag',
      required: true,
      newItemText: '',
    } satisfies Partial<EditableCollectionProps>,
    props,
  );
  const translate = useTranslate();
  const countLabel = (count: number) =>
    p.countLabel ? p.countLabel(count) : translate('velvet.forms.editableCollection.countLabel', { count });
  const rows = createCollectionRows(p);
  const drag = createCollectionDrag(rows.moveItem);
  const items = rows.items;

  const showCount = () => p.showCount ?? !!p.title;

  return (
    <div ref={rows.bindRoot} class={cx('vui-editcol', p.class)}>
      <Show when={p.title || showCount()}>
        <div class="vui-editcol__head">
          <Show when={p.title}>
            <span class="vui-editcol__title">{p.title}</span>
          </Show>
          <Show when={showCount()}>
            <span class="vui-editcol__count" aria-live="polite">
              {countLabel(items().length)}
            </span>
          </Show>
        </div>
      </Show>
      <Show
        when={items().length > 0}
        fallback={
          <EmptyText dashed class="vui-editcol__empty">
            {p.emptyText === undefined ? translate('velvet.forms.editableCollection.emptyText') : p.emptyText}
          </EmptyText>
        }
      >
        <ol class="vui-editcol__list" aria-label={p.label ?? translate('velvet.forms.editableCollection.label')}>
          <Index each={items()}>
            {(item, index) => (
              <EditableCollectionRow
                item={item()}
                index={index}
                rows={rows}
                drag={drag}
                reorder={p.reorder}
                required={p.required}
                requiredText={p.requiredText}
                placeholder={p.placeholder}
                levels={p.levels}
                levelLabel={p.levelLabel}
                weighted={p.weighted}
                maxWeight={p.maxWeight}
              />
            )}
          </Index>
        </ol>
      </Show>
      <Show when={rows.canAdd()}>
        <button type="button" class="vui-editcol__add" onClick={rows.addItem}>
          <Glyph name="plus" />
          {p.addLabel ?? translate('velvet.forms.editableCollection.addLabel')}
        </button>
      </Show>
    </div>
  );
};
