import { createMemo, createUniqueId, type JSX, Show, splitProps } from 'solid-js';

import LabelText from '~/components/typography/LabelText/LabelText';
import type Props from '~/models/Props';
import type { ChoiceInputCoreNativeProps } from '~/models/Props';
import { joinAriaIds } from '~/utils/aria';
import classNames from '~/utils/classNames';

import styles from './ChoiceControl.module.css';

interface ChoiceControlOwnProps extends Omit<ChoiceInputCoreNativeProps, 'type'> {
  type: 'checkbox' | 'radio';
  label?: string;
  description?: string;
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
    'description',
    'labelId',
    'wrapperClass',
    'controlClass',
    'inputClass',
    'indicatorClass',
    'indicator',
    'aria-labelledby',
  ]);
  const hasLabel = createMemo(() => Boolean(local.label || local.description));
  const resolvedLabelId = createMemo(() => (hasLabel() ? (local.labelId ?? generatedLabelId) : undefined));
  const labelledBy = createMemo(() => joinAriaIds(local['aria-labelledby'], resolvedLabelId()));

  return (
    <label class={classNames(styles.field, local.wrapperClass)}>
      <span class={classNames(styles.control, local.controlClass, local.class)}>
        <input
          {...rest}
          type={local.type}
          class={classNames(styles.input, local.inputClass)}
          aria-labelledby={labelledBy()}
        />
        {local.indicator ?? <span class={classNames(styles.indicator, local.indicatorClass)} aria-hidden="true" />}
      </span>
      <Show when={hasLabel()}>
        <LabelText id={resolvedLabelId()} label={local.label} description={local.description} />
      </Show>
    </label>
  );
};

export default ChoiceControl;
