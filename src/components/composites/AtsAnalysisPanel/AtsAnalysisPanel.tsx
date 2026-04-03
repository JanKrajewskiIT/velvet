import { FiRefreshCw } from 'solid-icons/fi';
import { createMemo, For, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import ScoreRing from '~/components/charts/ScoreRing/ScoreRing';
import Alert from '~/components/feedback/Alert/Alert';
import Progress from '~/components/feedback/Progress/Progress';
import Spinner from '~/components/feedback/Spinner/Spinner';
import ActionRow from '~/components/forms/ActionRow/ActionRow';
import FormField from '~/components/forms/FormField/FormField';
import TextArea from '~/components/inputs/TextArea/TextArea';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './AtsAnalysisPanel.module.css';

type AtsRecommendationSeverity = 'critical' | 'warning' | 'suggestion';

interface AtsAnalysisCategory {
  label: string;
  score: number;
}

interface AtsAnalysisRecommendation {
  label: string;
  message: string;
  severity: AtsRecommendationSeverity;
}

interface AtsAnalysisResult {
  overallScore: number;
  categories: readonly AtsAnalysisCategory[];
  recommendations: readonly AtsAnalysisRecommendation[];
}

interface AtsAnalysisPanelProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  onReset: () => void;
  result?: AtsAnalysisResult | null;
  loading?: boolean;
  errorMessage?: string;
  inputLabel?: string;
  inputHint?: string;
}

const toProgressVariant = (score: number): 'error' | 'warning' | 'success' | 'primary' => {
  if (score >= 86) return 'success';
  if (score >= 71) return 'primary';
  if (score >= 51) return 'warning';
  return 'error';
};

const toAlertVariant = (severity: AtsRecommendationSeverity): 'danger' | 'warning' | 'info' => {
  if (severity === 'critical') return 'danger';
  if (severity === 'warning') return 'warning';
  return 'info';
};

const AtsAnalysisPanel = (props: Props<AtsAnalysisPanelProps>) => {
  const { ts } = useI18n();
  const categories = createMemo(() => props.result?.categories ?? []);
  const recommendations = createMemo(() => props.result?.recommendations ?? []);

  return (
    <div class={classNames(styles.panel, props.class)}>
      <Show when={props.loading}>
        <div class={styles.loading}>
          <Spinner size="md" />
          <Text as="p">{ts('common.loading')}</Text>
        </div>
      </Show>

      <Show when={!props.loading && props.errorMessage && !props.result}>
        <div class={styles.error}>
          <Alert variant="danger" label={ts('error.title')} message={props.errorMessage ?? ''} />
          <Button variant="ghost" label={ts('error.retry')} onClick={props.onReset} />
        </div>
      </Show>

      <Show when={!props.loading && props.result}>
        <div class={styles.result}>
          <div class={styles.scoreBlock}>
            <ScoreRing score={props.result?.overallScore ?? 0} />
            <Text as="p">{ts('analysis.score')}</Text>
          </div>

          <Show when={categories().length > 0}>
            <div class={styles.categories}>
              <Heading level={4} variant="titleMd">
                {ts('analysis.categories')}
              </Heading>
              <For each={categories()}>
                {(category) => (
                  <Progress
                    label={category.label}
                    value={category.score}
                    showValue={true}
                    variant={toProgressVariant(category.score)}
                  />
                )}
              </For>
            </div>
          </Show>

          <Show when={recommendations().length > 0}>
            <div class={styles.recommendations}>
              <Heading level={4} variant="titleMd">
                {ts('analysis.recommendations')}
              </Heading>
              <For each={recommendations()}>
                {(recommendation) => (
                  <Alert
                    variant={toAlertVariant(recommendation.severity)}
                    label={recommendation.label}
                    message={recommendation.message}
                  />
                )}
              </For>
            </div>
          </Show>

          <ActionRow align="end">
            <Button variant="ghost" onClick={props.onReset}>
              <FiRefreshCw />
              {ts('error.retry')}
            </Button>
          </ActionRow>
        </div>
      </Show>

      <Show when={!props.loading && !props.result && !props.errorMessage}>
        <div class={styles.empty}>
          <Show when={props.inputLabel}>
            {(label) => (
              <FormField label={label()}>
                <TextArea
                  value={props.value}
                  placeholder={ts('analysis.inputPlaceholder')}
                  onInput={(event) => props.onValueChange(event.currentTarget.value)}
                />
              </FormField>
            )}
          </Show>
          <Show when={!props.inputLabel}>
            <TextArea
              value={props.value}
              placeholder={ts('analysis.inputPlaceholder')}
              onInput={(event) => props.onValueChange(event.currentTarget.value)}
            />
          </Show>
          <Show when={props.inputHint}>
            {(hint) => (
              <Text as="p" tone="muted" class={styles.inputHint}>
                {hint()}
              </Text>
            )}
          </Show>
          <Button label={ts('analysis.analyze')} onClick={() => void props.onSubmit()} />
        </div>
      </Show>
    </div>
  );
};

export type {
  AtsAnalysisCategory,
  AtsAnalysisPanelProps,
  AtsAnalysisRecommendation,
  AtsAnalysisResult,
  AtsRecommendationSeverity,
};
export default AtsAnalysisPanel;
