import type { JSX } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type { TypographyTone } from '~/components/typography/Typography/Typography';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownTriggerContent.module.css';

export interface DropdownTriggerContentProps {
  label: string;
  labelId?: string;
  class?: string;
  tone?: 'default' | 'inverse';
  labelTone?: TypographyTone;
  size?: ComponentSize;
  children?: JSX.Element;
}

const DropdownTriggerContent = (props: Props<DropdownTriggerContentProps>) => {
  const labelVariant = () => {
    if (props.size === 'lg') return 'bodyMd';
    return 'bodySm';
  };

  const labelTone = () => {
    if (props.tone === 'inverse') return 'inverse';
    return props.labelTone ?? 'inherit';
  };

  return (
    <span class={classNames(styles.root, props.class)}>
      <Text as="span" id={props.labelId} variant={labelVariant()} tone={labelTone()} class={styles.label}>
        {props.label}
      </Text>
      {props.children && (
        <span class={classNames(styles.suffix, props.tone === 'inverse' && styles.suffixInverse)}>
          {props.children}
        </span>
      )}
    </span>
  );
};

export default DropdownTriggerContent;
