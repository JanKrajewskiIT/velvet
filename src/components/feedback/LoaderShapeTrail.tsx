import { Match, Switch } from 'solid-js';

import { cx } from '../../utils/cx';
import styles from './LoaderShapeTrail.module.css';
import type { LoaderShape } from './loaderTypes';

export interface LoaderShapeTrailProps {
  shape: LoaderShape;
}

export const LoaderShapeTrail = (props: LoaderShapeTrailProps) => (
  <svg class={styles.root} viewBox={props.shape === 'triangle' ? '0 0 86 80' : '0 0 80 80'} aria-hidden="true">
    <Switch fallback={<circle class={cx(styles.shape, styles.circle)} cx="40" cy="40" r="32" />}>
      <Match when={props.shape === 'triangle'}>
        <polygon class={cx(styles.shape, styles.triangle)} points="43 8 79 72 7 72" />
      </Match>
      <Match when={props.shape === 'square'}>
        <rect class={cx(styles.shape, styles.square)} x="8" y="8" width="64" height="64" />
      </Match>
    </Switch>
  </svg>
);
