import { For } from 'solid-js';

import { cx } from '../../utils/cx';
import { typographyClass } from '../primitives/typography';
import type { DateRange } from './calendarTypes';
import styles from './DateRangePresets.module.css';

interface RangePresetChoice {
  label: string;
  range: DateRange;
  disabled: boolean;
}

export interface DateRangePresetsProps {
  choices: readonly RangePresetChoice[];
  active: number;
  label: string;
  onSelect: (range: DateRange) => void;
}

export const DateRangePresets = (props: DateRangePresetsProps) => (
  <div class={styles.rangepopPartPresets} role="group" aria-label={props.label}>
    <For each={props.choices}>
      {(choice, index) => (
        <button
          type="button"
          disabled={choice.disabled}
          aria-pressed={index() === props.active}
          class={cx(
            typographyClass('button-sm'),
            styles.rangepopPartPreset,
            index() === props.active && styles.rangepopPartPresetVariantOn,
          )}
          onClick={() => !choice.disabled && props.onSelect(choice.range)}
        >
          {choice.label}
        </button>
      )}
    </For>
  </div>
);
