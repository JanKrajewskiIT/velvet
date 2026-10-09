import { For } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { AnalysisSourceRow } from './AnalysisSourceRow';
import type { AnalysisSource } from './analysisSources';
import type { AnalysisSelection } from './createAnalysisSelection';

export interface AnalysisContextProps {
  sources: AnalysisSource[];
  selection: AnalysisSelection;
  disabled: boolean;
  onToggle: (source: AnalysisSource) => void;
}

/** Fieldset listing the context sources with how many are included in the request. */
export const AnalysisContext = (props: AnalysisContextProps) => {
  const translate = useTranslate();
  return (
    <fieldset class="vui-areq__set" disabled={props.disabled}>
      <legend class="vui-areq__lbl">
        {translate('velvet.patterns.analysisRequest.context')}{' '}
        <span class="vui-areq__lblc">
          {translate('velvet.patterns.analysisRequest.contextCount', {
            included: props.selection.included().length,
            total: props.sources.length,
          })}
        </span>
      </legend>
      <ul class="vui-areq__sources">
        <For each={props.sources}>
          {(source) => (
            <AnalysisSourceRow
              source={source}
              included={props.selection.isIncluded(source.id)}
              required={props.selection.required().includes(source.id)}
              onToggle={props.onToggle}
            />
          )}
        </For>
      </ul>
    </fieldset>
  );
};
