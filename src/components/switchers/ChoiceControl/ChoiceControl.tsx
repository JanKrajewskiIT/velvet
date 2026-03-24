import type { JSX } from 'solid-js';
import { createUniqueId, Show, splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ChoiceControl.module.css';

interface ChoiceControlOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type: 'checkbox' | 'radio';
  label: JSX.Element;
  labelId?: string;
  wrapperClass?: string;
  controlClass?: string;
  inputClass?: string;
  indicatorClass?: string;
  indicator?: JSX.Element;
}

const ChoiceControl = (props: Props<ChoiceControlOwnProps>) => {
  const generatedLabelId = createUniqueId();
  const [local, rest] = splitProps(props, [
    'type',
    'class',
    'label',
    'labelId',
    'wrapperClass',
    'controlClass',
    'inputClass',
    'indicatorClass',
    'indicator',
  ]);

  const hasLabel = () => local.label !== '';
  const resolvedLabelId = () => (hasLabel() ? (local.labelId ?? generatedLabelId) : undefined);

  return (
    <label class={classNames(styles.field, local.wrapperClass)}>
      <span class={classNames(styles.control, local.controlClass, local.class)}>
        <input
          {...rest}
          type={local.type}
          class={classNames(styles.input, local.inputClass)}
          aria-labelledby={resolvedLabelId()}
        />
        {local.indicator ?? <span class={classNames(styles.indicator, local.indicatorClass)} aria-hidden="true" />}
      </span>
      <Show when={hasLabel()}>
        <span id={resolvedLabelId()}>{local.label}</span>
      </Show>
    </label>
  );
};

export default ChoiceControl;
