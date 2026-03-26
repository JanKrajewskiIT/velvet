import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import type { ComponentSize, InputCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';
import getInputSizeClass from '~/utils/getInputSizeClass';

import FieldBase from '../FieldBase/FieldBase';
import Input from '../Input/Input';
import fieldInputResetStyles from '../shared/fieldInputReset.module.css';
import styles from './AffixInput.module.css';

interface AffixInputOwnProps extends InputCoreNativeProps {
  size?: ComponentSize;
  invalid?: boolean;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  class?: string;
  inputClass?: string;
}

const AffixInput = (props: Props<AffixInputOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'inputClass', 'size', 'invalid', 'readOnly', 'prefix', 'suffix']);

  const affixSizeClass = () => getInputSizeClass(styles, local.size);

  const hasPrefix = () => local.prefix !== undefined && local.prefix !== null;
  const hasSuffix = () => local.suffix !== undefined && local.suffix !== null;

  return (
    <FieldBase
      as="div"
      size={local.size}
      invalid={local.invalid}
      readOnly={local.readOnly}
      disabled={rest.disabled}
      focusStyle="within"
      class={classNames(
        styles.root,
        affixSizeClass(),
        hasPrefix() && styles.hasPrefix,
        hasSuffix() && styles.hasSuffix,
        local.class
      )}
    >
      {hasPrefix() && <span class={styles.prefix}>{local.prefix}</span>}
      <Input
        {...rest}
        size={local.size}
        invalid={local.invalid}
        readOnly={local.readOnly}
        disabled={rest.disabled}
        class={classNames(fieldInputResetStyles.reset, styles.input, local.inputClass)}
      />
      {hasSuffix() && <span class={styles.suffix}>{local.suffix}</span>}
    </FieldBase>
  );
};

export default AffixInput;
