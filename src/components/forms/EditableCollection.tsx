import { createSignal, createUniqueId, Index, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { EmptyText } from '../primitives/EmptyText';
import { Glyph } from '../primitives/Glyph';
import { Handle } from '../primitives/Handle';
import { Rating } from './Rating';
import { Select } from './Select';

const DEFAULT_WEIGHT = 3;
const DRAG_IMAGE_OFFSET = { x: 16, y: 18 };

export type EditableItemId = string | number;

export interface EditableItem {
  id: EditableItemId;
  text: string;
  /** One of `levels`, when `levels` is set. */
  level?: string;
  /** 1–`maxWeight`, when `weighted`. */
  weight?: number;
}

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
  reorder?: 'drag' | 'buttons';
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
  const idPrefix = createUniqueId();
  let newItemCount = 0;
  let root: HTMLDivElement | undefined;

  const [items, setItems] = createControllable<ReadonlyArray<EditableItem>>({
    value: () => p.items,
    defaultValue: p.defaultItems,
    onChange: (next) => p.onItemsChange?.(next),
  });
  const [touched, setTouched] = createSignal<ReadonlySet<EditableItemId>>(new Set());
  const [dragIndex, setDragIndex] = createSignal<number>();
  const [overIndex, setOverIndex] = createSignal<number>();

  const showCount = () => p.showCount ?? !!p.title;
  const canAdd = () => p.maxItems == null || items().length < p.maxItems;

  const patch = (id: EditableItemId, changes: Partial<Omit<EditableItem, 'id'>>) =>
    setItems(items().map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const moveItem = (from: number, to: number) => {
    const moved = items()[from];
    if (!moved || to < 0 || to >= items().length || from === to) return;
    const next = items().filter((_, index) => index !== from);
    next.splice(to, 0, moved);
    setItems(next);
  };

  const addItem = () => {
    const fresh: EditableItem = { id: `${idPrefix}-new-${++newItemCount}`, text: p.newItemText };
    const level = p.levels?.[Math.min(1, p.levels.length - 1)];
    if (level !== undefined) fresh.level = level;
    if (p.weighted) fresh.weight = DEFAULT_WEIGHT;
    setItems([...items(), fresh]);
    requestAnimationFrame(() =>
      [...(root?.querySelectorAll<HTMLElement>('.vui-editcol__input') ?? [])].at(-1)?.focus(),
    );
  };

  const focusGrip = (index: number) =>
    requestAnimationFrame(() => root?.querySelectorAll<HTMLElement>('.vui-editcol__grip')[index]?.focus());

  const onGripKeyDown = (event: KeyboardEvent, index: number) => {
    const target = event.key === 'ArrowUp' ? index - 1 : event.key === 'ArrowDown' ? index + 1 : undefined;
    if (target === undefined || target < 0 || target >= items().length) return;
    event.preventDefault();
    moveItem(index, target);
    focusGrip(target);
  };

  const endDrag = () => {
    setDragIndex(undefined);
    setOverIndex(undefined);
  };

  const onDragStart = (event: DragEvent & { currentTarget: HTMLElement }, index: number) => {
    setDragIndex(index);
    const transfer = event.dataTransfer;
    const row = event.currentTarget.closest('li');
    if (!transfer) return;
    transfer.effectAllowed = 'move';
    transfer.setData('text/plain', String(index));
    if (row) transfer.setDragImage(row, DRAG_IMAGE_OFFSET.x, DRAG_IMAGE_OFFSET.y);
  };

  const onRowDragOver = (event: DragEvent, index: number) => {
    if (dragIndex() === undefined) return;
    event.preventDefault();
    setOverIndex(index);
  };

  const onRowDrop = (event: DragEvent, index: number) => {
    const from = dragIndex();
    if (from === undefined) return;
    event.preventDefault();
    moveItem(from, index);
    endDrag();
  };

  return (
    <div ref={root} class={cx('vui-editcol', p.class)}>
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
            {(item, index) => {
              const invalid = () => p.required && touched().has(item().id) && !item().text.trim();
              return (
                <li
                  class={cx(
                    'vui-editcol__row',
                    dragIndex() === index && 'vui-editcol__row--drag',
                    overIndex() === index &&
                      dragIndex() !== undefined &&
                      dragIndex() !== index &&
                      'vui-editcol__row--over',
                    invalid() && 'vui-editcol__row--invalid',
                  )}
                  onDragOver={(event) => onRowDragOver(event, index)}
                  onDrop={(event) => onRowDrop(event, index)}
                >
                  <Show
                    when={p.reorder === 'drag'}
                    fallback={
                      <span class="vui-editcol__idx" aria-hidden="true">
                        {index + 1}
                      </span>
                    }
                  >
                    <Handle
                      class="vui-editcol__grip"
                      draggable
                      label={translate('velvet.forms.editableCollection.reorderItem', { index: index + 1 })}
                      title={translate('velvet.forms.editableCollection.reorderHint')}
                      onDragStart={(event) => onDragStart(event, index)}
                      onDragEnd={endDrag}
                      onKeyDown={(event) => onGripKeyDown(event, index)}
                    />
                  </Show>
                  <input
                    class="vui-editcol__input"
                    value={item().text}
                    placeholder={p.placeholder ?? translate('velvet.forms.editableCollection.placeholder')}
                    aria-label={translate('velvet.forms.editableCollection.itemLabel', { index: index + 1 })}
                    aria-invalid={invalid() || undefined}
                    onInput={(event) => patch(item().id, { text: event.currentTarget.value })}
                    onBlur={() => setTouched((previous) => new Set(previous).add(item().id))}
                  />
                  <Show when={p.levels}>
                    {(levels) => (
                      <div class="vui-editcol__level">
                        <Select
                          size="sm"
                          aria-label={translate('velvet.forms.editableCollection.levelForItem', {
                            level: p.levelLabel ?? translate('velvet.forms.editableCollection.levelLabel'),
                            index: index + 1,
                          })}
                          options={levels()}
                          value={item().level ?? ''}
                          onValueChange={(level) => patch(item().id, { level })}
                        />
                      </div>
                    )}
                  </Show>
                  <Show when={p.weighted}>
                    <Rating
                      size="sm"
                      max={p.maxWeight}
                      value={item().weight ?? 0}
                      label={translate('velvet.forms.editableCollection.importanceLabel', { index: index + 1 })}
                      onValueChange={(weight) => patch(item().id, { weight })}
                    />
                  </Show>
                  <span class="vui-editcol__tools">
                    <Show when={p.reorder === 'buttons'}>
                      <IconButton
                        icon="arrow-up"
                        label={translate('velvet.forms.editableCollection.moveUp')}
                        size="sm"
                        disabled={index === 0}
                        onClick={() => moveItem(index, index - 1)}
                      />
                      <IconButton
                        icon="arrow-down"
                        label={translate('velvet.forms.editableCollection.moveDown')}
                        size="sm"
                        disabled={index === items().length - 1}
                        onClick={() => moveItem(index, index + 1)}
                      />
                    </Show>
                    <IconButton
                      class="vui-editcol__del"
                      icon="trash-2"
                      label={translate('velvet.forms.editableCollection.removeItem', { index: index + 1 })}
                      size="sm"
                      onClick={() => setItems(items().filter((entry) => entry.id !== item().id))}
                    />
                  </span>
                  <Show when={invalid()}>
                    <div class="vui-editcol__err" role="alert">
                      {p.requiredText ?? translate('velvet.forms.editableCollection.requiredText')}
                    </div>
                  </Show>
                </li>
              );
            }}
          </Index>
        </ol>
      </Show>
      <Show when={canAdd()}>
        <button type="button" class="vui-editcol__add" onClick={addItem}>
          <Glyph name="plus" />
          {p.addLabel ?? translate('velvet.forms.editableCollection.addLabel')}
        </button>
      </Show>
    </div>
  );
};
