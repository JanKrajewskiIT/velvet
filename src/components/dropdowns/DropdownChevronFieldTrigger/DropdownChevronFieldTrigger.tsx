import { FiChevronDown } from 'solid-icons/fi';

import type { InputSize } from '~/components/inputs/Input/Input';
import type { TypographyTone } from '~/components/typography/Typography/Typography';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownFieldTrigger from '../DropdownFieldTrigger/DropdownFieldTrigger';
import styles from './DropdownChevronFieldTrigger.module.css';

interface DropdownChevronFieldTriggerOwnProps extends Omit<ButtonCoreNativeProps, 'children'> {
  label: string;
  open: boolean;
  size?: InputSize;
  invalid?: boolean;
  readOnly?: boolean;
  contentClass?: string;
  tone?: 'default' | 'inverse';
  labelTone?: TypographyTone;
}

const DropdownChevronFieldTrigger = (props: Props<DropdownChevronFieldTriggerOwnProps>) => {
  return (
    <DropdownFieldTrigger {...props}>
      <span
        class={classNames(
          styles.chevron,
          props.tone === 'inverse' && styles.chevronInverse,
          props.open && styles.chevronOpen
        )}
      >
        <FiChevronDown />
      </span>
    </DropdownFieldTrigger>
  );
};

export default DropdownChevronFieldTrigger;
