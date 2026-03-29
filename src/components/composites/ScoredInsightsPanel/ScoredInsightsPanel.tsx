import { FiRefreshCw } from 'solid-icons/fi';
import { createSignal } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import AiResultPanel from '~/components/composites/AiResultPanel/AiResultPanel';
import Stack from '~/components/surfaces/Stack/Stack';
import type Props from '~/models/Props';

interface ScoredInsightsResult {
  score?: number;
  summary?: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

interface ScoredInsightsPanelLabels {
  loading: string;
  retry: string;
  run: string;
  score: string;
  strengths: string;
  gaps: string;
  recommendations: string;
}

interface ScoredInsightsPanelProps {
  labels: ScoredInsightsPanelLabels;
  onRun: () => Promise<ScoredInsightsResult>;
  errorText: string;
  resolveErrorText?: (error: unknown) => string;
}

const ScoredInsightsPanel = (props: Props<ScoredInsightsPanelProps>) => {
  const [result, setResult] = createSignal<ScoredInsightsResult | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [isPending, setIsPending] = createSignal(false);

  const handleReset = (): void => {
    setResult(null);
    setError(null);
  };

  const handleRun = async (): Promise<void> => {
    setIsPending(true);
    setResult(null);
    setError(null);

    try {
      setResult(await props.onRun());
    } catch (caught) {
      setError(props.resolveErrorText?.(caught) ?? props.errorText);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AiResultPanel
      class={props.class}
      isPending={isPending()}
      loadingText={props.labels.loading}
      hasError={Boolean(error())}
      errorText={error() ?? props.errorText}
      onRetry={handleReset}
      retryLabel={props.labels.retry}
      hasResult={Boolean(result())}
      score={result()?.score}
      scoreLabel={props.labels.score}
      summary={result()?.summary}
      sections={[
        {
          icon: 'success',
          title: props.labels.strengths,
          items: result()?.strengths ?? [],
        },
        {
          icon: 'danger',
          title: props.labels.gaps,
          items: result()?.gaps ?? [],
        },
        {
          icon: 'primary',
          title: props.labels.recommendations,
          items: result()?.recommendations ?? [],
        },
      ]}
      actions={
        <Button variant="ghost" onClick={handleReset}>
          <FiRefreshCw />
          {props.labels.retry}
        </Button>
      }
      idle={
        <Stack direction="horizontal">
          <Button onClick={() => void handleRun()} label={props.labels.run} />
        </Stack>
      }
    />
  );
};

export type { ScoredInsightsPanelLabels, ScoredInsightsPanelProps, ScoredInsightsResult };
export default ScoredInsightsPanel;
