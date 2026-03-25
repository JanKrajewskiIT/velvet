import { createUniqueId, splitProps } from 'solid-js';

import CheckboxIndicator from '~/components/switchers/CheckboxIndicator/CheckboxIndicator';
import ChoiceControl from '~/components/switchers/ChoiceControl/ChoiceControl';
import type Props from '~/models/Props';
import type { ChoiceInputCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Checkbox.module.css';

interface CheckboxOwnProps extends Omit<ChoiceInputCoreNativeProps, 'type'> {
  label?: string;
  description?: string;
  labelId?: string;
  wrapperClass?: string;
}

const Checkbox = (props: Props<CheckboxOwnProps>) => {
  const generatedId = createUniqueId();
  const [local, rest] = splitProps(props, ['label', 'description', 'class', 'id', 'labelId', 'wrapperClass']);

  const inputId = () => local.id ?? generatedId;
  const textId = () => local.labelId ?? `${inputId()}-text`;

  return (
    <ChoiceControl
      {...rest}
      type="checkbox"
      id={inputId()}
      class={classNames(styles.control, local.class)}
      inputClass={styles.input}
      indicator={<CheckboxIndicator class={styles.indicator} />}
      wrapperClass={local.wrapperClass}
      label={local.label}
      description={local.description}
      labelId={textId()}
    />
  );
};

export default Checkbox;
