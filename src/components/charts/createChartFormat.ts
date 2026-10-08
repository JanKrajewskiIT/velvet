import { useI18n } from '@jankrajewskiit/i18n';

import { compact } from './chartScale';

/** Value formatter for axes and tooltips: the consumer's `format`, else compact numbers in the active locale. */
export const createChartFormat = (
  custom: () => ((value: number) => string) | undefined,
): ((value: number) => string) => {
  const i18n = useI18n();
  return (value) => (custom() ?? ((n: number) => compact(n, i18n.locale())))(value);
};
