import styles from './LoaderWheel.module.css';

export interface LoaderWheelProps {
  x: number;
}

export const LoaderWheel = (props: LoaderWheelProps) => (
  <g transform={`translate(${props.x},19)`}>
    <circle data-vui-bike-part class={styles.bTire} r="9" stroke-dasharray="56.549 56.549" />
    <g data-vui-bike-part class={styles.bSpkspin} stroke-dasharray="31.416 31.416" stroke-dashoffset="-23.562">
      <circle data-vui-bike-part class={styles.bSpk} r="5" />
      <circle data-vui-bike-part class={styles.bSpk} r="5" transform="rotate(180,0,0)" />
    </g>
  </g>
);
