import { createEffect, For, type JSX, mergeProps, onMount, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { IconButton } from '../actions/IconButton';
import { Glyph } from '../primitives/Glyph';

export interface PromptAttachment {
  id?: string;
  name: string;
  size?: string;
  icon?: string;
}

export interface PromptInputProps {
  value?: string;
  /** @default '' */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with trimmed text + current attachments; the field clears itself */
  onSubmit?: (text: string, attachments: PromptAttachment[]) => void;
  /** Generating — shows Stop */
  loading?: boolean;
  onStop?: () => void;
  /** @default localized "Ask anything…" */
  placeholder?: string;
  /** @default 8 */
  maxRows?: number;
  /** @default [] */
  attachments?: PromptAttachment[];
  /** Shows the paperclip button */
  onAttach?: () => void;
  onRemoveAttachment?: (attachment: PromptAttachment) => void;
  /** Starter prompts shown while empty. Click fills the field (or calls onSuggestion). */
  suggestions?: string[];
  onSuggestion?: (suggestion: string) => void;
  /** Extra controls left of the hint — model Select, toggles */
  toolbar?: JSX.Element;
  /** Replaces the keyboard hint */
  hint?: JSX.Element;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Accessible name. @default localized "Message" */
  label?: string;
  class?: string;
}

const FALLBACK_LINE_HEIGHT_PX = 22;

/**
 * Composer for AI chat. Auto-grows to `maxRows`; ↵ sends, ⇧↵ new line (IME-safe). While loading the Send button becomes Stop (Esc also stops).
 * Attachment chips above the text, optional suggestion chips when empty, a toolbar slot for model / mode pickers.
 */
export const PromptInput = (props: PromptInputProps) => {
  const p = mergeProps(
    {
      defaultValue: '',
      loading: false,
      maxRows: 8,
      attachments: [] as PromptAttachment[],
    } satisfies PromptInputProps,
    props,
  );
  const translate = useTranslate();
  const [text, setText] = createControllable<string>({
    value: () => p.value,
    defaultValue: p.defaultValue,
    onChange: (next) => p.onValueChange?.(next),
  });
  let input!: HTMLTextAreaElement;

  createEffect(() => {
    text();
    const style = getComputedStyle(input);
    const lineHeight = parseFloat(style.lineHeight) || FALLBACK_LINE_HEIGHT_PX;
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const maxHeight = p.maxRows * lineHeight + padding;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, maxHeight)}px`;
    input.style.overflowY = input.scrollHeight > maxHeight ? 'auto' : 'hidden';
  });
  onMount(() => {
    if (p.autoFocus) input.focus();
  });

  const canSend = () => !p.disabled && !p.loading && (text().trim() !== '' || p.attachments.length > 0);
  const send = () => {
    if (!canSend()) return;
    p.onSubmit?.(text().trim(), p.attachments);
    setText('');
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send();
    } else if (e.key === 'Escape' && p.loading && p.onStop) {
      e.preventDefault();
      p.onStop();
    }
  };
  const pickSuggestion = (suggestion: string) => {
    if (p.onSuggestion) p.onSuggestion(suggestion);
    else setText(suggestion);
    input.focus();
  };
  const showSuggestions = () => (p.suggestions?.length ?? 0) > 0 && !text() && !p.attachments.length;

  return (
    <div class={cx('vui-prompt', p.disabled && 'vui-prompt--disabled', p.class)}>
      <Show when={showSuggestions()}>
        <div class="vui-prompt__sugs">
          <For each={p.suggestions}>
            {(suggestion) => (
              <button type="button" class="vui-prompt__sug" onClick={() => pickSuggestion(suggestion)}>
                {suggestion}
              </button>
            )}
          </For>
        </div>
      </Show>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- pointer-only focus forwarding to the textarea; the textarea is the keyboard target */}
      <div
        class="vui-prompt__box"
        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) return;
          e.preventDefault();
          input.focus();
        }}
      >
        <Show when={p.attachments.length > 0}>
          <div class="vui-prompt__files">
            <For each={p.attachments}>
              {(attachment) => (
                <span class="vui-prompt__file">
                  <Glyph name={attachment.icon ?? 'file-text'} />
                  <span>{attachment.name}</span>
                  <Show when={attachment.size}>
                    <small>{attachment.size}</small>
                  </Show>
                  <Show when={p.onRemoveAttachment}>
                    <button
                      type="button"
                      class="vui-prompt__fx"
                      aria-label={translate('velvet.patterns.promptInput.remove', { name: attachment.name })}
                      onClick={() => p.onRemoveAttachment?.(attachment)}
                    >
                      <Glyph name="x" />
                    </button>
                  </Show>
                </span>
              )}
            </For>
          </div>
        </Show>
        <textarea
          ref={input}
          rows={1}
          class="vui-prompt__input"
          value={text()}
          placeholder={p.placeholder ?? translate('velvet.patterns.promptInput.placeholder')}
          aria-label={p.label ?? translate('velvet.patterns.promptInput.label')}
          disabled={p.disabled}
          onInput={(e) => setText(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <div class="vui-prompt__bar">
          <Show when={p.onAttach}>
            <IconButton
              icon="paperclip"
              label={translate('velvet.patterns.promptInput.attach')}
              size="sm"
              variant="ghost"
              onClick={() => p.onAttach?.()}
              disabled={p.disabled}
            />
          </Show>
          {p.toolbar}
          <span class="vui-prompt__hint">
            {p.hint ??
              translate(p.loading ? 'velvet.patterns.promptInput.hintStop' : 'velvet.patterns.promptInput.hintSend')}
          </span>
          <Show
            when={p.loading}
            fallback={
              <IconButton
                icon="arrow-up"
                label={translate('velvet.patterns.promptInput.send')}
                size="sm"
                variant="primary"
                shape="circle"
                disabled={!canSend()}
                onClick={send}
              />
            }
          >
            <IconButton
              icon="stop"
              label={translate('velvet.patterns.promptInput.stop')}
              size="sm"
              variant="secondary"
              shape="circle"
              onClick={() => p.onStop?.()}
            />
          </Show>
        </div>
      </div>
    </div>
  );
};
