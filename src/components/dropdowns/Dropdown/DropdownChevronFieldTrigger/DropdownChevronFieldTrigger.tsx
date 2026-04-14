import { FiChevronDown } from 'solid-icons/fi';

import { type ButtonVariant, resolveDropdownTriggerTone } from '~/components/buttons/shared/buttonVariants';
import type { TypographyTone } from '~/components/typography/Typography/Typography';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import DropdownFieldTrigger from '../DropdownFieldTrigger/DropdownFieldTrigger';
import styles from './DropdownChevronFieldTrigger.module.css';

interface DropdownChevronFieldTriggerOwnProps extends Omit<ButtonCoreNativeProps, 'children'> {
  label: string;
  labelId?: string;
  open: boolean;
  size?: ComponentSize;
  invalid?: boolean;
  readOnly?: boolean;
  variant?: ButtonVariant;
  tone?: 'default' | 'inverse';
  labelTone?: TypographyTone;
}

const DropdownChevronFieldTrigger = (props: Props<DropdownChevronFieldTriggerOwnProps>) => {
  const resolvedTone = () => props.tone ?? resolveDropdownTriggerTone(props.variant);

  return (
    <DropdownFieldTrigger {...props}>
      <span
        class={classNames(
          styles.chevron,
          resolvedTone() === 'inverse' && styles.chevronInverse,
          props.open && styles.chevronOpen,
        )}
      >
        <FiChevronDown />
      </span>
    </DropdownFieldTrigger>
  );
};

export default DropdownChevronFieldTrigger;
