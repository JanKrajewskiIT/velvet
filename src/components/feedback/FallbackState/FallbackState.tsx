import { createMemo, type JSX, Show, splitProps } from 'solid-js';

import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FallbackState.module.css';

interface FallbackStateOwnProps {
  label: string;
  description: string;
  icon?: JSX.Element;
  action?: JSX.Element;
  iconClass?: string;
}

const FallbackState = (props: Props<FallbackStateOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'description', 'icon', 'action', 'iconClass']);
  const containerClass = createMemo(() => classNames(styles.container, local.class));

  return (
    <div {...rest} class={containerClass()}>
      <Show when={local.icon}>
        <div class={classNames(styles.icon, local.iconClass)}>{local.icon}</div>
      </Show>
      <Heading as="div" level={2} variant="titleLg">
        {local.label}
      </Heading>
      <Text tone="muted">{local.description}</Text>
      <Show when={local.action}>
        <div class={styles.action}>{local.action}</div>
      </Show>
    </div>
  );
};

export default FallbackState;
