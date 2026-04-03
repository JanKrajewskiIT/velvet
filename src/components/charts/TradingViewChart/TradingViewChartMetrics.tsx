import { For } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';

import styles from './TradingViewChartMetrics.module.css';

interface TradingViewChartMetricsProps {
  items: readonly string[];
}

const TradingViewChartMetrics = (props: Props<TradingViewChartMetricsProps>) => {
  return (
    <div class={styles.ohlcPanel}>
      <For each={props.items}>
        {(item) => (
          <Text as="span" variant="caption" tone="secondary" class={styles.ohlcItem}>
            {item}
          </Text>
        )}
      </For>
    </div>
  );
};

export default TradingViewChartMetrics;
