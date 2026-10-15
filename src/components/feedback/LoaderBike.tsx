import styles from './LoaderBike.module.css';
import { LoaderWheel } from './LoaderWheel';

/** Geometry and animation parts of the bike loader. */
export const LoaderBike = () => (
  <svg class={styles.root} viewBox="0 0 48 30" width="48" height="30" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1">
      <LoaderWheel x={9.5} />
      <g transform="translate(24,19)">
        <g
          data-vui-bike-part
          class={styles.bPedspin}
          stroke-dasharray="25.133 25.133"
          stroke-dashoffset="-21.991"
          transform="rotate(67.5,0,0)"
        >
          <circle data-vui-bike-part class={styles.bPed} r="4" />
          <circle data-vui-bike-part class={styles.bPed} r="4" transform="rotate(180,0,0)" />
        </g>
      </g>
      <LoaderWheel x={38.5} />
      <polyline data-vui-bike-part class={styles.bSeat} points="14 3,18 3" stroke-dasharray="5 5" />
      <polyline
        data-vui-bike-part
        class={styles.bBody}
        points="16 3,24 19,9.5 19,18 8,34 7,24 19"
        stroke-dasharray="79 79"
      />
      <path data-vui-bike-part class={styles.bBars} d="m30,2h6s1,0,1,1-1,1-1,1" stroke-dasharray="10 10" />
      <polyline data-vui-bike-part class={styles.bFront} points="32.5 2,38.5 19" stroke-dasharray="19 19" />
    </g>
  </svg>
);
