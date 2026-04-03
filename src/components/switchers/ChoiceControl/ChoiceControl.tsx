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
    'indicator',
    'aria-labelledby',
  ]);
  const hasLabel = createMemo(() => Boolean(local.label || local.description));
  const resolvedLabelId = createMemo(() => (hasLabel() ? (local.labelId ?? generatedLabelId) : undefined));
  const labelledBy = createMemo(() => joinAriaIds(local['aria-labelledby'], resolvedLabelId()));

  return (
    <label class={classNames(styles.field, local.class)} data-type={local.type}>
      <span class={styles.control}>
        <input {...rest} type={local.type} class={styles.input} aria-labelledby={labelledBy()} />
        {local.indicator ?? <span class={styles.indicator} aria-hidden="true" />}
      </span>
      <Show when={hasLabel()}>
        <LabelText id={resolvedLabelId()} label={local.label} description={local.description} />
      </Show>
    </label>
  );
};

export default ChoiceControl;
