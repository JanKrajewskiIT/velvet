import { createMemo, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import { Glyph } from '../primitives/Glyph';
import { Heading } from '../primitives/Heading';
import { IconTile } from '../primitives/IconTile';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { AnalysisContext } from './AnalysisContext';
import { AnalysisDepthPicker } from './AnalysisDepthPicker';
import styles from './AnalysisRequest.module.css';
import {
  type AnalysisDepth,
  type AnalysisRunPayload,
  type AnalysisSource,
  type AnalysisType,
  localizeAnalysisDepths,
} from './analysisSources';
import { AnalysisSteps } from './AnalysisSteps';
import { AnalysisTypePicker } from './AnalysisTypePicker';
import { createAnalysisRun } from './createAnalysisRun';
import { createAnalysisSelection } from './createAnalysisSelection';

export interface AnalysisRequestProps {
  /** @default localized "Request AI analysis" */
  title?: JSX.Element;
  description?: JSX.Element;
  sources: AnalysisSource[];
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  analyses?: AnalysisType[];
  analysis?: string;
  defaultAnalysis?: string;
  onAnalysisChange?: (id: string) => void;
  instructions?: string;
  /** @default '' */
  defaultInstructions?: string;
  onInstructionsChange?: (value: string) => void;
  /** @default localized "Focus on… (optional) — e.g. leadership experience, notice period, salary fit" */
  instructionsPlaceholder?: string;
  depth?: string;
  /** @default 'standard' */
  defaultDepth?: string;
  onDepthChange?: (id: string) => void;
  /** @default localized quick · standard · deep */
  depths?: readonly AnalysisDepth[];
  /** @default 'idle' */
  status?: 'idle' | 'running';
  /** Progress labels while running, e.g. ['Reading CV', 'Matching requirements', 'Scoring'] */
  steps?: string[];
  /** Index of the current step */
  step?: number;
  error?: JSX.Element;
  /** May return a Promise; the form locks while it is pending. A rejection shows `runErrorText` and is passed to `onError`. */
  onRun?: (payload: AnalysisRunPayload, signal: AbortSignal) => void | Promise<void>;
  /** Receives the error `onRun` rejected with. */
  onError?: (error: unknown) => void;
  onCancel?: () => void;
  /** @default localized "Run analysis" */
  runLabel?: string;
  /** Shown when `onRun` rejects. @default localized "The analysis couldn’t start. Try again." */
  runErrorText?: string;
  /** Provenance chip, e.g. "Claude · EU" */
  model?: string;
  /** Footer note, e.g. "≈ 4k tokens · 1 credit" */
  estimate?: JSX.Element;
  class?: string;
}

/** Compose and send an AI analysis request from several pieces of context; Run stays blocked with a reason until requirements are met. */
export const AnalysisRequest = (props: AnalysisRequestProps) => {
  const p = mergeProps(
    {
      defaultInstructions: '',
      defaultDepth: 'standard',
      status: 'idle',
      steps: [] as string[],
      step: 0,
    } satisfies Partial<AnalysisRequestProps>,
    props,
  );
  const translate = useTranslate();
  const title = () => p.title ?? translate('velvet.patterns.analysisRequest.title');
  const instructionsPlaceholder = () =>
    p.instructionsPlaceholder ?? translate('velvet.patterns.analysisRequest.instructionsPlaceholder');
  const depths = createMemo(() => p.depths ?? localizeAnalysisDepths(translate));
  const runLabel = () => p.runLabel ?? translate('velvet.patterns.analysisRequest.runLabel');
  const runErrorText = () => p.runErrorText ?? translate('velvet.patterns.analysisRequest.runErrorText');
  const selection = createAnalysisSelection(p);
  const [instructions, setInstructions] = createControllable<string>({
    value: () => p.instructions,
    defaultValue: p.defaultInstructions,
    onChange: (value) => p.onInstructionsChange?.(value),
  });
  const [depth, setDepth] = createControllable<string>({
    value: () => p.depth,
    defaultValue: p.defaultDepth,
    onChange: (value) => p.onDepthChange?.(value),
  });
  const { running, shownError, run, cancel } = createAnalysisRun(p, {
    blocked: selection.blocked,
    payload: () => ({
      analysis: selection.analysis() ?? '',
      sources: selection.included().map((source) => source.id),
      instructions: instructions().trim(),
      depth: depth(),
    }),
    runErrorText,
  });
  const note = () =>
    selection.included().length === 0
      ? translate('velvet.patterns.analysisRequest.includeOne')
      : selection.missing().length > 0
        ? translate('velvet.patterns.analysisRequest.needs', { sources: selection.missing().join(', ') })
        : undefined;
  const toggleSource = (source: AnalysisSource) => {
    if (!running()) selection.toggle(source);
  };

  return (
    <section
      class={cx(typographyClass('body'), styles.areq, running() && 'vui-areq--running', p.class)}
      aria-busy={running() || undefined}
    >
      <header class={styles.areqPartHead}>
        <IconTile class={styles.areqPartSpark} icon="sparkles" />
        <div class={styles.areqPartHt}>
          <Heading level={3} variant="title" class={styles.areqPartTitle}>
            {title()}
          </Heading>
          <Show when={p.description}>
            <Text as="p" variant="body-sm" tone="secondary" class={styles.areqPartDesc}>
              {p.description}
            </Text>
          </Show>
        </div>
        <Show when={p.model}>
          <Text as="span" variant="kbd" tone="tertiary" class={styles.areqPartModel}>
            {p.model}
          </Text>
        </Show>
      </header>
      <div class={styles.areqPartBody}>
        <Show when={selection.analyses().length > 0}>
          <AnalysisTypePicker
            analyses={selection.analyses()}
            analysis={selection.analysis()}
            disabled={running()}
            onSelect={selection.setAnalysis}
          />
        </Show>
        <AnalysisContext sources={p.sources} selection={selection} disabled={running()} onToggle={toggleSource} />
        <div class={styles.areqPartRow}>
          <label class={cx(styles.areqPartSet, 'vui-areq__ins')}>
            <Text as="span" variant="section" tone="tertiary" class={styles.areqPartLbl}>
              {translate('velvet.patterns.analysisRequest.instructions')}
            </Text>
            <textarea
              class={cx(styles.areqPartTa, typographyClass('body-sm'))}
              rows={2}
              value={instructions()}
              placeholder={instructionsPlaceholder()}
              disabled={running()}
              onInput={(e) => setInstructions(e.currentTarget.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  void run().catch(reportAsyncError);
                }
              }}
            />
          </label>
          <Show when={depths().length > 0}>
            <AnalysisDepthPicker depths={depths()} depth={depth()} disabled={running()} onSelect={setDepth} />
          </Show>
        </div>
        <Show when={running() && p.steps.length > 0}>
          <AnalysisSteps steps={p.steps} step={p.step} />
        </Show>
        <Show when={shownError() && !running()}>
          <Text as="div" variant="body-sm" tone="danger" class={styles.areqPartErr} role="alert">
            <Glyph name="alert-circle" />
            {shownError()}
          </Text>
        </Show>
      </div>
      <footer class={styles.areqPartFoot}>
        <Text as="span" variant="caption" tone="tertiary" class={styles.areqPartNote}>
          {note() ?? (p.estimate || translate('velvet.patterns.analysisRequest.dataNote'))}
        </Text>
        <Show when={running() && p.onCancel}>
          <Button
            variant="ghost"
            onClick={() => {
              cancel();
              p.onCancel?.();
            }}
          >
            {translate('velvet.common.cancel')}
          </Button>
        </Show>
        <Button
          class={styles.areqPartRun}
          iconLeft="sparkles"
          loading={running()}
          disabled={selection.blocked()}
          onClick={() => void run().catch(reportAsyncError)}
        >
          {running() ? translate('velvet.patterns.analysisRequest.analysing') : runLabel()}
        </Button>
      </footer>
    </section>
  );
};
