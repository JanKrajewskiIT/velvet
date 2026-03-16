import { type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';

import styles from './LabelText.module.css';

interface LabelTextOwnProps {
  label?: JSX.Element;
  description?: JSX.Element;
}

const LabelText = (props: Props<LabelTextOwnProps>) => (
  <Show when={props.label || props.description}>
    <span class={styles.text}>
      <Show when={props.label}>
        <span class={styles.label}>{props.label}</span>
      </Show>
      <Show when={props.description}>
        <span class={styles.description}>{props.description}</span>
      </Show>
    </span>
  </Show>
);

export default LabelText;
