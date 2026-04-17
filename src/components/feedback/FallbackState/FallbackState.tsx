import type { IconTypes } from 'solid-icons';
import { type JSX, Show, splitProps } from 'solid-js';

import Icon from '~/components/media/Icon/Icon';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FallbackState.module.css';

interface FallbackStateOwnProps {
  label: string;
  description: string;
  icon?: IconTypes;
  action?: JSX.Element;
}

const FallbackState = (props: Props<FallbackStateOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'description', 'icon', 'action']);

  return (
    <div {...rest} class={classNames(styles.container, local.class)}>
      <Show when={local.icon} keyed>
        {(icon) => <Icon class={styles.icon} icon={icon} size="lg" variant="muted" />}
      </Show>
      <Heading as="div" level={2} variant="titleLg">
        {local.label}
      </Heading>
      <Text as="p" variant="bodySm" tone="muted">
        {local.description}
      </Text>
      <Show when={local.action}>
        <div class={styles.action}>{local.action}</div>
      </Show>
    </div>
  );
};

export default FallbackState;
