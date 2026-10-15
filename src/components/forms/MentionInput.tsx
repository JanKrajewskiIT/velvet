import { createMemo, createSignal, createUniqueId, Index, type JSX, mergeProps, onCleanup, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { createDismiss } from '../../hooks/createDismiss';
import { createFloating } from '../../hooks/createFloating';
import { cx } from '../../utils/cx';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { typographyClass } from '../primitives/typography';
import { CARET_LEFT_OFFSET_PX, createMentionLayout } from './createMentionLayout';
import { createMentionSearch } from './createMentionSearch';
import styles from './MentionInput.module.css';
import type { MentionOption, MentionSources } from './mentionModel';
import { MentionSuggestions } from './MentionSuggestions';

const NAVIGATION_KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

export interface MentionInputProps {
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  optional?: boolean;
  required?: boolean;
  /** Controlled value. */
  value?: string;
  /** @default '' */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Options for `@`. */
  users?: ReadonlyArray<MentionOption>;
  /** Options for `#`. */
  tags?: ReadonlyArray<MentionOption>;
  /** Single-character triggers; overrides `users` and `tags`, e.g. `{ '@': people, '/': commands }`. */
  sources?: MentionSources;
  /** @default 3 */
  rows?: number;
  /** @default 8 */
  maxRows?: number;
  placeholder?: string;
  /** @default 6 */
  maxResults?: number;
  /** Accessible name of the suggestion list. @default localized "Suggestions" */
  listLabel?: string;
  onMention?: (option: MentionOption, trigger: string) => void;
  disabled?: boolean;
  id?: string;
  class?: string;
}

/** Multi-line field with `@mention` (and optional `#tag`) suggestions at the caret. ↑↓ move, ↵ / Tab insert, Esc closes. Known mentions are highlighted in place; the value stays plain text. */
export const MentionInput = (props: MentionInputProps) => {
  const p = mergeProps(
    { defaultValue: '', users: [], tags: [], rows: 3, maxRows: 8, maxResults: 6 } satisfies Partial<MentionInputProps>,
    props,
  );
  const [value, setValue] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => p.onValueChange?.(next),
  });
  const search = createMentionSearch(p, value);
  const [root, setRoot] = createSignal<HTMLDivElement>();
  const [textarea, setTextarea] = createSignal<HTMLTextAreaElement>();
  let highlight: HTMLDivElement | undefined;
  let measure: HTMLDivElement | undefined;
  const [caret, setCaret] = createSignal<HTMLSpanElement>();
  const layout = createMentionLayout(
    { textarea, highlight: () => highlight, measure: () => measure, caret },
    { value, rows: () => p.rows, maxRows: () => p.maxRows, queryStart: () => search.query()?.start },
  );
  const anchor = createMemo(() => {
    layout.popoverPosition();
    const initialMarker = caret();
    const initialField = textarea();
    if (!initialMarker || !initialField) return undefined;
    return {
      contextElement: initialField,
      getBoundingClientRect: () => {
        const rect = initialMarker.getBoundingClientRect();
        return new DOMRect(
          rect.left - CARET_LEFT_OFFSET_PX,
          rect.top - initialField.scrollTop,
          rect.width,
          rect.height,
        );
      },
    };
  });
  const floating = createFloating(search.open, anchor);
  createDismiss(search.open, search.close, root, { refocus: false });
  let pickFrame = 0;
  onCleanup(() => cancelAnimationFrame(pickFrame));

  const pick = (option: MentionOption) => {
    const current = search.query();
    const field = textarea();
    if (!current || !field) return;
    const inserted = `${current.trigger}${option.label} `;
    const position = current.start + inserted.length;
    setValue(value().slice(0, current.start) + inserted + value().slice(field.selectionStart));
    search.close();
    p.onMention?.(option, current.trigger);
    cancelAnimationFrame(pickFrame);
    pickFrame = requestAnimationFrame(() => {
      if (!field.isConnected) return;
      field.focus();
      field.setSelectionRange(position, position);
    });
  };

  const autoId = createUniqueId();

  return (
    <Field
      label={p.label}
      hint={p.hint}
      error={p.error}
      optional={p.optional}
      required={p.required}
      id={p.id ?? autoId}
    >
      {(control) => (
        <div ref={setRoot} class={cx(styles.mention, p.class)}>
          <Control multiline invalid={control.invalid} disabled={p.disabled}>
            <div class={styles.mentionPartWrap}>
              <div
                ref={(element) => {
                  highlight = element;
                }}
                class={styles.mentionPartHl}
                aria-hidden="true"
              >
                <Index each={search.parts()}>
                  {(part, index) => (
                    <Show when={index % 2 === 1} fallback={part()}>
                      <mark class={styles.mentionPartTok}>{part()}</mark>
                    </Show>
                  )}
                </Index>
                {'\u200b'}
              </div>
              <div
                ref={(element) => {
                  measure = element;
                }}
                class={cx(styles.mentionPartHl, styles.mentionPartMeas)}
                aria-hidden="true"
              >
                {search.textBeforeTrigger()}
                <span ref={setCaret}>{search.query()?.trigger}</span>
              </div>
              <textarea
                ref={setTextarea}
                id={control.id}
                rows={p.rows}
                class={cx(styles.controlPartInput, styles.mentionPartInput, typographyClass('body'))}
                value={value()}
                placeholder={p.placeholder}
                disabled={p.disabled}
                required={p.required}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={search.open()}
                aria-controls={search.open() ? `${control.id}-list` : undefined}
                aria-activedescendant={search.open() ? `${control.id}-list-${search.activeIndex()}` : undefined}
                aria-invalid={control.invalid || undefined}
                aria-describedby={control.describedBy}
                onInput={(event) => {
                  setValue(event.currentTarget.value);
                  search.refresh(event.currentTarget);
                }}
                onKeyDown={(event) => search.onKeyDown(event, pick)}
                onKeyUp={(event) => {
                  if (NAVIGATION_KEYS.includes(event.key)) search.refresh(event.currentTarget);
                }}
                onClick={(event) => search.refresh(event.currentTarget)}
                onBlur={search.close}
                onScroll={(event) => {
                  if (highlight) highlight.scrollTop = event.currentTarget.scrollTop;
                }}
              />
            </div>
          </Control>
          <Show when={search.open() ? search.query() : undefined}>
            {(current) => (
              <MentionSuggestions
                ref={floating.ref}
                style={floating.style()}
                id={`${control.id}-list`}
                label={p.listLabel}
                trigger={current().trigger}
                position={layout.popoverPosition()}
                suggestions={search.suggestions()}
                activeIndex={search.activeIndex()}
                onPick={pick}
                onActivate={search.setActiveIndex}
              />
            )}
          </Show>
        </div>
      )}
    </Field>
  );
};
