import type { I18nKey } from '@jankrajewskiit/i18n';
import { children as resolveChildren, createSignal, For, type JSX, mergeProps, onCleanup, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { IconButton } from '../actions/IconButton';
import { Avatar } from '../data/Avatar';
import { Glyph } from '../primitives/Glyph';
import { TypingIndicator } from './TypingIndicator';

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatFeedback = 'up' | 'down' | null;

export interface ChatSource {
  title: string;
  href?: string;
}

export interface ChatMessageProps {
  /** @default 'assistant' */
  role?: ChatRole;
  author?: JSX.Element;
  /** Replaces the default sparkles avatar (assistant only) */
  avatar?: JSX.Element;
  time?: JSX.Element;
  /** Plain text — also what Copy puts on the clipboard. Use children for rich content (Markdown, code). */
  content?: string;
  children?: JSX.Element;
  /** Still generating — caret, tools hidden */
  streaming?: boolean;
  /** true = default message, or your own text */
  error?: JSX.Element;
  /** Shows Regenerate (and Retry on error) */
  onRetry?: () => void;
  onCopy?: (text: string) => void;
  feedback?: ChatFeedback;
  /** Shows 👍 / 👎 toggles */
  onFeedback?: (value: ChatFeedback) => void;
  /** Numbered citation chips under the answer */
  sources?: ChatSource[];
  /** Extra tools after the built-in ones */
  actions?: JSX.Element;
  class?: string;
}

const COPY_FEEDBACK_MS = 1500;

type CopyStatus = 'idle' | 'copied' | 'failed';

const COPY_LABEL_KEYS: Record<CopyStatus, I18nKey> = {
  idle: 'velvet.common.copy',
  copied: 'velvet.common.copied',
  failed: 'velvet.patterns.chatMessage.copyFailed',
};

/** One turn in an AI / support conversation: user bubble, assistant text with tools, or a centred system note. */
export const ChatMessage = (props: ChatMessageProps) => {
  const p = mergeProps({ role: 'assistant', streaming: false } satisfies ChatMessageProps, props);
  const translate = useTranslate();
  const rich = resolveChildren(() => p.children);
  const [copyStatus, setCopyStatus] = createSignal<CopyStatus>('idle');
  let body: HTMLDivElement | undefined;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(resetTimer));

  const content = (): JSX.Element => (rich.toArray().length > 0 ? rich() : p.content);
  const empty = () => {
    const value = content();
    return value == null || value === '';
  };
  const isUser = () => p.role === 'user';
  const showTools = () => !isUser() && !p.streaming && !p.error && !empty();
  const errorText = () => (p.error === true ? translate('velvet.patterns.chatMessage.errorDefault') : p.error);

  const copy = async () => {
    const text = p.content ?? body?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      p.onCopy?.(text);
    } catch {
      setCopyStatus('failed');
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_MS);
  };
  const copyLabel = () => translate(COPY_LABEL_KEYS[copyStatus()]);
  const vote = (value: 'up' | 'down') => p.onFeedback?.(p.feedback === value ? null : value);

  return (
    <Show
      when={p.role !== 'system'}
      fallback={
        <div class={cx('vui-chatmsg', 'vui-chatmsg--system', p.class)} role="note">
          <span>{content()}</span>
          <Show when={p.time}>
            <time class="vui-chatmsg__time">{p.time}</time>
          </Show>
        </div>
      }
    >
      <div class={cx('vui-chatmsg', `vui-chatmsg--${p.role}`, !!p.error && 'vui-chatmsg--error', p.class)}>
        <Show when={!isUser()}>
          <span class="vui-chatmsg__avatar">
            <Show
              when={p.avatar}
              fallback={
                <Avatar size="sm" color="var(--action-primary)">
                  <Glyph name="sparkles" />
                </Avatar>
              }
            >
              {p.avatar}
            </Show>
          </span>
        </Show>
        <div class="vui-chatmsg__main">
          <Show when={p.author || p.time}>
            <div class="vui-chatmsg__meta">
              <Show when={p.author}>
                <span class="vui-chatmsg__author">{p.author}</span>
              </Show>
              <Show when={p.time}>
                <time class="vui-chatmsg__time">{p.time}</time>
              </Show>
            </div>
          </Show>
          <Show
            when={!empty()}
            fallback={
              <Show when={p.streaming}>
                <TypingIndicator />
              </Show>
            }
          >
            <div
              ref={(element) => {
                body = element;
              }}
              class="vui-chatmsg__body"
            >
              {content()}
              <Show when={p.streaming}>
                <span class="vui-chatmsg__caret" aria-hidden="true" />
              </Show>
            </div>
          </Show>
          <Show when={p.error}>
            <div class="vui-chatmsg__error" role="alert">
              <Glyph name="alert-circle" />
              <span>{errorText()}</span>
              <Show when={p.onRetry}>
                <button type="button" class="vui-chatmsg__retry" onClick={() => p.onRetry?.()}>
                  {translate('velvet.common.retry')}
                </button>
              </Show>
            </div>
          </Show>
          <Show when={(p.sources?.length ?? 0) > 0 && !p.streaming}>
            <div class="vui-chatmsg__sources">
              <For each={p.sources}>
                {(source, index) => (
                  <a href={source.href} target="_blank" rel="noreferrer" class="vui-chatmsg__src" title={source.title}>
                    <b>{index() + 1}</b>
                    <span>{source.title}</span>
                  </a>
                )}
              </For>
            </div>
          </Show>
          <Show when={showTools()}>
            <div class="vui-chatmsg__tools">
              <IconButton
                class={cx('vui-chatmsg__tool', copyStatus() === 'copied' && 'vui-chatmsg__tool--on')}
                icon={copyStatus() === 'copied' ? 'check' : 'copy'}
                label={copyLabel()}
                size="xs"
                variant="ghost"
                onClick={() => void copy().catch(reportAsyncError)}
              />
              <Show when={p.onRetry}>
                <IconButton
                  class="vui-chatmsg__tool"
                  icon="refresh"
                  label={translate('velvet.patterns.chatMessage.regenerate')}
                  size="xs"
                  variant="ghost"
                  onClick={() => p.onRetry?.()}
                />
              </Show>
              <Show when={p.onFeedback}>
                <IconButton
                  class={cx('vui-chatmsg__tool', p.feedback === 'up' && 'vui-chatmsg__tool--on')}
                  icon="thumbs-up"
                  label={translate('velvet.patterns.chatMessage.goodResponse')}
                  aria-pressed={p.feedback === 'up'}
                  size="xs"
                  variant="ghost"
                  onClick={() => vote('up')}
                />
                <IconButton
                  class={cx(
                    'vui-chatmsg__tool',
                    'vui-chatmsg__tool--down',
                    p.feedback === 'down' && 'vui-chatmsg__tool--on',
                  )}
                  icon="thumbs-up"
                  label={translate('velvet.patterns.chatMessage.badResponse')}
                  aria-pressed={p.feedback === 'down'}
                  size="xs"
                  variant="ghost"
                  onClick={() => vote('down')}
                />
              </Show>
              {p.actions}
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
