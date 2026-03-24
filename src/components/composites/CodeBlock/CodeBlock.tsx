import { createMemo, Show } from 'solid-js';

import CopyButton from '~/components/buttons/CopyButton/CopyButton';
import CodeText from '~/components/typography/CodeText/CodeText';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

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
  const showLineNumbers = () => props.showLineNumbers ?? false;

  const lines = createMemo(() => props.code.split('\n'));

  const lineNumberText = createMemo(() =>
    lines()
      .map((_, i) => i + 1)
      .join('\n')
  );

  return (
    <div class={classNames(styles.wrapper, props.class)}>
      <Show when={showHeader()}>
        <div class={styles.header}>
          <Show when={props.language} fallback={<span class={styles.languagePlaceholder} aria-hidden="true" />}>
            <CodeText as="span" size="sm" tone="muted" class={styles.language}>
              {props.language}
            </CodeText>
          </Show>
          <Show when={copyable()}>
            <CopyButton text={props.code} size="sm" />
          </Show>
        </div>
      </Show>
      <div class={styles.body} style={props.maxHeight ? { 'max-height': props.maxHeight } : undefined}>
        <Show when={showLineNumbers()}>
          <CodeText as="pre" variant="block" size="md" class={styles.lineNumbers}>
            {lineNumberText()}
          </CodeText>
        </Show>
        <CodeText as="pre" variant="block" size="md" class={styles.codeBlock}>
          <code>{props.code}</code>
        </CodeText>
      </div>
    </div>
  );
};

export default CodeBlock;
