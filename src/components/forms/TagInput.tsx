import { createSignal, createUniqueId, For, type JSX, mergeProps, onCleanup } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Tag } from '../display/Tag';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';

const DUPLICATE_FLASH_MS = 600;
const LIST_SEPARATOR = ',';
const PASTED_LIST = /[,\n]/u;

export interface TagInputProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  /** Controlled tags. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  /** @default localized "Add…" */
  placeholder?: string;
  /** Cap + "n/max" counter. */
  max?: number;
  /** Keys that commit the current text. @default ['Enter', ','] */
  separators?: readonly string[];
  /** Normalise each tag before adding — e.g. `(tag) => tag.toLowerCase()`. */
  transform?: (tag: string) => string;
  /** Accessible name of each tag's remove button. @default localized "Remove {tag}" */
  removeLabel?: (tag: string) => string;
  /** @default 'md' */
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  /** Styles the field shell. */
  class?: string;
}

/** Free-text tags inside a field. Enter or comma adds, Backspace on empty removes the last, pasted comma/newline lists split, duplicates (case-insensitive) flash instead of adding. */
export const TagInput = (props: TagInputProps) => {
  const p = mergeProps(
    { defaultValue: [], separators: ['Enter', LIST_SEPARATOR], size: 'md' } satisfies TagInputProps,
    props,
  );
  const translate = useTranslate();
  const removeLabel = (tag: string) =>
    p.removeLabel ? p.removeLabel(tag) : translate('velvet.forms.tagInput.removeLabel', { tag });
  const autoId = createUniqueId();
  const id = () => p.id ?? autoId;
  const [tags, setTags] = createControllable<string[]>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => p.onValueChange?.(next),
  });
  const [text, setText] = createSignal('');
  const [duplicate, setDuplicate] = createSignal<number>();
  let input!: HTMLInputElement;
  let flashTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(flashTimer));

  const isFull = () => p.max != null && tags().length >= p.max;
  const flash = (index: number) => {
    setDuplicate(index);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => setDuplicate(undefined), DUPLICATE_FLASH_MS);
  };
  const add = (raw: string) => {
    const next = [...tags()];
    const parts = raw
      .split(LIST_SEPARATOR)
      .map((part) => (p.transform ? p.transform(part.trim()) : part.trim()))
      .filter(Boolean);
    for (const part of parts) {
      if (p.max != null && next.length >= p.max) break;
      const existing = next.findIndex((tag) => tag.toLowerCase() === part.toLowerCase());
      if (existing >= 0) flash(existing);
      else next.push(part);
    }
    if (next.length !== tags().length) setTags(next);
    setText('');
  };
  const remove = (index: number) => {
    setTags(tags().filter((_, at) => at !== index));
    input.focus();
  };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (p.separators.includes(e.key) && text().trim()) {
      e.preventDefault();
      add(text());
    } else if (e.key === 'Backspace' && !text() && tags().length) {
      e.preventDefault();
      remove(tags().length - 1);
    }
  };

  return (
    <Field
      label={p.label}
      hint={p.hint}
      error={p.error}
      optional={p.optional}
      id={id()}
      count={tags().length}
      maxCount={p.max}
    >
      {(control) => (
        <Control
          invalid={control.invalid}
          disabled={p.disabled}
          class={cx('vui-taginput', p.size === 'sm' && 'vui-taginput--sm', p.class)}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
              input.focus();
            }
          }}
        >
          <For each={tags()}>
            {(tag, index) => (
              <Tag
                size="sm"
                class={cx('vui-taginput__tag', duplicate() === index() && 'vui-taginput__tag--dupe')}
                disabled={p.disabled}
                removeLabel={removeLabel(tag)}
                onRemove={() => remove(index())}
              >
                {tag}
              </Tag>
            )}
          </For>
          <input
            ref={input}
            id={control.id}
            class="vui-taginput__input"
            value={text()}
            disabled={p.disabled || isFull()}
            placeholder={
              isFull() || tags().length ? '' : (p.placeholder ?? translate('velvet.forms.tagInput.placeholder'))
            }
            aria-describedby={control.describedBy}
            aria-invalid={control.invalid || undefined}
            onInput={(e) => {
              const typed = e.currentTarget.value;
              if (typed.includes(LIST_SEPARATOR) && p.separators.includes(LIST_SEPARATOR)) add(typed);
              else setText(typed);
              e.currentTarget.value = text();
            }}
            onKeyDown={onKeyDown}
            onBlur={() => {
              if (text().trim()) add(text());
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData?.getData('text') ?? '';
              if (!PASTED_LIST.test(pasted)) return;
              e.preventDefault();
              add(pasted.replace(/\n/gu, LIST_SEPARATOR));
            }}
          />
        </Control>
      )}
    </Field>
  );
};
