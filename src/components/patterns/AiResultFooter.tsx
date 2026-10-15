import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { CopyButton } from '../actions/CopyButton';
import { Text } from '../primitives/Text';
import styles from './AiResultFooter.module.css';
import type { AiFeedback } from './aiResultTypes';

export interface AiResultFooterProps {
  streaming: boolean;
  plain: () => string;
  tokens?: number;
  cost?: string;
  feedback: AiFeedback;
  feedbackEnabled: boolean;
  onToggleFeedback: (value: 'up' | 'down') => void;
  onCopy?: (text: string) => void;
  onRegenerate?: () => void;
}

/** Copy, regenerate and feedback actions with token and cost meta. */
export const AiResultFooter = (props: AiResultFooterProps) => {
  const translate = useTranslate();
  const meta = () =>
    [
      props.tokens != null ? translate('velvet.patterns.aiResultPanel.tokens', { count: props.tokens }) : null,
      props.cost,
    ]
      .filter(Boolean)
      .join(' · ');

  return (
    <footer class={styles.aiPartFoot}>
      <Show
        when={!props.streaming}
        fallback={
          <Text as="span" variant="kbd" tone="inherit" class={styles.aiPartMeta} style={{ 'margin-left': 0 }}>
            {translate('velvet.patterns.aiResultPanel.writing')}
          </Text>
        }
      >
        <CopyButton value={props.plain} variant="ghost" size="sm" onCopy={props.onCopy} />
        <Show when={props.onRegenerate}>
          <Button variant="ghost" size="sm" iconLeft="refresh" onClick={() => props.onRegenerate?.()}>
            {translate('velvet.patterns.aiResultPanel.regenerate')}
          </Button>
        </Show>
        <Show when={props.feedbackEnabled}>
          <Text
            as="span"
            variant="caption"
            tone="tertiary"
            class={styles.aiPartFb}
            role="group"
            aria-label={translate('velvet.patterns.aiResultPanel.feedbackLabel')}
          >
            <Text as="span" variant="button-sm" tone="inherit">
              {translate('velvet.patterns.aiResultPanel.helpful')}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={props.feedback === 'up'}
              onClick={() => props.onToggleFeedback('up')}
            >
              {translate('velvet.common.yes')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-pressed={props.feedback === 'down'}
              onClick={() => props.onToggleFeedback('down')}
            >
              {translate('velvet.common.no')}
            </Button>
          </Text>
        </Show>
        <Show when={meta()}>
          <Text as="span" variant="kbd" tone="inherit" class={styles.aiPartMeta}>
            {meta()}
          </Text>
        </Show>
      </Show>
    </footer>
  );
};
