import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Checkmark } from '../primitives/Checkmark';
import { IconTile } from '../primitives/IconTile';
import type { AnalysisType } from './analysisSources';

export interface AnalysisTypePickerProps {
  analyses: AnalysisType[];
  analysis: string | undefined;
  disabled: boolean;
  onSelect: (id: string) => void;
}

/** Radio group of the analysis types an AnalysisRequest can run. */
export const AnalysisTypePicker = (props: AnalysisTypePickerProps) => {
  const translate = useTranslate();
  return (
    <fieldset class="vui-areq__set" disabled={props.disabled}>
      <legend class="vui-areq__lbl">{translate('velvet.patterns.analysisRequest.analysis')}</legend>
      <div
        class="vui-areq__types"
        role="radiogroup"
        aria-label={translate('velvet.patterns.analysisRequest.analysisType')}
      >
        <For each={props.analyses}>
          {(type) => (
            <button
              type="button"
              role="radio"
              aria-checked={type.id === props.analysis}
              class="vui-areq__type"
              onClick={() => props.onSelect(type.id)}
            >
              <IconTile size="xs" class="vui-areq__ticon" icon={type.icon ?? 'sparkles'} />
              <span class="vui-areq__tt">
                <span class="vui-areq__tname">{type.label}</span>
                <Show when={type.description}>
                  <span class="vui-areq__tdesc">{type.description}</span>
                </Show>
              </span>
              <Checkmark radio size="sm" checked={type.id === props.analysis} class="vui-areq__radio" />
            </button>
          )}
        </For>
      </div>
    </fieldset>
  );
};
