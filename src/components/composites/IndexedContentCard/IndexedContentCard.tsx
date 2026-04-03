import type { JSX } from 'solid-js';
import { createMemo, Show } from 'solid-js';

import MarkdownRenderer from '~/components/composites/MarkdownRenderer/MarkdownRenderer';
import Heading from '~/components/typography/Heading/Heading';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './IndexedContentCard.module.css';

export type IndexedContentCardTone = 'default' | 'primary' | 'warning';

interface IndexedContentCardProps {
  index: number | string;
  label: string;
  summary?: string;
  detail?: JSX.Element;
  actions?: JSX.Element;
  tone?: IndexedContentCardTone;
  animationOrder?: number;
}

const IndexedContentCard = (props: Props<IndexedContentCardProps>) => {
  const resolvedIndex = createMemo(() =>
    typeof props.index === 'number' ? String(props.index + 1).padStart(2, '0') : props.index,
  );
  const toneClass = createMemo(() => {
    if (props.tone === 'primary') return styles.tonePrimary;
    if (props.tone === 'warning') return styles.toneWarning;
    return undefined;
  });
  const summaryContent = createMemo(() => props.summary?.trim());

  return (
    <article
      class={classNames(styles.card, toneClass(), props.class)}
      style={{ '--indexed-content-order': String(props.animationOrder ?? 0) }}
    >
      <Heading as="span" level={3} variant="h3" tone="muted" class={styles.index}>
        {resolvedIndex()}
      </Heading>

      <div class={styles.content}>
        <div class={styles.header}>
          <MarkdownRenderer content={`**${props.label}**`} />
          <Show when={props.actions}>
            <div class={styles.actions}>{props.actions}</div>
          </Show>
        </div>

        <Show when={summaryContent()}>
          <div class={styles.summary}>
            <MarkdownRenderer content={summaryContent() ?? ''} />
          </div>
        </Show>

        <Show when={props.detail}>
          <div class={styles.detail}>{props.detail}</div>
        </Show>
      </div>
    </article>
  );
};

export type { IndexedContentCardProps };
export default IndexedContentCard;
