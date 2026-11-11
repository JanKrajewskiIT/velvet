import { cx } from '../../utils/cx';
import styles from './ChartSwatch.module.css';

export interface ChartSwatchProps {
  color?: string;
  swatch?: 'dot' | 'band';
  round?: boolean;
}

export const ChartSwatch = (props: ChartSwatchProps) => (
  <span
    aria-hidden="true"
    class={cx(styles.swatch, props.swatch === 'band' && styles.band, props.round && styles.round)}
    style={{ background: props.swatch === 'band' ? undefined : props.color }}
  />
);
