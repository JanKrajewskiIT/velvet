import { createUniqueId, type JSX, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import LabelText from '../../typography/LabelText/LabelText';
import CheckboxControl from '../CheckboxControl/CheckboxControl';
import styles from './Checkbox.module.css';

interface CheckboxOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: JSX.Element;
  description?: JSX.Element;
}

const Checkbox = (props: Props<CheckboxOwnProps>) => {
  const generatedId = createUniqueId();
  const [local, rest] = splitProps(props, ['label', 'description', 'class', 'id']);

  const inputId = () => local.id ?? generatedId;
  const hasText = () => Boolean(local.label || local.description);
  const textId = () => `${inputId()}-text`;

  return (
    <CheckboxControl
      {...rest}
      id={inputId()}
      class={styles.control}
      wrapperClass={classNames(styles.wrapper, local.class)}
      label={hasText() ? <LabelText label={local.label} description={local.description} /> : undefined}
      labelId={hasText() ? textId() : undefined}
    />
  );
};

export default Checkbox;
