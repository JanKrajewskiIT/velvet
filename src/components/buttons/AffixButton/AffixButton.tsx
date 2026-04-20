import { type JSX, Show, splitProps } from 'solid-js';

import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps, ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../Button/Button';
import { type ButtonVariant } from '../shared/buttonVariants';
import styles from './AffixButton.module.css';

interface AffixButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children' | 'prefix'> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  text: string;
  prefixClass?: string;
  bodyClass?: string;
}

const AffixButton = (props: Props<AffixButtonOwnProps>) => {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'size',
    'prefix',
    'suffix',
    'text',
    'prefixClass',
    'bodyClass',
  ]);

  return (
    <Button {...rest} variant={local.variant} size={local.size} class={local.class}>
      <span class={styles.content}>
        <Show when={local.prefix}>
          <span class={classNames(styles.prefix, local.prefixClass)}>{local.prefix}</span>
        </Show>
        <Text as="span" variant="labelMd" tone="inherit" class={classNames(styles.body, local.bodyClass)}>
          {local.text}
        </Text>
        <Show when={local.suffix}>
          <span class={styles.suffix}>{local.suffix}</span>
        </Show>
      </span>
    </Button>
  );
};

export default AffixButton;
