import { createEffect, For, type JSX, mergeProps, onMount, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { IconButton } from '../actions/IconButton';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { createPromptSubmission } from './createPromptSubmission';
import styles from './PromptInput.module.css';
import type { PromptAttachment, PromptSubmissionProps } from './promptSubmissionTypes';

export type { PromptAttachment, PromptSubmissionProps } from './promptSubmissionTypes';

export interface PromptInputProps extends PromptSubmissionProps {
  value?: string;
  /** @default '' */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  submitErrorText?: string;
  onStop?: () => void;
  /** @default localized "Ask anything…" */
  placeholder?: string;
  /** @default 8 */
  maxRows?: number;
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

  const submission = createPromptSubmission(p, text, setText);
  const send = () => {
    void submission.send().catch(reportAsyncError);
  };
  const stop = () => {
    if (!p.disabled && p.onStop) {
      submission.cancel();
      p.onStop();
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send();
    } else if (e.key === 'Escape' && p.loading && p.onStop) {
      e.preventDefault();
      stop();
    }
  };
  const pickSuggestion = (suggestion: string) => {
    if (p.disabled || p.loading || submission.pending()) return;
    if (p.onSuggestion) p.onSuggestion(suggestion);
    else setText(suggestion);
    input.focus();
  };
  const showSuggestions = () => (p.suggestions?.length ?? 0) > 0 && !text() && !p.attachments.length;

  return (
    <div class={cx(typographyClass('body'), styles.prompt, p.disabled && styles.promptVariantDisabled, p.class)}>
      <Show when={showSuggestions()}>
        <div class={styles.promptPartSugs}>
          <For each={p.suggestions}>
            {(suggestion) => (
              <button
                type="button"
                class={cx(styles.promptPartSug, typographyClass('label'))}
                disabled={p.disabled || p.loading || submission.pending()}
                onClick={() => pickSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            )}
          </For>
        </div>
      </Show>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- pointer-only focus forwarding to the textarea; the textarea is the keyboard target */}
      <div
        class={styles.promptPartBox}
        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) return;
          e.preventDefault();
          input.focus();
        }}
      >
        <Show when={p.attachments.length > 0}>
          <div class={styles.promptPartFiles}>
            <For each={p.attachments}>
              {(attachment) => (
                <Text as="span" variant="caption" tone="primary" class={styles.promptPartFile}>
                  <Glyph name={attachment.icon ?? 'file-text'} />
                  <Text as="span" variant="label-sm" tone="inherit">
                    {attachment.name}
                  </Text>
                  <Show when={attachment.size}>
                    <Text as="small" variant="micro" tone="inherit">
                      {attachment.size}
                    </Text>
                  </Show>
                  <Show when={p.onRemoveAttachment}>
                    <button
                      type="button"
                      class={styles.promptPartFx}
                      aria-label={translate('velvet.patterns.promptInput.remove', { name: attachment.name })}
                      disabled={p.disabled || p.loading || submission.pending()}
                      onClick={() => p.onRemoveAttachment?.(attachment)}
                    >
                      <Glyph name="x" />
                    </button>
                  </Show>
                </Text>
              )}
            </For>
          </div>
        </Show>
        <textarea
          ref={(element) => {
            input = element;
          }}
          rows={1}
          class={cx(styles.promptPartInput, typographyClass('body'))}
          value={text()}
          placeholder={p.placeholder ?? translate('velvet.patterns.promptInput.placeholder')}
          aria-label={p.label ?? translate('velvet.patterns.promptInput.label')}
          disabled={p.disabled}
          onInput={(e) => setText(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <div class={styles.promptPartBar}>
          <Show when={p.onAttach}>
            <IconButton
              icon="paperclip"
              label={translate('velvet.patterns.promptInput.attach')}
              size="sm"
              variant="ghost"
              onClick={() => p.onAttach?.()}
              disabled={p.disabled || p.loading || submission.pending()}
            />
          </Show>
          {p.toolbar}
          <Text as="span" variant="overline" tone="inherit" class={styles.promptPartHint}>
            {p.hint ??
              translate(p.loading ? 'velvet.patterns.promptInput.hintStop' : 'velvet.patterns.promptInput.hintSend')}
          </Text>
          <Show
            when={p.loading && p.onStop}
            fallback={
              <IconButton
                icon={
                  submission.pending() ? (
                    <span
                      class={cx(styles.loader, styles.loaderVariantRing, styles.loaderVariantSm)}
                      aria-hidden="true"
                    />
                  ) : (
                    'arrow-up'
                  )
                }
                label={translate('velvet.patterns.promptInput.send')}
                size="sm"
                variant="primary"
                shape="circle"
                disabled={!submission.canSend()}
                aria-busy={submission.pending() || undefined}
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
              disabled={p.disabled}
              onClick={stop}
            />
          </Show>
        </div>
      </div>
      <Show when={submission.failed()}>
        <Text as="div" variant="caption" tone="inherit" class={cx(styles.hint, styles.hintVariantError)} role="alert">
          {p.submitErrorText ?? translate('velvet.patterns.promptInput.submitError')}
        </Text>
      </Show>
    </div>
  );
};
