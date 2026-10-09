import { createUniqueId, For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { AnalysisDepth } from './analysisSources';

export interface AnalysisDepthPickerProps {
  depths: AnalysisDepth[];
  depth: string;
  disabled: boolean;
  onSelect: (id: string) => void;
}

/** Radio group for how thorough the analysis should be. */
export const AnalysisDepthPicker = (props: AnalysisDepthPickerProps) => {
  const translate = useTranslate();
  const labelId = createUniqueId();
  return (
    <div class="vui-areq__set">
      <span class="vui-areq__lbl" id={labelId}>
        {translate('velvet.patterns.analysisRequest.depth')}
      </span>
      <div class="vui-areq__depth" role="radiogroup" aria-labelledby={labelId}>
        <For each={props.depths}>
          {(option) => (
            <button
              type="button"
              role="radio"
              aria-checked={option.id === props.depth}
              disabled={props.disabled}
              class="vui-areq__dbtn"
              onClick={() => props.onSelect(option.id)}
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
  );
};
