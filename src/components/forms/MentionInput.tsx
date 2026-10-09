import { createUniqueId, Index, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { cx } from '../../utils/cx';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { createMentionLayout } from './createMentionLayout';
import { createMentionSearch } from './createMentionSearch';
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
  let textarea: HTMLTextAreaElement | undefined;
  let highlight: HTMLDivElement | undefined;
  let measure: HTMLDivElement | undefined;
  let caret: HTMLSpanElement | undefined;
  const layout = createMentionLayout(
    { textarea: () => textarea, highlight: () => highlight, measure: () => measure, caret: () => caret },
    { value, rows: () => p.rows, maxRows: () => p.maxRows, queryStart: () => search.query()?.start },
  );

  const pick = (option: MentionOption) => {
    const current = search.query();
    const field = textarea;
    if (!current || !field) return;
    const inserted = `${current.trigger}${option.label} `;
    const position = current.start + inserted.length;
    setValue(value().slice(0, current.start) + inserted + value().slice(field.selectionStart));
    search.close();
    p.onMention?.(option, current.trigger);
    requestAnimationFrame(() => {
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
        <div class={cx('vui-mention', p.class)}>
          <Control multiline invalid={control.invalid} disabled={p.disabled}>
            <div class="vui-mention__wrap">
              <div ref={highlight} class="vui-mention__hl" aria-hidden="true">
                <Index each={search.parts()}>
                  {(part, index) => (
                    <Show when={index % 2 === 1} fallback={part()}>
                      <mark class="vui-mention__tok">{part()}</mark>
                    </Show>
                  )}
                </Index>
                {'\u200b'}
              </div>
              <div ref={measure} class="vui-mention__hl vui-mention__meas" aria-hidden="true">
                {search.textBeforeTrigger()}
                <span ref={caret}>{search.query()?.trigger}</span>
              </div>
              <textarea
                ref={textarea}
                id={control.id}
                rows={p.rows}
                class="vui-control__input vui-mention__input"
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
