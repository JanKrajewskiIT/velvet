import { IoCheckmark, IoCopy } from 'solid-icons/io';
import { createMemo, createSignal, onCleanup, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  maxHeight?: string;
}

const CodeBlock = (props: Props<CodeBlockProps>) => {
  const [copied, setCopied] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const copyable = () => props.copyable ?? true;
  const showHeader = () => props.language || copyable();

  const lines = createMemo(() => props.code.split('\n'));

  const lineNumberText = createMemo(() =>
    lines()
      .map((_, i) => i + 1)
      .join('\n')
  );

  const handleCopy = () => {
    void navigator.clipboard.writeText(props.code).then(() => {
      setCopied(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setCopied(false), 2000);
    });
  };

  onCleanup(() => clearTimeout(timeoutId));

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <Show when={showHeader()}>
        <div class={styles.header}>
          <Show when={props.language} fallback={<span />}>
            <span class={styles.language}>{props.language}</span>
          </Show>
          <Show when={copyable()}>
            <button type="button" class={`${styles.copyBtn} ${copied() ? styles.copied : ''}`} onClick={handleCopy}>
              <Show when={copied()} fallback={<IoCopy />}>
                <IoCheckmark />
              </Show>
              {copied() ? 'Copied!' : 'Copy'}
            </button>
          </Show>
        </div>
      </Show>
      <div class={styles.body} style={props.maxHeight ? { 'max-height': props.maxHeight } : undefined}>
        <Show when={props.showLineNumbers}>
          <pre class={styles.lineNumbers}>{lineNumberText()}</pre>
        </Show>
        <pre class={styles.code}>
          <code>{props.code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
