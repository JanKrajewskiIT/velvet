import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  For,
  Index,
  type JSX,
  mergeProps,
  on,
  Show,
} from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Avatar } from '../data/Avatar';
import { Control } from '../primitives/Control';
import { Field } from '../primitives/Field';
import { Option } from '../primitives/Option';
import { Surface } from '../primitives/Surface';
import {
  createMentionPattern,
  createQueryDetector,
  filterMentions,
  type MentionOption,
  type MentionQuery,
  type MentionSources,
} from './mentionModel';

const POPOVER_WIDTH_PX = 248;
const POPOVER_GAP_PX = 6;
const CARET_LEFT_OFFSET_PX = 8;
const DEFAULT_LINE_HEIGHT_PX = 20;
const MIRRORED_STYLES = [
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'tab-size',
] as const;
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
  const translate = useTranslate();
  const sources = createMemo<MentionSources>(
    () => p.sources ?? (p.tags.length ? { '@': p.users, '#': p.tags } : { '@': p.users }),
  );
  const detectQuery = createMemo(() => createQueryDetector(Object.keys(sources())));
  const mentionPattern = createMemo(() => createMentionPattern(sources()));
  const [value, setValue] = createControllable({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => p.onValueChange?.(next),
  });
  const [query, setQuery] = createSignal<MentionQuery>();
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [popoverPosition, setPopoverPosition] = createSignal({ left: 0, top: 0 });
  let textarea: HTMLTextAreaElement | undefined;
  let highlight: HTMLDivElement | undefined;
  let measure: HTMLDivElement | undefined;
  let caret: HTMLSpanElement | undefined;

  const suggestions = createMemo(() => {
    const current = query();
    return current ? filterMentions(sources()[current.trigger] ?? [], current.text, p.maxResults) : [];
  });
  const open = () => !!query() && suggestions().length > 0 && !p.disabled;
  const textBeforeTrigger = () => {
    const current = query();
    return current ? value().slice(0, current.start) : '';
  };
  const parts = () => {
    const pattern = mentionPattern();
    return pattern ? value().split(pattern) : [value()];
  };

  createEffect(
    on([value, () => p.rows, () => p.maxRows], () => {
      if (!textarea) return;
      const computed = getComputedStyle(textarea);
      for (const layer of [highlight, measure]) {
        for (const name of MIRRORED_STYLES) layer?.style.setProperty(name, computed.getPropertyValue(name));
      }
      const lineHeight = Number.parseFloat(computed.lineHeight) || DEFAULT_LINE_HEIGHT_PX;
      const padding = Number.parseFloat(computed.paddingTop) + Number.parseFloat(computed.paddingBottom);
      const maxHeight = p.maxRows * lineHeight + padding;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, p.rows * lineHeight + padding), maxHeight)}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
      if (highlight) highlight.scrollTop = textarea.scrollTop;
    }),
  );

  createEffect(
    on([() => query()?.start, value], ([start]) => {
      if (start === undefined || !caret || !textarea) return;
      setPopoverPosition({
        left: Math.max(0, Math.min(caret.offsetLeft - CARET_LEFT_OFFSET_PX, textarea.clientWidth - POPOVER_WIDTH_PX)),
        top: caret.offsetTop + caret.offsetHeight - textarea.scrollTop + POPOVER_GAP_PX,
      });
    }),
  );

  const refreshQuery = (field: HTMLTextAreaElement) => {
    setQuery(detectQuery()(field.value, field.selectionStart));
    setActiveIndex(0);
  };

  const pick = (option: MentionOption) => {
    const current = query();
    const field = textarea;
    if (!current || !field) return;
    const inserted = `${current.trigger}${option.label} `;
    const position = current.start + inserted.length;
    setValue(value().slice(0, current.start) + inserted + value().slice(field.selectionStart));
    setQuery(undefined);
    p.onMention?.(option, current.trigger);
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(position, position);
    });
  };

  const onKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (event) => {
    if (!open() || event.isComposing) return;
    const count = suggestions().length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((activeIndex() + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      const option = suggestions()[activeIndex()];
      if (option) pick(option);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setQuery(undefined);
    }
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
                <Index each={parts()}>
                  {(part, index) => (
                    <Show when={index % 2 === 1} fallback={part()}>
                      <mark class="vui-mention__tok">{part()}</mark>
                    </Show>
                  )}
                </Index>
                {'\u200b'}
              </div>
              <div ref={measure} class="vui-mention__hl vui-mention__meas" aria-hidden="true">
                {textBeforeTrigger()}
                <span ref={caret}>{query()?.trigger}</span>
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
                aria-expanded={open()}
                aria-controls={open() ? `${control.id}-list` : undefined}
                aria-activedescendant={open() ? `${control.id}-list-${activeIndex()}` : undefined}
                aria-invalid={control.invalid || undefined}
                aria-describedby={control.describedBy}
                onInput={(event) => {
                  setValue(event.currentTarget.value);
                  refreshQuery(event.currentTarget);
                }}
                onKeyDown={onKeyDown}
                onKeyUp={(event) => {
                  if (NAVIGATION_KEYS.includes(event.key)) refreshQuery(event.currentTarget);
                }}
                onClick={(event) => refreshQuery(event.currentTarget)}
                onBlur={() => setQuery(undefined)}
                onScroll={(event) => {
                  if (highlight) highlight.scrollTop = event.currentTarget.scrollTop;
                }}
              />
            </div>
          </Control>
          <Show when={open() ? query() : undefined}>
            {(current) => (
              <Surface
                variant="overlay"
                class="vui-mention__pop"
                role="listbox"
                id={`${control.id}-list`}
                aria-label={p.listLabel ?? translate('velvet.forms.mentionInput.listLabel')}
                style={{ left: `${popoverPosition().left}px`, top: `${popoverPosition().top}px` }}
              >
                <For each={suggestions()}>
                  {(option, index) => (
                    <Option
                      id={`${control.id}-list-${index()}`}
                      active={index() === activeIndex()}
                      label={option.label}
                      description={option.description}
                      icon={
                        current().trigger === '@' ? (
                          <Avatar size="xs" name={option.label} src={option.src} />
                        ) : (
                          (option.icon ?? 'tag')
                        )
                      }
                      onMouseDown={(event) => {
                        event.preventDefault();
                        pick(option);
                      }}
                      onMouseEnter={() => setActiveIndex(index())}
                    />
                  )}
                </For>
              </Surface>
            )}
          </Show>
        </div>
      )}
    </Field>
  );
};
