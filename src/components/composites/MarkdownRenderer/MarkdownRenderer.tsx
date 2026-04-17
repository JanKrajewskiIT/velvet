import remarkGfm from 'remark-gfm';
import { SolidMarkdown } from 'solid-markdown';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = (props: Props<MarkdownRendererProps>) => (
  <div class={classNames(styles.markdown, props.class)}>
    <SolidMarkdown remarkPlugins={[remarkGfm]}>{props.content}</SolidMarkdown>
  </div>
);

export default MarkdownRenderer;
