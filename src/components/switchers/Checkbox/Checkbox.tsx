import { createUniqueId, splitProps } from 'solid-js';

import ChoiceControl from '~/components/switchers/ChoiceControl/ChoiceControl';
import type Props from '~/models/Props';
import type { ChoiceInputCoreNativeProps } from '~/models/Props';

interface CheckboxOwnProps extends Omit<ChoiceInputCoreNativeProps, 'type'> {
  label?: string;
  description?: string;
  labelId?: string;
}

const Checkbox = (props: Props<CheckboxOwnProps>) => {
  const generatedId = createUniqueId();
  const [local, rest] = splitProps(props, ['label', 'description', 'class', 'id', 'labelId']);

  const inputId = () => local.id ?? generatedId;
  const textId = () => local.labelId ?? `${inputId()}-text`;

  return (
    <ChoiceControl
      {...rest}
      type="checkbox"
      id={inputId()}
      class={local.class}
      label={local.label}
      description={local.description}
      labelId={textId()}
    />
  );
};

export default Checkbox;
