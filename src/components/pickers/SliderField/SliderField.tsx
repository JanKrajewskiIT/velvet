import { type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './SliderField.module.css';

interface SliderFieldOwnProps {
  label?: string;
  value?: JSX.Element;
  children: JSX.Element;
}

const SliderField = (props: Props<SliderFieldOwnProps>) => (
  <div class={classNames(styles.wrapper, props.class)}>
    <Show when={props.label || props.value !== undefined}>
      <div class={styles.header}>
        <Show when={props.label}>
          <label class={styles.label}>{props.label}</label>
        </Show>
        <Show when={props.value !== undefined}>
          <span class={styles.value}>{props.value}</span>
        </Show>
      </div>
    </Show>
    {props.children}
  </div>
);

export default SliderField;
