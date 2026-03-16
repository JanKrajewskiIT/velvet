import { type JSX, Show } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Heading from '../../typography/Heading/Heading';
import Text from '../../typography/Text/Text';
import styles from './FallbackState.module.css';

interface FallbackStateOwnProps {
  title: string;
  description: string;
  icon?: JSX.Element;
  action?: JSX.Element;
  titleClass?: string;
  descriptionClass?: string;
  iconClass?: string;
}

const FallbackState = (props: Props<FallbackStateOwnProps>) => {
  return (
    <div class={classNames(styles.container, props.class)}>
      <Show when={props.icon}>
        <div class={classNames(styles.icon, props.iconClass)}>{props.icon}</div>
      </Show>
      <Heading as="h1" level={1} class={classNames(styles.title, props.titleClass)}>
        {props.title}
      </Heading>
      <Text tone="muted" class={classNames(styles.description, props.descriptionClass)}>
        {props.description}
      </Text>
      <Show when={props.action}>
        <div class={styles.action}>{props.action}</div>
      </Show>
    </div>
  );
};

export default FallbackState;
