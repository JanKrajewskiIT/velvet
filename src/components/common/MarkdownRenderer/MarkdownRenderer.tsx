import DOMPurify from 'dompurify';
import remarkGfm from 'remark-gfm';
import { createMemo } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';

import type Props from '../../../models/Props';
import styles from './MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = (props: Props<MarkdownRendererProps>) => {
  const sanitized = createMemo(() => DOMPurify.sanitize(props.content));

  return (
    <div class={`${styles.markdown} ${props.class ?? ''}`}>
      <SolidMarkdown remarkPlugins={[remarkGfm]}>{sanitized()}</SolidMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
