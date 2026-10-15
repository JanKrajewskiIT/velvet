import { createUniqueId, For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './AnalysisDepthPicker.module.css';
import type { AnalysisDepth } from './analysisSources';

export interface AnalysisDepthPickerProps {
  depths: readonly AnalysisDepth[];
  depth: string;
  disabled: boolean;
  onSelect: (id: string) => void;
}

/** Radio group for how thorough the analysis should be. */
export const AnalysisDepthPicker = (props: AnalysisDepthPickerProps) => {
  const translate = useTranslate();
  const labelId = createUniqueId();
  return (
    <div class={styles.areqPartSet}>
      <Text as="span" variant="section" tone="tertiary" class={styles.areqPartLbl} id={labelId}>
        {translate('velvet.patterns.analysisRequest.depth')}
      </Text>
      <div class={styles.areqPartDepth} role="radiogroup" aria-labelledby={labelId}>
        <For each={props.depths}>
          {(option) => (
            <button
              type="button"
              role="radio"
              aria-checked={option.id === props.depth}
              disabled={props.disabled}
              class={cx(styles.areqPartDbtn, typographyClass('label'))}
              onClick={() => props.onSelect(option.id)}
            >
              <Text as="span" variant="label" tone="inherit">
                {option.label}
              </Text>
              <Show when={option.hint}>
                <Text as="small" variant="micro" tone="inherit">
                  {option.hint}
                </Text>
              </Show>
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
