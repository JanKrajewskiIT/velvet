import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';
import getInputSizeClass from '~/utils/getInputSizeClass';

import Input, { type InputSize } from '../Input/Input';
import styles from './AffixInput.module.css';

interface AffixInputOwnProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'class' | 'size' | 'prefix'> {
  size?: InputSize;
  invalid?: boolean;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  class?: string;
  inputClass?: string;
}

const AffixInput = (props: Props<AffixInputOwnProps>) => {
  const [local, rest] = splitProps(props, ['class', 'inputClass', 'size', 'invalid', 'readOnly', 'prefix', 'suffix']);

  const sizeClass = () => getInputSizeClass(styles, local.size);

  const hasPrefix = () => local.prefix !== undefined && local.prefix !== null;
  const hasSuffix = () => local.suffix !== undefined && local.suffix !== null;

  return (
    <div
      class={classNames(
        styles.root,
        sizeClass(),
        local.invalid && styles.invalid,
        local.readOnly && styles.readOnly,
        rest.disabled && styles.disabled,
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
        class={classNames(styles.input, local.inputClass)}
      />
      {hasSuffix() && <span class={styles.suffix}>{local.suffix}</span>}
    </div>
  );
};

export default AffixInput;
