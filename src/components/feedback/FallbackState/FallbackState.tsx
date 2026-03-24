import { type JSX, Show } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FallbackState.module.css';

interface FallbackStateOwnProps {
  title: string;
  description: string;
  icon?: JSX.Element;
  action?: JSX.Element;
  iconClass?: string;
}

const FallbackState = (props: Props<FallbackStateOwnProps>) => {
  return (
    <div class={classNames(styles.container, props.class)}>
      <Show when={props.icon}>
        <div class={classNames(styles.icon, props.iconClass)}>{props.icon}</div>
      </Show>
      <Heading as="h1" level={1}>
        {props.title}
      </Heading>
      <Text tone="muted">{props.description}</Text>
      <Show when={props.action}>
        <div class={styles.action}>{props.action}</div>
      </Show>
    </div>
  );
};

export default FallbackState;
