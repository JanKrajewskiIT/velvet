import type { JSX } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type { TypographyTone } from '~/components/typography/Typography/Typography';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownTriggerContent.module.css';

export interface DropdownTriggerContentProps {
  label: string;
  labelId?: string;
  class?: string;
  tone?: 'default' | 'inverse';
  labelTone?: TypographyTone;
  children?: JSX.Element;
}

const DropdownTriggerContent = (props: Props<DropdownTriggerContentProps>) => {
  return (
    <span class={classNames(styles.root, props.class)}>
      <Text
        as="span"
        id={props.labelId}
        variant="bodySm"
        tone={props.tone === 'inverse' ? 'inverse' : props.labelTone}
        class={styles.label}
      >
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
