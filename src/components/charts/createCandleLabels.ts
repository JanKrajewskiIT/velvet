import { createMemo } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import type { CandleLabels } from './candleRows';

export const createCandleLabels = () => {
  const translate = useTranslate();
  return createMemo<CandleLabels>(() => ({
    open: translate('velvet.charts.candleChart.open'),
    high: translate('velvet.charts.candleChart.high'),
    low: translate('velvet.charts.candleChart.low'),
    close: translate('velvet.charts.candleChart.close'),
    missing: translate('velvet.charts.chartSeries.noValue'),
  }));
};
