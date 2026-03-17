import { FiChevronDown } from 'solid-icons/fi';
import type { JSX } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './DropdownTriggerContent.module.css';

export interface DropdownTriggerContentProps {
  label: JSX.Element;
  open: boolean;
  placeholder?: boolean;
  class?: string;
}

const DropdownTriggerContent = (props: Props<DropdownTriggerContentProps>) => {
  return (
    <span class={classNames(styles.root, props.class)}>
      <Text as="span" variant="bodySm" class={classNames(styles.label, props.placeholder && styles.placeholder)}>
        {props.label}
      </Text>
      <FiChevronDown class={classNames(styles.chevron, props.open && styles.chevronOpen)} />
    </span>
  );
};

export default DropdownTriggerContent;
