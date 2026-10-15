import type { I18nKey } from '@jankrajewskiit/i18n';
import { createMemo, createSignal, createUniqueId, For, mergeProps, onCleanup, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './CodeSnippet.module.css';
import { cssLength } from './cssLength';
import { highlight } from './highlight';

const TK_CLASSES = {
  k: styles.tkK,
  s: styles.tkS,
  n: styles.tkN,
  c: styles.tkC,
  t: styles.tkT,
  p: styles.tkP,
} as const;

const COPIED_FEEDBACK_MS = 1600;

type CopyStatus = 'idle' | 'copied' | 'failed';

const COPY_LABEL_KEY: Record<CopyStatus, I18nKey> = {
  idle: 'velvet.common.copy',
  copied: 'velvet.common.copied',
  failed: 'velvet.data.codeSnippet.copyFailed',
};

export interface CodeSnippetTab {
  label: string;
  code: string;
  language?: string;
}

export interface CodeSnippetProps {
  code?: string;
  /** @default 'jsx' */
  language?: string;
  title?: string;
  /** Multiple variants — npm / yarn / pnpm. */
  tabs?: CodeSnippetTab[];
  /** @default true */
  showLineNumbers?: boolean;
  /** px or CSS length. @default 320 */
  maxHeight?: number | string;
  /** @default false */
  wrap?: boolean;
  class?: string;
}

/** Code block with lightweight highlighting (js/jsx/ts/html/css/bash), line numbers, copy button (announced), optional language tabs. Always dark, in both themes. */
export const CodeSnippet = (props: CodeSnippetProps) => {
  const merged = mergeProps(
    {
      code: '',
      language: 'jsx',
      showLineNumbers: true,
      maxHeight: 320,
      wrap: false,
    } satisfies Partial<CodeSnippetProps>,
    props,
  );
  const translate = useTranslate();
  const baseId = createUniqueId();
  const [tabIndex, setTabIndex] = createSignal(0);
  const [copyStatus, setCopyStatus] = createSignal<CopyStatus>('idle');
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(resetTimer));

  const current = () => {
    const tab = merged.tabs?.[tabIndex()];
    return tab
      ? { code: tab.code, language: tab.language ?? merged.language, label: tab.label }
      : { code: merged.code, language: merged.language, label: merged.title };
  };
  const lines = createMemo(() => current().code.replace(/\n$/u, '').split('\n'));

  const copyLabel = () => translate(COPY_LABEL_KEY[copyStatus()]);
  const copyAnnouncement = () =>
    copyStatus() === 'copied'
      ? translate('velvet.data.codeSnippet.copiedAnnouncement')
      : copyStatus() === 'failed'
        ? translate('velvet.data.codeSnippet.copyFailed')
        : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current().code);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => setCopyStatus('idle'), COPIED_FEEDBACK_MS);
  };

  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    const count = merged.tabs?.length ?? 0;
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % count
        : event.key === 'ArrowLeft'
          ? (index - 1 + count) % count
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? count - 1
              : undefined;
    if (next === undefined || !(event.currentTarget instanceof HTMLElement)) return;
    event.preventDefault();
    setTabIndex(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div class={cx(typographyClass('body-sm'), styles.code, merged.class)}>
      <div class={styles.codePartBar}>
        <Show
          when={merged.tabs}
          fallback={
            <Text as="span" variant="kbd" tone="inherit" class={styles.codePartTitle}>
              {current().label || current().language}
            </Text>
          }
        >
          {(tabs) => (
            <div role="tablist" class={styles.codePartTabs}>
              <For each={tabs()}>
                {(tab, index) => (
                  <button
                    type="button"
                    role="tab"
                    id={`${baseId}-t${index()}`}
                    aria-selected={index() === tabIndex()}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={index() === tabIndex() ? 0 : -1}
                    class={cx(
                      typographyClass('kbd'),
                      styles.codePartTab,
                      index() === tabIndex() && styles.codePartTabVariantOn,
                    )}
                    onClick={() => setTabIndex(index())}
                    onKeyDown={(event) => onTabKeyDown(event, index())}
                  >
                    {tab.label}
                  </button>
                )}
              </For>
            </div>
          )}
        </Show>
        <button
          type="button"
          class={cx(
            typographyClass('label-sm'),
            styles.codePartCopy,
            copyStatus() === 'copied' && styles.codePartCopyVariantDone,
          )}
          onClick={() => void copy().catch(reportAsyncError)}
          aria-label={copyStatus() === 'idle' ? translate('velvet.data.codeSnippet.copyCode') : copyLabel()}
        >
          <Glyph name={copyStatus() === 'copied' ? 'check' : 'copy'} />
          <Text as="span" variant="button-sm" tone="inherit">
            {copyLabel()}
          </Text>
        </button>
        <Text as="span" variant="caption" tone="inherit" class={styles.srOnly} aria-live="polite">
          {copyAnnouncement()}
        </Text>
      </div>
      <Text
        as="pre"
        variant="code"
        tone="inherit"
        id={`${baseId}-panel`}
        class={cx(styles.codePartPre, merged.wrap && styles.codePartPreVariantWrap)}
        style={{ 'max-height': cssLength(merged.maxHeight) }}
        tabIndex={0}
        role={merged.tabs ? 'tabpanel' : undefined}
        aria-labelledby={merged.tabs ? `${baseId}-t${tabIndex()}` : undefined}
      >
        <code>
          <For each={lines()}>
            {(line, index) => (
              <span class={styles.codePartLine}>
                <Show when={merged.showLineNumbers}>
                  <span class={styles.codePartLn} aria-hidden="true">
                    {index() + 1}
                  </span>
                </Show>
                <span>
                  <For each={highlight(line, current().language)} fallback=" ">
                    {(token) => (
                      <Show when={token.kind} fallback={token.text}>
                        {(kind) => <span class={variantClass(TK_CLASSES, kind())}>{token.text}</span>}
                      </Show>
                    )}
                  </For>
                </span>
              </span>
            )}
          </For>
        </code>
      </Text>
    </div>
  );
};
