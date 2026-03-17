import { type JSX, Show } from 'solid-js';

import Text from '~/components/typography/Text/Text';
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
          <Text as="span" variant="labelMd" class={styles.label}>
            {props.label}
          </Text>
        </Show>
        <Show when={props.value !== undefined}>
          <Text as="span" variant="labelMd" tone="muted" class={styles.value}>
            {props.value}
          </Text>
        </Show>
      </div>
    </Show>
    {props.children}
  </div>
);

export default SliderField;
