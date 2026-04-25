import type { JSX } from 'solid-js';
import { createMemo, splitProps } from 'solid-js';

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
  const [local, rest] = splitProps(props, ['label', 'labelId', 'class', 'tone', 'labelTone', 'size', 'children']);
  const labelVariant = createMemo(() => {
    if (local.size === 'lg') return 'bodyMd' as const;
    return 'bodySm' as const;
  });

  const labelToneResolved = createMemo(() => {
    if (local.tone === 'inverse') return 'inverse' as const;
    return local.labelTone ?? ('inherit' as const);
  });

  return (
    <span {...rest} class={classNames(styles.root, local.class)}>
      <Text as="span" id={local.labelId} variant={labelVariant()} tone={labelToneResolved()} class={styles.label}>
        {local.label}
      </Text>
      {local.children && (
        <span class={classNames(styles.suffix, local.tone === 'inverse' && styles.suffixInverse)}>
          {local.children}
        </span>
      )}
    </span>
  );
};

export default DropdownTriggerContent;
