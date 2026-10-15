import { cx } from '../../utils/cx';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './HeatmapTooltip.module.css';

export interface HeatmapTooltipProps {
  title: string;
  label: string;
  value: string;
  color: string | undefined;
  left: number;
  top: number;
}

export const HeatmapTooltip = (props: HeatmapTooltipProps) => (
  <div
    class={cx(styles.chartPartTip, typographyClass('caption'))}
    style={{ left: `${props.left}px`, top: `${props.top}px` }}
    aria-hidden="true"
  >
    <Text as="div" variant="label-sm" tone="inherit" class={styles.chartPartTipT}>
      {props.title}
    </Text>
    <Text as="div" variant="caption" tone="inherit" class={styles.chartPartTipR}>
      <i style={{ background: props.color }} />
      {props.label}
      <Text as="b" variant="label-sm" tone="inherit">
        {props.value}
      </Text>
    </Text>
  </div>
);
