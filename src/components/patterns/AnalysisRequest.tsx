import { createMemo, createSignal, createUniqueId, For, type JSX, mergeProps, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Checkmark } from '../primitives/Checkmark';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { AnalysisSourceRow } from './AnalysisSourceRow';
import {
  type AnalysisDepth,
  type AnalysisRunPayload,
  type AnalysisSource,
  type AnalysisType,
  localizeAnalysisDepths,
  sourceStatus,
} from './analysisSources';
import { AnalysisSteps } from './AnalysisSteps';

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
  const analyses = () => p.analyses ?? [];
  const [selected, setSelected] = createControllable<string[]>({
    value: () => p.selected,
    defaultValue: untrack(
      () =>
        p.defaultSelected ??
        p.sources.filter((source) => sourceStatus(source) !== 'missing').map((source) => source.id),
    ),
    onChange: (ids) => p.onSelectedChange?.(ids),
  });
  const [analysis, setAnalysis] = createControllable<string | undefined>({
    value: () => p.analysis,
    defaultValue: p.defaultAnalysis ?? analyses()[0]?.id,
    onChange: (id) => id !== undefined && p.onAnalysisChange?.(id),
  });
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
  const depthLabelId = createUniqueId();
  const [busy, setBusy] = createSignal(false);
  const [failed, setFailed] = createSignal(false);

  const running = () => p.status === 'running' || busy();
  const required = () => analyses().find((a) => a.id === analysis())?.requires ?? [];
  const isIncluded = (id: string) => {
    const source = p.sources.find((s) => s.id === id);
    return !!source && sourceStatus(source) === 'ready' && selected().includes(id);
  };
  const included = createMemo(() => p.sources.filter((source) => isIncluded(source.id)));
  const missing = createMemo(() =>
    required()
      .filter((id) => !isIncluded(id))
      .map((id) => p.sources.find((s) => s.id === id)?.label ?? id),
  );
  const blocked = () => missing().length > 0 || included().length === 0;
  const note = () =>
    included().length === 0
      ? translate('velvet.patterns.analysisRequest.includeOne')
      : missing().length > 0
        ? translate('velvet.patterns.analysisRequest.needs', { sources: missing().join(', ') })
        : undefined;
  const shownError = () => p.error || (failed() ? runErrorText() : undefined);

  const toggle = (source: AnalysisSource) => {
    if (sourceStatus(source) !== 'ready' || running()) return;
    setSelected(
      selected().includes(source.id) ? selected().filter((id) => id !== source.id) : [...selected(), source.id],
    );
  };

  const run = async () => {
    if (blocked() || running() || !p.onRun) return;
    setFailed(false);
    setBusy(true);
    try {
      await p.onRun({
        analysis: analysis() ?? '',
        sources: included().map((source) => source.id),
        instructions: instructions().trim(),
        depth: depth(),
      });
    } catch (error) {
      setFailed(true);
      p.onError?.(error);
    } finally {
      setBusy(false);
    }
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
        <Show when={analyses().length > 0}>
          <fieldset class="vui-areq__set" disabled={running()}>
            <legend class="vui-areq__lbl">{translate('velvet.patterns.analysisRequest.analysis')}</legend>
            <div
              class="vui-areq__types"
              role="radiogroup"
              aria-label={translate('velvet.patterns.analysisRequest.analysisType')}
            >
              <For each={analyses()}>
                {(type) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={type.id === analysis()}
                    class="vui-areq__type"
                    onClick={() => setAnalysis(type.id)}
                  >
                    <IconTile size="xs" class="vui-areq__ticon" icon={type.icon ?? 'sparkles'} />
                    <span class="vui-areq__tt">
                      <span class="vui-areq__tname">{type.label}</span>
                      <Show when={type.description}>
                        <span class="vui-areq__tdesc">{type.description}</span>
                      </Show>
                    </span>
                    <Checkmark radio size="sm" checked={type.id === analysis()} class="vui-areq__radio" />
                  </button>
                )}
              </For>
            </div>
          </fieldset>
        </Show>
        <fieldset class="vui-areq__set" disabled={running()}>
          <legend class="vui-areq__lbl">
            {translate('velvet.patterns.analysisRequest.context')}{' '}
            <span class="vui-areq__lblc">
              {translate('velvet.patterns.analysisRequest.contextCount', {
                included: included().length,
                total: p.sources.length,
              })}
            </span>
          </legend>
          <ul class="vui-areq__sources">
            <For each={p.sources}>
              {(source) => (
                <AnalysisSourceRow
                  source={source}
                  included={isIncluded(source.id)}
                  required={required().includes(source.id)}
                  onToggle={toggle}
                />
              )}
            </For>
          </ul>
        </fieldset>
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
            <div class="vui-areq__set">
              <span class="vui-areq__lbl" id={depthLabelId}>
                {translate('velvet.patterns.analysisRequest.depth')}
              </span>
              <div class="vui-areq__depth" role="radiogroup" aria-labelledby={depthLabelId}>
                <For each={depths()}>
                  {(option) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={option.id === depth()}
                      disabled={running()}
                      class="vui-areq__dbtn"
                      onClick={() => setDepth(option.id)}
                    >
                      <span>{option.label}</span>
                      <Show when={option.hint}>
                        <small>{option.hint}</small>
                      </Show>
                    </button>
                  )}
                </For>
              </div>
            </div>
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
          disabled={blocked()}
          onClick={() => void run()}
        >
          {running() ? translate('velvet.patterns.analysisRequest.analysing') : runLabel()}
        </Button>
      </footer>
    </section>
  );
};
