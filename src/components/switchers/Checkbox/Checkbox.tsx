import { createUniqueId, type JSX, splitProps } from 'solid-js';

import CheckboxIndicator from '~/components/switchers/CheckboxIndicator/CheckboxIndicator';
import ChoiceControl from '~/components/switchers/ChoiceControl/ChoiceControl';
import LabelText from '~/components/typography/LabelText/LabelText';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './Checkbox.module.css';

interface CheckboxOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: JSX.Element;
  description?: JSX.Element;
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
      label={<LabelText label={local.label} description={local.description} />}
      labelId={textId()}
    />
  );
};

export default Checkbox;
