import { createMemo, Show } from 'solid-js';

import CopyButton from '~/components/inputs/CopyButton/CopyButton';
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
  const copyable = () => props.copyable ?? true;
  const showHeader = () => props.language || copyable();

  const lines = createMemo(() => props.code.split('\n'));

  const lineNumberText = createMemo(() =>
    lines()
      .map((_, i) => i + 1)
      .join('\n')
  );

  return (
    <div class={`${styles.wrapper} ${props.class ?? ''}`}>
      <Show when={showHeader()}>
        <div class={styles.header}>
          <Show when={props.language} fallback={<span />}>
            <span class={styles.language}>{props.language}</span>
          </Show>
          <Show when={copyable()}>
            <CopyButton text={props.code} size="sm" />
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
