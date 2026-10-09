import { createMemo, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { AnalysisContext } from './AnalysisContext';
import { AnalysisDepthPicker } from './AnalysisDepthPicker';
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
  depths?: AnalysisDepth[];
  /** @default 'idle' */
  status?: 'idle' | 'running';
  /** Progress labels while running, e.g. ['Reading CV', 'Matching requirements', 'Scoring'] */
  steps?: string[];
  /** Index of the current step */
  step?: number;
  error?: JSX.Element;
  /** May return a Promise; the form locks while it is pending. A rejection shows `runErrorText` and is passed to `onError`. */
  onRun?: (payload: AnalysisRunPayload) => void | Promise<void>;
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
  const { running, shownError, run } = createAnalysisRun(p, {
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
    <section class={cx('vui-areq', running() && 'vui-areq--running', p.class)} aria-busy={running() || undefined}>
      <header class="vui-areq__head">
        <IconTile class="vui-areq__spark" icon="sparkles" />
        <div class="vui-areq__ht">
          <h3 class="vui-areq__title">{title()}</h3>
          <Show when={p.description}>
            <p class="vui-areq__desc">{p.description}</p>
          </Show>
        </div>
        <Show when={p.model}>
          <span class="vui-areq__model">{p.model}</span>
        </Show>
      </header>
      <div class="vui-areq__body">
        <Show when={selection.analyses().length > 0}>
          <AnalysisTypePicker
            analyses={selection.analyses()}
            analysis={selection.analysis()}
            disabled={running()}
            onSelect={selection.setAnalysis}
          />
        </Show>
        <AnalysisContext sources={p.sources} selection={selection} disabled={running()} onToggle={toggleSource} />
        <div class="vui-areq__row">
          <label class="vui-areq__set vui-areq__ins">
            <span class="vui-areq__lbl">{translate('velvet.patterns.analysisRequest.instructions')}</span>
            <textarea
              class="vui-areq__ta"
              rows={2}
              value={instructions()}
              placeholder={instructionsPlaceholder()}
              disabled={running()}
              onInput={(e) => setInstructions(e.currentTarget.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  void run();
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
          <div class="vui-areq__err" role="alert">
            <Glyph name="alert-circle" />
            {shownError()}
          </div>
        </Show>
      </div>
      <footer class="vui-areq__foot">
        <span class="vui-areq__note">
          {note() ?? (p.estimate || translate('velvet.patterns.analysisRequest.dataNote'))}
        </span>
        <Show when={running() && p.onCancel}>
          <Button variant="ghost" onClick={() => p.onCancel?.()}>
            {translate('velvet.common.cancel')}
          </Button>
        </Show>
        <Button
          class="vui-areq__run"
          iconLeft="sparkles"
          loading={running()}
          disabled={selection.blocked()}
          onClick={() => void run()}
        >
          {running() ? translate('velvet.patterns.analysisRequest.analysing') : runLabel()}
        </Button>
      </footer>
    </section>
  );
};
