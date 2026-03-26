import { FiChevronDown } from 'solid-icons/fi';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { SpanCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './AccordionIcon.module.css';

interface AccordionIconOwnProps extends SpanCoreNativeProps {
  isOpen?: boolean;
}

const AccordionIcon = (props: Props<AccordionIconOwnProps>) => {
  const [local, rest] = splitProps(props, ['isOpen', 'class']);

  return (
    <span class={classNames(styles.icon, local.isOpen && styles.open, local.class)} {...rest}>
      <FiChevronDown />
    </span>
  );
};

export default AccordionIcon;
