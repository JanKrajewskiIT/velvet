import type { I18nKey } from '@jankrajewskiit/i18n';

import { addDays, startOfDay } from '../../utils/date';
import type { DateRange } from './Calendar';
import { startOfMonth } from './calendarGrid';

interface RangePresetBase {
  range: () => DateRange;
}

/** `label` is shown as written; `labelKey` is a library message translated when rendered. */
export type RangePreset = (RangePresetBase & { label: string }) | (RangePresetBase & { labelKey: I18nKey });

export const presetLabel = (preset: RangePreset, translate: (key: I18nKey) => string): string =>
  'labelKey' in preset ? translate(preset.labelKey) : preset.label;

const today = (): Date => startOfDay(new Date());

const upToToday = (daysBack: number): DateRange => {
  const end = today();
  return { start: addDays(end, -daysBack), end };
};

/** Today, Last 7 / 30 days, This / Last month, This year. */
export const DEFAULT_RANGE_PRESETS: RangePreset[] = [
  { labelKey: 'velvet.common.today', range: () => upToToday(0) },
  { labelKey: 'velvet.forms.rangePresets.last7Days', range: () => upToToday(6) },
  { labelKey: 'velvet.forms.rangePresets.last30Days', range: () => upToToday(29) },
  { labelKey: 'velvet.forms.rangePresets.thisMonth', range: () => ({ start: startOfMonth(today()), end: today() }) },
  {
    labelKey: 'velvet.forms.rangePresets.lastMonth',
    range: () => {
      const now = today();
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    },
  },
  {
    labelKey: 'velvet.forms.rangePresets.thisYear',
    range: () => ({ start: new Date(today().getFullYear(), 0, 1), end: today() }),
  },
];
