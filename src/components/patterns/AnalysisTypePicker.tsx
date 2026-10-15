import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Checkmark } from '../primitives/Checkmark';
import { IconTile } from '../primitives/IconTile';
import { Text } from '../primitives/Text';
import type { AnalysisType } from './analysisSources';
import styles from './AnalysisTypePicker.module.css';

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
    <fieldset class={styles.areqPartSet} disabled={props.disabled}>
      <Text as="legend" variant="section" tone="tertiary" class={styles.areqPartLbl}>
        {translate('velvet.patterns.analysisRequest.analysis')}
      </Text>
      <div
        class={styles.areqPartTypes}
        role="radiogroup"
        aria-label={translate('velvet.patterns.analysisRequest.analysisType')}
      >
        <For each={props.analyses}>
          {(type) => (
            <button
              type="button"
              role="radio"
              aria-checked={type.id === props.analysis}
              class={styles.areqPartType}
              onClick={() => props.onSelect(type.id)}
            >
              <IconTile size="xs" class={styles.areqPartTicon} icon={type.icon ?? 'sparkles'} />
              <span class={styles.areqPartTt}>
                <Text as="span" variant="label" tone="inherit" class="vui-areq__tname">
                  {type.label}
                </Text>
                <Show when={type.description}>
                  <Text as="span" variant="caption" tone="inherit" class={styles.areqPartTdesc}>
                    {type.description}
                  </Text>
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
