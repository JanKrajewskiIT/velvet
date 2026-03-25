import { type JSX, Show, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button, { type ButtonSize, type ButtonVariant } from '../Button/Button';
import styles from './AffixButton.module.css';

interface AffixButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'prefix'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  text: string;
  contentClass?: string;
  prefixClass?: string;
  bodyClass?: string;
  suffixClass?: string;
}

const AffixButton = (props: Props<AffixButtonOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'size',
    'prefix',
    'suffix',
    'text',
    'contentClass',
    'prefixClass',
    'bodyClass',
    'suffixClass',
  ]);

  const textTone = () => {
    const variant = local.variant ?? 'primary';
    if (variant === 'primary' || variant === 'danger') return 'inverse';
    return 'default';
  };

  return (
    <Button {...rest} variant={local.variant} size={local.size} class={local.class}>
      <span class={classNames(local.class, styles.content)}>
        <Show when={local.prefix}>
          <span class={classNames(styles.prefix, local.prefixClass)}>{local.prefix}</span>
        </Show>
        <Text as="span" variant="labelMd" tone={textTone()} class={classNames(styles.body, local.bodyClass)}>
          {local.text}
        </Text>
        <Show when={local.suffix}>
          <span class={classNames(styles.suffix, local.suffixClass)}>{local.suffix}</span>
        </Show>
      </span>
    </Button>
  );
};

export default AffixButton;
