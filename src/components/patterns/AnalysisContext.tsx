import { For } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Text } from '../primitives/Text';
import styles from './AnalysisContext.module.css';
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
    <fieldset class={styles.areqPartSet} disabled={props.disabled}>
      <Text as="legend" variant="section" tone="tertiary" class={styles.areqPartLbl}>
        {translate('velvet.patterns.analysisRequest.context')}{' '}
        <Text as="span" variant="caption" tone="inherit" class={styles.areqPartLblc}>
          {translate('velvet.patterns.analysisRequest.contextCount', {
            included: props.selection.included().length,
            total: props.sources.length,
          })}
        </Text>
      </Text>
      <ul class={styles.areqPartSources}>
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
