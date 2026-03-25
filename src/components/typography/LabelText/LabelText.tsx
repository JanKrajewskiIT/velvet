import { Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../Text/Text';
import styles from './LabelText.module.css';

interface LabelTextOwnProps {
  label?: string;
  description?: string;
}

const LabelText = (props: Props<LabelTextOwnProps>) => (
  <Show when={props.label || props.description}>
    <span id={props.id} class={classNames(styles.text, props.class)}>
      <Show when={props.label}>
        <Text as="span" variant="labelLg">
          {props.label}
        </Text>
      </Show>
      <Show when={props.description}>
        <Text as="span" variant="caption" tone="muted">
          {props.description}
        </Text>
      </Show>
    </span>
  </Show>
);

export default LabelText;
