import type { I18nKey } from '@jankrajewskiit/i18n';
import { children as resolveChildren, createSignal, For, type JSX, mergeProps, onCleanup, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { IconButton } from '../actions/IconButton';
import { Avatar } from '../data/Avatar';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './ChatMessage.module.css';
import { TypingIndicator } from './TypingIndicator';

const CHATMSG_CLASSES = {
  assistant: styles.chatmsgVariantAssistant,
  user: styles.chatmsgVariantUser,
  system: styles.chatmsgVariantSystem,
} as const;

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
        <div class={cx(typographyClass('caption'), styles.chatmsg, styles.chatmsgVariantSystem, p.class)} role="note">
          <Text as="span" variant="body" tone="inherit">
            {content()}
          </Text>
          <Show when={p.time}>
            <Text as="time" variant="caption" tone="tertiary" class="vui-chatmsg__time">
              {p.time}
            </Text>
          </Show>
        </div>
      }
    >
      <div
        class={cx(
          typographyClass('body'),
          styles.chatmsg,
          variantClass(CHATMSG_CLASSES, p.role),
          !!p.error && 'vui-chatmsg--error',
          p.class,
        )}
      >
        <Show when={!isUser()}>
          <span class={styles.chatmsgPartAvatar}>
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
        <div class={styles.chatmsgPartMain}>
          <Show when={p.author || p.time}>
            <div class={cx(styles.chatmsgPartMeta, typographyClass('body-sm'))}>
              <Show when={p.author}>
                <Text as="span" variant="label" tone="inherit">
                  {p.author}
                </Text>
              </Show>
              <Show when={p.time}>
                <Text as="time" variant="caption" tone="tertiary" class="vui-chatmsg__time">
                  {p.time}
                </Text>
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
              class={cx(styles.chatmsgPartBody, typographyClass('body'))}
            >
              {content()}
              <Show when={p.streaming}>
                <span class={styles.chatmsgPartCaret} aria-hidden="true" />
              </Show>
            </div>
          </Show>
          <Show when={p.error}>
            <Text as="div" variant="body-sm" tone="danger" class={styles.chatmsgPartError} role="alert">
              <Glyph name="alert-circle" />
              <Text as="span" variant="body-sm" tone="inherit">
                {errorText()}
              </Text>
              <Show when={p.onRetry}>
                <button
                  type="button"
                  class={cx(styles.chatmsgPartRetry, typographyClass('label'))}
                  onClick={() => p.onRetry?.()}
                >
                  {translate('velvet.common.retry')}
                </button>
              </Show>
            </Text>
          </Show>
          <Show when={(p.sources?.length ?? 0) > 0 && !p.streaming}>
            <div class={styles.chatmsgPartSources}>
              <For each={p.sources}>
                {(source, index) => (
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    class={cx(styles.chatmsgPartSrc, typographyClass('caption'))}
                    title={source.title}
                  >
                    <Text as="b" variant="micro" tone="inherit">
                      {index() + 1}
                    </Text>
                    <Text as="span" variant="caption" tone="inherit">
                      {source.title}
                    </Text>
                  </a>
                )}
              </For>
            </div>
          </Show>
          <Show when={showTools()}>
            <div class={styles.chatmsgPartTools}>
              <IconButton
                class={cx(styles.chatmsgPartTool, copyStatus() === 'copied' && styles.chatmsgPartToolVariantOn)}
                icon={copyStatus() === 'copied' ? 'check' : 'copy'}
                label={copyLabel()}
                size="xs"
                variant="ghost"
                onClick={() => void copy().catch(reportAsyncError)}
              />
              <Show when={p.onRetry}>
                <IconButton
                  class={styles.chatmsgPartTool}
                  icon="refresh"
                  label={translate('velvet.patterns.chatMessage.regenerate')}
                  size="xs"
                  variant="ghost"
                  onClick={() => p.onRetry?.()}
                />
              </Show>
              <Show when={p.onFeedback}>
                <IconButton
                  class={cx(styles.chatmsgPartTool, p.feedback === 'up' && styles.chatmsgPartToolVariantOn)}
                  icon="thumbs-up"
                  label={translate('velvet.patterns.chatMessage.goodResponse')}
                  aria-pressed={p.feedback === 'up'}
                  size="xs"
                  variant="ghost"
                  onClick={() => vote('up')}
                />
                <IconButton
                  class={cx(
                    styles.chatmsgPartTool,
                    styles.chatmsgPartToolVariantDown,
                    p.feedback === 'down' && styles.chatmsgPartToolVariantOn,
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
