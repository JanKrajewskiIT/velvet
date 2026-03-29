import { createMemo, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { OptionalLabelOnlyProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../Text/Text';
import styles from './LabelText.module.css';

interface LabelTextOwnProps extends OptionalLabelOnlyProps {
  description?: string;
}

const LabelText = (props: Props<LabelTextOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'label', 'description']);
  const hasContent = createMemo(() => Boolean(local.label || local.description));

  return (
    <Show when={hasContent()}>
      <span {...rest} class={classNames(styles.text, local.class)}>
        <Show when={local.label}>
          <Text as="span" variant="labelLg">
            {local.label}
          </Text>
        </Show>
        <Show when={local.description}>
          <Text as="span" variant="caption" tone="muted">
            {local.description}
          </Text>
        </Show>
      </span>
    </Show>
  );
};

export default LabelText;
