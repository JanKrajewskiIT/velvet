import { For } from 'solid-js';

import { cx } from '../../utils/cx';
import type { DateRange } from './calendarTypes';

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
  <div class="vui-rangepop__presets" role="group" aria-label={props.label}>
    <For each={props.choices}>
      {(choice, index) => (
        <button
          type="button"
          disabled={choice.disabled}
          aria-pressed={index() === props.active}
          class={cx('vui-rangepop__preset', index() === props.active && 'vui-rangepop__preset--on')}
          onClick={() => !choice.disabled && props.onSelect(choice.range)}
        >
          {choice.label}
        </button>
      )}
    </For>
  </div>
);
