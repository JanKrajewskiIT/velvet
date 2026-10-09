import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Button } from '../actions/Button';
import { CopyButton } from '../actions/CopyButton';
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
    <footer class="vui-ai__foot">
      <Show
        when={!props.streaming}
        fallback={
          <span class="vui-ai__meta" style={{ 'margin-left': 0 }}>
            {translate('velvet.patterns.aiResultPanel.writing')}
          </span>
        }
      >
        <CopyButton value={props.plain} variant="ghost" size="sm" onCopy={props.onCopy} />
        <Show when={props.onRegenerate}>
          <Button variant="ghost" size="sm" iconLeft="refresh" onClick={() => props.onRegenerate?.()}>
            {translate('velvet.patterns.aiResultPanel.regenerate')}
          </Button>
        </Show>
        <Show when={props.feedbackEnabled}>
          <span class="vui-ai__fb" role="group" aria-label={translate('velvet.patterns.aiResultPanel.feedbackLabel')}>
            <span>{translate('velvet.patterns.aiResultPanel.helpful')}</span>
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
          </span>
        </Show>
        <Show when={meta()}>
          <span class="vui-ai__meta">{meta()}</span>
        </Show>
      </Show>
    </footer>
  );
};
