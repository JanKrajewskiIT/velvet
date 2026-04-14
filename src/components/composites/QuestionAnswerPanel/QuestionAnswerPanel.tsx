import { FaSolidWandMagicSparkles } from 'solid-icons/fa';
import { Show } from 'solid-js';

import AffixButton from '~/components/buttons/AffixButton/AffixButton';
import MarkdownRenderer from '~/components/composites/MarkdownRenderer/MarkdownRenderer';
import ErrorMessage from '~/components/feedback/ErrorMessage/ErrorMessage';
import Spinner from '~/components/loaders/Spinner/Spinner';
import Icon from '~/components/media/Icon/Icon';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './QuestionAnswerPanel.module.css';

interface QuestionAnswerPanelProps {
  content?: string | null;
  loading?: boolean;
  errorMessage?: string;
  onAsk?: () => void;
}

const QuestionAnswerPanel = (props: Props<QuestionAnswerPanelProps>) => {
  const { ts } = useI18n();
  const hasContent = () => Boolean(props.content?.trim());

  return (
    <div class={classNames(styles.panel, props.class)}>
      <Show when={props.loading}>
        <div class={styles.loading}>
          <Spinner size="md" />
          <Text as="span" variant="bodySm" tone="muted">
            {ts('common.loading')}
          </Text>
        </div>
      </Show>

      <Show when={!props.loading && props.errorMessage}>
        <ErrorMessage message={props.errorMessage ?? ''} />
      </Show>

      <Show when={!props.loading && !props.errorMessage && hasContent()}>
        <MarkdownRenderer content={props.content ?? ''} />
      </Show>

      <Show when={!props.loading && !props.errorMessage && !hasContent() && props.onAsk}>
        <AffixButton
          variant="ghost"
          class={styles.askButton}
          onClick={() => props.onAsk?.()}
          text={ts('questionAnswer.ask')}
          prefix={<Icon icon={FaSolidWandMagicSparkles} size="sm" />}
        />
      </Show>
    </div>
  );
};

export type { QuestionAnswerPanelProps };
export default QuestionAnswerPanel;
