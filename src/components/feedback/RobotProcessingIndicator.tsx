import { splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import { Icon } from '../display/Icon';
import { Text } from '../primitives/Text';
import styles from './RobotProcessingIndicator.module.css';

export interface RobotProcessingIndicatorProps extends HtmlProps<HTMLSpanElement, 'aria-label' | 'aria-live' | 'role'> {
  /** @default localized "Processing" */
  label?: string;
}

/** Inline processing status with a blinking robot icon and visible label. */
export const RobotProcessingIndicator = (props: RobotProcessingIndicatorProps) => {
  const [local, rest] = splitProps(props, ['label', 'class', 'style']);
  const translate = useTranslate();

  return (
    <span {...rest} role="status" class={cx(styles.robotProcessingIndicator, local.class)} style={local.style}>
      <Icon name="robot" class={styles.robotProcessingIndicatorPartIcon} size="1.1em" />
      <Text as="span" variant="body-sm" tone="inherit">
        {local.label ?? translate('velvet.feedback.robotProcessingIndicator.label')}
      </Text>
    </span>
  );
};
