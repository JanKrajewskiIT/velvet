import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { type ChartDatum, chartValueText } from '../charts/chartSeries';
import { typographyClass } from '../primitives/typography';
import styles from './RangeBandTooltip.module.css';

export interface RangeBandTooltipProps {
  datum: ChartDatum;
  keys: { lo: string; hi: string; mid: string; value: string };
  labels: { band: string; mid: string; value: string };
  format: (value: number) => string;
  left: number;
  top: number;
}

export const RangeBandTooltip = (props: RangeBandTooltipProps) => {
  const translate = useTranslate();
  const value = (key: string) =>
    chartValueText(props.datum, key, props.format, translate('velvet.charts.chartSeries.noValue'));
  return (
    <div
      class={cx(styles.tip, typographyClass('caption'))}
      style={{ left: `${props.left}px`, top: `${props.top}px` }}
      aria-hidden="true"
    >
      <div class={styles.title}>{props.datum.label}</div>
      <div class={styles.row}>
        <i class={styles.valueSwatch} />
        {props.labels.value}
        <b>{value(props.keys.value)}</b>
      </div>
      <div class={styles.row}>
        <i class={styles.medianSwatch} />
        {props.labels.mid}
        <b>{value(props.keys.mid)}</b>
      </div>
      <div class={styles.row}>
        <span class={styles.bandSwatch} />
        {props.labels.band}
        <b>
          {value(props.keys.lo)} … {value(props.keys.hi)}
        </b>
      </div>
    </div>
  );
};
